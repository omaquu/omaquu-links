""" omaquu-linksite Admin Dashboard
Flask backend with GitHub auto-push + all enhanced fields
"""
import json
import os
import re
import hashlib
import subprocess
from functools import wraps
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template, make_response

# ─── Config ───────────────────────────────────────────────────────────────────
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

app = Flask(__name__, template_folder='templates', static_folder='static')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE   = os.path.join(BASE_DIR, '..', 'data.json')
THEME_FILE  = os.path.join(BASE_DIR, '..', 'theme.json')
GIT_REMOTE  = 'https://[REDACTED]@github.com/omaquu/omaquu-links.git'

ADMIN_PASSWORD  = os.environ.get('ADMIN_PASSWORD', 'changeme')
COOKIE_NAME     = 'omaquu_admin_s'
COOKIE_MAX_AGE  = 60 * 60 * 24  # 24h
REPO_DIR        = os.path.join(BASE_DIR, '..')

# ─── Auth ─────────────────────────────────────────────────────────────────────
def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def get_cookie_pw():
    return request.cookies.get(COOKIE_NAME, '')

def is_authenticated():
    return get_cookie_pw() == hash_pw(ADMIN_PASSWORD)

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not is_authenticated():
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

# ─── Helpers ──────────────────────────────────────────────────────────────────
def read_data():
    if not os.path.exists(DATA_FILE):
        return {
            "profile": {
                "username": "@omaquu",
                "displayName": "omaquu",
                "bio": "Someloukkaantuja",
                "avatar": "",
                "quickLinks": []  # NEW
            },
            "links": [],
            "codes": [],
            "affiliates": [],
            "streamAlwaysVisible": False  # NEW
        }
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def read_theme():
    if not os.path.exists(THEME_FILE):
        return get_default_theme()
    with open(THEME_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_theme(theme):
    with open(THEME_FILE, 'w', encoding='utf-8') as f:
        json.dump(theme, f, ensure_ascii=False, indent=4)

def get_default_theme():
    return {
        "accent": "#ff6b35",
        "accentGlow": "rgba(255, 107, 53, 0.3)",
        "bgPrimary": "#0a0a0f",
        "bgSecondary": "#12121a",
        "bgCard": "#1a1a24",
        "bgCardHover": "#22222e",
        "textPrimary": "#ffffff",
        "textSecondary": "#a0a0b0",
        "border": "#2a2a3a",
        "live": "#ef4444",
        "success": "#10b981",
        # Background / animation
        "bgImage": "",
        "bgAnimation": "",        # "particles" | "matrix" | "stars" | ""
        "animationColor": "#ff6b35",
    }

def _git_push(commit_msg="Update links"):
    """Stage & commit changed files, then push to GitHub."""
    try:
        subprocess.run(
            ['git', 'config', 'user.email', 'pina@omaquu.link'],
            cwd=REPO_DIR, check=False,
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        subprocess.run(
            ['git', 'config', 'user.name', 'Pina'],
            cwd=REPO_DIR, check=False,
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        subprocess.run(
            ['git', 'add', '-A'],
            cwd=REPO_DIR, check=True,
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        # Check if there are changes
        r = subprocess.run(
            ['git', 'diff', '--cached', '--quiet'],
            cwd=REPO_DIR
        )
        if r.returncode == 0:
            # No changes to commit
            return {"status": "ok", "pushed": False}
        subprocess.run(
            ['git', 'commit', '-m', commit_msg],
            cwd=REPO_DIR, check=True,
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        subprocess.run(
            ['git', 'push', GIT_REMOTE, 'master'],
            cwd=REPO_DIR, check=True,
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        return {"status": "ok", "pushed": True}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def _parse_tarralink(html):
    """Parse <a href><img src></a> HTML snippet into {url, image}."""
    url = ""
    image = ""
    m = re.search(r'href=["\']([^"\']+)["\']', html)
    if m:
        url = m.group(1)
    m = re.search(r'src=["\']([^"\']+)["\']', html)
    if m:
        image = m.group(1)
    return {"url": url, "image": image}

# ──────────────────────────────────────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('admin.html')

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    if data.get('password', '') == ADMIN_PASSWORD:
        resp = make_response(jsonify({'status': 'ok'}))
        resp.set_cookie(
            COOKIE_NAME, hash_pw(ADMIN_PASSWORD),
            max_age=COOKIE_MAX_AGE, httponly=True
        )
        return resp
    return jsonify({'error': 'Väärä salasana'}), 401

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({'status': 'ok'}))
    resp.set_cookie(COOKIE_NAME, '', max_age=0)
    return resp

@app.route('/api/auth/status', methods=['GET'])
def auth_status():
    return jsonify({'authenticated': is_authenticated()})

# ── GitHub sync ────────────────────────────────────────────────────────────────
@app.route('/api/sync/push', methods=['POST'])
@auth_required
def github_push():
    result = _git_push("Update omaquu-links via admin")
    return jsonify(result)

# ──────────────────────────────────────────────────────────────────────────────
# Data endpoints  (all write → git push)
# ──────────────────────────────────────────────────────────────────────────────
@app.route('/api/data', methods=['GET'])
@auth_required
def get_data():
    return jsonify(read_data())

@app.route('/api/profile', methods=['PUT'])
@auth_required
def update_profile():
    data = read_data()
    data['profile'].update(request.json)
    write_data(data)
    _git_push("Update profile")
    return jsonify({"status": "ok"})

# ─── Links ────────────────────────────────────────────────────────────────────
@app.route('/api/links', methods=['GET', 'POST'])
@auth_required
def links():
    data = read_data()
    if request.method == 'GET':
        return jsonify(data.get('links', []))
    new = request.json
    new.setdefault('sort_order', 999)
    new.setdefault('color', '')
    new.setdefault('id', __import__('uuid').uuid4().hex[:8])
    data.setdefault('links', []).append(new)
    write_data(data)
    _git_push("Add link")
    return jsonify({"status": "ok", "id": new['id']})

@app.route('/api/links/<id>', methods=['PUT', 'DELETE'])
@auth_required
def link_item(id):
    data = read_data()
    links = data.get('links', [])
    if request.method == 'PUT':
        for i, l in enumerate(links):
            if l.get('id') == id:
                payload = request.json
                payload.setdefault('sort_order', l.get('sort_order', 999))
                payload.setdefault('color', l.get('color', ''))
                links[i].update(payload)
                break
        else:
            return jsonify({"error": "Not found"}), 404
    else:
        data['links'] = [l for l in links if l.get('id') != id]
    write_data(data)
    _git_push("Update link")
    return jsonify({"status": "ok"})

@app.route('/api/links/reorder', methods=['POST'])
@auth_required
def links_reorder():
    """Reorder: body = [{id, sort_order}, ...]"""
    data = read_data()
    order_map = {item['id']: item['sort_order'] for item in request.json}
    for link in data.get('links', []):
        if link['id'] in order_map:
            link['sort_order'] = order_map[link['id']]
    write_data(data)
    _git_push("Reorder links")
    return jsonify({"status": "ok"})

# ─── Codes ────────────────────────────────────────────────────────────────────
@app.route('/api/codes', methods=['GET', 'POST'])
@auth_required
def codes():
    data = read_data()
    if request.method == 'GET':
        return jsonify(data.get('codes', []))
    new = request.json
    new.setdefault('sort_order', 999)
    new.setdefault('color', '')
    new.setdefault('id', __import__('uuid').uuid4().hex[:8])
    data.setdefault('codes', []).append(new)
    write_data(data)
    _git_push("Add code")
    return jsonify({"status": "ok", "id": new['id']})

@app.route('/api/codes/<id>', methods=['PUT', 'DELETE'])
@auth_required
def code_item(id):
    data = read_data()
    codes = data.get('codes', [])
    if request.method == 'PUT':
        for i, c in enumerate(codes):
            if c.get('id') == id:
                payload = request.json
                payload.setdefault('sort_order', c.get('sort_order', 999))
                payload.setdefault('color', c.get('color', ''))
                codes[i].update(payload)
                break
        else:
            return jsonify({"error": "Not found"}), 404
    else:
        data['codes'] = [c for c in codes if c.get('id') != id]
    write_data(data)
    _git_push("Update code")
    return jsonify({"status": "ok"})

# ─── Affiliates ───────────────────────────────────────────────────────────────
@app.route('/api/affiliates', methods=['GET', 'POST'])
@auth_required
def affiliates():
    data = read_data()
    if request.method == 'GET':
        return jsonify(data.get('affiliates', []))
    new = request.json
    new.setdefault('sort_order', 999)
    new.setdefault('color', '')
    new.setdefault('id', __import__('uuid').uuid4().hex[:8])
    data.setdefault('affiliates', []).append(new)
    write_data(data)
    _git_push("Add affiliate")
    return jsonify({"status": "ok", "id": new['id']})

@app.route('/api/affiliates/<id>', methods=['PUT', 'DELETE'])
@auth_required
def affiliate_item(id):
    data = read_data()
    affs = data.get('affiliates', [])
    if request.method == 'PUT':
        for i, a in enumerate(affs):
            if a.get('id') == id:
                payload = request.json
                payload.setdefault('sort_order', a.get('sort_order', 999))
                payload.setdefault('color', a.get('color', ''))
                affs[i].update(payload)
                break
        else:
            return jsonify({"error": "Not found"}), 404
    else:
        data['affiliates'] = [a for a in affs if a.get('id') != id]
    write_data(data)
    _git_push("Update affiliate")
    return jsonify({"status": "ok"})

@app.route('/api/affiliates/tags', methods=['GET'])
@auth_required
def affiliate_tags():
    """Return tag counts: [{tag, count}, ...]"""
    data = read_data()
    counts = {}
    for a in data.get('affiliates', []):
        raw = a.get('tags', '')
        # Handle both string "tech,foo" and list ["tech","foo"]
        tag_list = raw.split(',') if isinstance(raw, str) else (raw or [])
        for t in tag_list:
            t = t.strip().lower()
            if t:
                counts[t] = counts.get(t, 0) + 1
    sorted_tags = sorted(counts.items(), key=lambda x: -x[1])
    return jsonify([{"tag": t, "count": c} for t, c in sorted_tags])

@app.route('/api/parser/tarralink', methods=['POST'])
@auth_required
def parse_tarralink():
    """Accept {"html": "..."} → {"url": "...", "image": "..."}"""
    body = request.get_json(silent=True) or {}
    html = body.get('html', '')
    if not html:
        return jsonify({"error": "Empty HTML"}), 400
    return jsonify(_parse_tarralink(html))

# ─── Quick links ──────────────────────────────────────────────────────────────
@app.route('/api/quick-links', methods=['GET', 'POST'])
@auth_required
def quick_links_ep():
    data = read_data()
    ql = data['profile'].get('quickLinks', [])
    if request.method == 'GET':
        return jsonify(ql)
    new = request.json
    new.setdefault('id', __import__('uuid').uuid4().hex[:8])
    ql.append(new)
    data['profile']['quickLinks'] = ql
    write_data(data)
    _git_push("Add quick link")
    return jsonify({"status": "ok", "id": new['id']})

@app.route('/api/quick-links/<id>', methods=['PUT', 'DELETE'])
@auth_required
def quick_link_item(id):
    data = read_data()
    ql = data['profile'].get('quickLinks', [])
    if request.method == 'PUT':
        for i, q in enumerate(ql):
            if q.get('id') == id:
                ql[i].update(request.json)
                break
        else:
            return jsonify({"error": "Not found"}), 404
    else:
        ql = [q for q in ql if q.get('id') != id]
    data['profile']['quickLinks'] = ql
    write_data(data)
    _git_push("Update quick link")
    return jsonify({"status": "ok"})

# ─── Stream ───────────────────────────────────────────────────────────────────
@app.route('/api/stream-always', methods=['GET', 'PUT'])
@auth_required
def stream_always():
    data = read_data()
    if request.method == 'GET':
        return jsonify({"streamAlwaysVisible": data.get('streamAlwaysVisible', False)})
    data['streamAlwaysVisible'] = bool(request.json.get('streamAlwaysVisible', False))
    write_data(data)
    _git_push("Update stream visibility")
    return jsonify({"status": "ok"})

# ─── Theme / backgrounds ──────────────────────────────────────────────────────
@app.route('/api/theme', methods=['GET'])
@auth_required
def get_theme():
    return jsonify(read_theme())

@app.route('/api/theme', methods=['PUT'])
@auth_required
def update_theme():
    write_theme(request.json)
    _git_push("Update theme")
    return jsonify({"status": "ok"})

@app.route('/api/theme/presets', methods=['GET'])
@auth_required
def theme_presets():
    return jsonify({
        "orange": {
            "accent": "#ff6b35", "accentGlow": "rgba(255,107,53,0.3)",
            "bgPrimary": "#0a0a0f", "bgSecondary": "#12121a",
            "bgCard": "#1a1a24", "bgCardHover": "#22222e",
            "bgAnimation": "", "animationColor": "#ff6b35"
        },
        "purple": {
            "accent": "#8b5cf6", "accentGlow": "rgba(139,92,246,0.3)",
            "bgPrimary": "#0f0a1a", "bgSecondary": "#161224",
            "bgCard": "#1e1a2e", "bgCardHover": "#262236",
            "bgAnimation": "particles", "animationColor": "#8b5cf6"
        },
        "matrix": {
            "accent": "#10b981", "accentGlow": "rgba(16,185,129,0.3)",
            "bgPrimary": "#050a05", "bgSecondary": "#0a120a",
            "bgCard": "#0f1a0f", "bgCardHover": "#162216",
            "bgAnimation": "matrix", "animationColor": "#10b981"
        },
        "stars": {
            "accent": "#3b82f6", "accentGlow": "rgba(59,130,246,0.3)",
            "bgPrimary": "#030812", "bgSecondary": "#080d1a",
            "bgCard": "#0e1524", "bgCardHover": "#141d2e",
            "bgAnimation": "stars", "animationColor": "#3b82f6"
        },
        "midnight": {
            "accent": "#ec4899", "accentGlow": "rgba(236,72,153,0.3)",
            "bgPrimary": "#0a0510", "bgSecondary": "#12081a",
            "bgCard": "#1a0e26", "bgCardHover": "#22142e",
            "bgAnimation": "", "animationColor": "#ec4899"
        },
    })

if __name__ == '__main__':
    print("Admin: http://localhost:8898")
    app.run(host='0.0.0.0', port=8898, debug=True)
