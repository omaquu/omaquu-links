""" omaquu-linksite Admin Dashboard v4
Flask backend: GitHub auto-push + stream type + codes tags + youtube affiliate + 10 presets
"""
import json, os, re, hashlib, subprocess
from functools import wraps
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template, make_response

_dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(_dotenv_path)

app = Flask(__name__, template_folder='templates', static_folder='static')
BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
DATA_FILE     = os.path.join(BASE_DIR, '..', 'data.json')
THEME_FILE    = os.path.join(BASE_DIR, '..', 'theme.json')
REPO_DIR      = os.path.join(BASE_DIR, '..')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'changeme')
COOKIE_NAME    = 'omaquu_admin_s'
COOKIE_MAX_AGE = 60 * 60 * 24

# ─── Auth ─────────────────────────────────────────────────────────────────────
def hash_pw(pw): return hashlib.sha256(pw.encode()).hexdigest()
def get_cookie_pw(): return request.cookies.get(COOKIE_NAME, '')
def is_authenticated(): return get_cookie_pw() == hash_pw(ADMIN_PASSWORD)

def auth_required(f):
    @wraps(f)
    def dec(*a, **kw):
        if not is_authenticated(): return jsonify({'error': 'Unauthorized'}), 401
        return f(*a, **kw)
    return dec

# ─── Data helpers ──────────────────────────────────────────────────────────────
def read_data():
    if not os.path.exists(DATA_FILE):
        return {"profile": {"username": "@omaquu", "displayName": "omaquu",
                "bio": "Someloukkaantuja", "avatar": "", "quickLinks": []},
                "links": [], "codes": [], "affiliates": [],
                "streamAlwaysVisible": False, "streamType": "kick", "streamUsername": "omaquu"}
    with open(DATA_FILE, 'r', encoding='utf-8') as f: return json.load(f)

def write_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f: json.dump(data, f, ensure_ascii=False, indent=4)

def read_theme():
    if not os.path.exists(THEME_FILE): return get_default_theme()
    with open(THEME_FILE, 'r', encoding='utf-8') as f: return json.load(f)

def write_theme(theme):
    with open(THEME_FILE, 'w', encoding='utf-8') as f: json.dump(theme, f, ensure_ascii=False, indent=4)

def get_default_theme():
    return {"accent": "#ff6b35", "accentGlow": "rgba(255,107,53,0.3)",
            "bgPrimary": "#0a0a0f", "bgSecondary": "#12121a",
            "bgCard": "#1a1a24", "bgCardHover": "#22222e",
            "textPrimary": "#ffffff", "textSecondary": "#a0a0b0",
            "border": "#2a2a3a", "live": "#ef4444", "success": "#10b981",
            "bgImage": "", "bgAnimation": "", "animationColor": "#ff6b35"}

# ─── GitHub push ───────────────────────────────────────────────────────────────
def _git_push(msg="Update omaquu-links via admin"):
    try:
        remote = subprocess.run(['git','remote','get-url','origin'], cwd=REPO_DIR,
            capture_output=True, text=True, check=True).stdout.strip()
        for c in [['git','config','user.email','pina@omaquu.link'],['git','config','user.name','Pina']]:
            subprocess.run(c, cwd=REPO_DIR, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(['git','add','-A'], cwd=REPO_DIR, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if subprocess.run(['git','diff','--cached','--quiet'], cwd=REPO_DIR).returncode == 0:
            return {"status": "ok", "pushed": False}
        subprocess.run(['git','commit','-m',msg], cwd=REPO_DIR, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(['git','push',remote,'master'], cwd=REPO_DIR, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return {"status": "ok", "pushed": True}
    except Exception as e: return {"status": "error", "message": str(e)}

def _parse_tarralink(html):
    url = re.search(r'href=["\']([^"\']+)["\']', html)
    img = re.search(r'src=["\']([^"\']+)["\']', html)
    return {"url": url.group(1) if url else "", "image": img.group(1) if img else ""}

def _normalize_tags(raw):
    if isinstance(raw, list): return [str(t).strip().lower() for t in raw if str(t).strip()]
    if isinstance(raw, str): return [t.strip().lower() for t in raw.split(',') if t.strip()]
    return []

# ─── Routes: Auth ───────────────────────────────────────────────────────────
@app.route('/')
def index(): return render_template('admin.html')

@app.route('/api/auth/login', methods=['POST'])
def login():
    d = request.get_json(silent=True) or {}
    if d.get('password','') == ADMIN_PASSWORD:
        r = make_response(jsonify({'status':'ok'}))
        r.set_cookie(COOKIE_NAME, hash_pw(ADMIN_PASSWORD), max_age=COOKIE_MAX_AGE, httponly=True)
        return r
    return jsonify({'error':'Väärä salasana'}), 401

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    r = make_response(jsonify({'status':'ok'}))
    r.set_cookie(COOKIE_NAME, '', max_age=0)
    return r

@app.route('/api/auth/status')
def auth_status(): return jsonify({'authenticated': is_authenticated()})

@app.route('/api/sync/push', methods=['POST'])
@auth_required
def github_push(): return jsonify(_git_push())

# ─── Data ──────────────────────────────────────────────────────────────────
@app.route('/api/data')
@auth_required
def get_data(): return jsonify(read_data())

@app.route('/api/profile', methods=['PUT'])
@auth_required
def update_profile():
    d = read_data(); d['profile'].update(request.json); write_data(d)
    _git_push("Update profile"); return jsonify({"status":"ok"})

# ─── Links ─────────────────────────────────────────────────────────────────
@app.route('/api/links', methods=['GET','POST'])
@auth_required
def links():
    d = read_data()
    if request.method == 'GET':
        return jsonify(sorted(d.get('links',[]), key=lambda x: x.get('sort_order',999)))
    n = request.json; n.setdefault('sort_order',999); n.setdefault('color','')
    n.setdefault('id',__import__('uuid').uuid4().hex[:8])
    d.setdefault('links',[]).append(n); write_data(d); _git_push("Add link")
    return jsonify({"status":"ok","id":n['id']})

@app.route('/api/links/<id>', methods=['PUT','DELETE'])
@auth_required
def link_item(id):
    d = read_data(); items = d.get('links',[])
    if request.method == 'PUT':
        for i,l in enumerate(items):
            if l.get('id')==id:
                p=request.json; p.setdefault('sort_order',l.get('sort_order',999)); p.setdefault('color',l.get('color',''))
                items[i].update(p); break
        else: return jsonify({"error":"Not found"}),404
    else: d['links']=[l for l in items if l.get('id')!=id]
    write_data(d); _git_push("Update link"); return jsonify({"status":"ok"})

@app.route('/api/links/reorder', methods=['POST'])
@auth_required
def links_reorder():
    d = read_data(); m = {i['id']:i['sort_order'] for i in request.json}
    for l in d.get('links',[]):
        if l['id'] in m: l['sort_order'] = m[l['id']]
    write_data(d); _git_push("Reorder links"); return jsonify({"status":"ok"})

# ─── Codes ─────────────────────────────────────────────────────────────────
@app.route('/api/codes', methods=['GET','POST'])
@auth_required
def codes():
    d = read_data()
    if request.method == 'GET':
        return jsonify(sorted(d.get('codes',[]), key=lambda x: x.get('sort_order',999)))
    n = request.json; n.setdefault('sort_order',999); n.setdefault('color',''); n.setdefault('tags','')
    n.setdefault('id',__import__('uuid').uuid4().hex[:8])
    d.setdefault('codes',[]).append(n); write_data(d); _git_push("Add code")
    return jsonify({"status":"ok","id":n['id']})

@app.route('/api/codes/<id>', methods=['PUT','DELETE'])
@auth_required
def code_item(id):
    d = read_data(); items = d.get('codes',[])
    if request.method == 'PUT':
        for i,c in enumerate(items):
            if c.get('id')==id:
                p=request.json; p.setdefault('sort_order',c.get('sort_order',999)); p.setdefault('color',c.get('color','')); p.setdefault('tags',c.get('tags',''))
                items[i].update(p); break
        else: return jsonify({"error":"Not found"}),404
    else: d['codes']=[c for c in items if c.get('id')!=id]
    write_data(d); _git_push("Update code"); return jsonify({"status":"ok"})

@app.route('/api/codes/tags')
@auth_required
def codes_tags():
    d = read_data(); counts = {}
    for c in d.get('codes',[]):
        for t in _normalize_tags(c.get('tags','')):
            counts[t] = counts.get(t,0)+1
    return jsonify([{"tag":t,"count":c} for t,c in sorted(counts.items(), key=lambda x:-x[1])])

# ─── Affiliates ────────────────────────────────────────────────────────────
@app.route('/api/affiliates', methods=['GET','POST'])
@auth_required
def affiliates():
    d = read_data()
    if request.method == 'GET':
        return jsonify(sorted(d.get('affiliates',[]), key=lambda x: x.get('sort_order',999)))
    n = request.json; n.setdefault('sort_order',999); n.setdefault('color',''); n.setdefault('tags','')
    n.setdefault('youtubeId',''); n.setdefault('id',__import__('uuid').uuid4().hex[:8])
    d.setdefault('affiliates',[]).append(n); write_data(d); _git_push("Add affiliate")
    return jsonify({"status":"ok","id":n['id']})

@app.route('/api/affiliates/<id>', methods=['PUT','DELETE'])
@auth_required
def affiliate_item(id):
    d = read_data(); items = d.get('affiliates',[])
    if request.method == 'PUT':
        for i,a in enumerate(items):
            if a.get('id')==id:
                p=request.json; p.setdefault('sort_order',a.get('sort_order',999)); p.setdefault('color',a.get('color','')); p.setdefault('tags',a.get('tags','')); p.setdefault('youtubeId',a.get('youtubeId',''))
                items[i].update(p); break
        else: return jsonify({"error":"Not found"}),404
    else: d['affiliates']=[a for a in items if a.get('id')!=id]
    write_data(d); _git_push("Update affiliate"); return jsonify({"status":"ok"})

@app.route('/api/affiliates/tags')
@auth_required
def aff_tags():
    d = read_data(); counts = {}
    for a in d.get('affiliates',[]):
        for t in _normalize_tags(a.get('tags','')):
            counts[t] = counts.get(t,0)+1
    return jsonify([{"tag":t,"count":c} for t,c in sorted(counts.items(), key=lambda x:-x[1])])

@app.route('/api/parser/tarralink', methods=['POST'])
@auth_required
def parse_tarralink():
    h = (request.get_json(silent=True) or {}).get('html','')
    if not h: return jsonify({"error":"Empty HTML"}),400
    return jsonify(_parse_tarralink(h))

# ─── Quick links ───────────────────────────────────────────────────────────
@app.route('/api/quick-links', methods=['GET','POST'])
@auth_required
def quick_links_ep():
    d = read_data(); ql = d['profile'].get('quickLinks',[])
    if request.method == 'GET': return jsonify(ql)
    n = request.json; n.setdefault('id',__import__('uuid').uuid4().hex[:8])
    ql.append(n); d['profile']['quickLinks'] = ql; write_data(d); _git_push("Add quick link")
    return jsonify({"status":"ok","id":n['id']})

@app.route('/api/quick-links/<id>', methods=['PUT','DELETE'])
@auth_required
def quick_link_item(id):
    d = read_data(); ql = d['profile'].get('quickLinks',[])
    if request.method == 'PUT':
        for i,q in enumerate(ql):
            if q.get('id')==id: ql[i].update(request.json); break
        else: return jsonify({"error":"Not found"}),404
    else: ql = [q for q in ql if q.get('id')!=id]
    d['profile']['quickLinks'] = ql; write_data(d); _git_push("Update quick link")
    return jsonify({"status":"ok"})

# ─── Stream config ────────────────────────────────────────────────────────
@app.route('/api/stream-config', methods=['GET','PUT'])
@auth_required
def stream_config():
    d = read_data()
    if request.method == 'GET':
        return jsonify({"streamAlwaysVisible": d.get('streamAlwaysVisible',False),
                         "streamType": d.get('streamType','kick'),
                         "streamUsername": d.get('streamUsername','omaquu')})
    j = request.json
    d['streamAlwaysVisible'] = bool(j.get('streamAlwaysVisible',False))
    d['streamType'] = j.get('streamType','kick')
    d['streamUsername'] = j.get('streamUsername','omaquu')
    write_data(d); _git_push("Update stream config")
    return jsonify({"status":"ok"})

# Keep old endpoint for compatibility
@app.route('/api/stream-always', methods=['GET','PUT'])
@auth_required
def stream_always():
    d = read_data()
    if request.method == 'GET':
        return jsonify({"streamAlwaysVisible": d.get('streamAlwaysVisible',False),
                         "streamType": d.get('streamType','kick')})
    d['streamAlwaysVisible'] = bool(request.json.get('streamAlwaysVisible',False))
    write_data(d); _git_push("Update stream visibility")
    return jsonify({"status":"ok"})

# ─── Theme + 10 presets ───────────────────────────────────────────────────
@app.route('/api/theme')
@auth_required
def get_theme(): return jsonify(read_theme())

@app.route('/api/theme', methods=['PUT'])
@auth_required
def update_theme():
    write_theme(request.json); _git_push("Update theme"); return jsonify({"status":"ok"})

@app.route('/api/theme/presets')
@auth_required
def theme_presets():
    return jsonify({
        "orange": {"accent":"#ff6b35","accentGlow":"rgba(255,107,53,0.3)","bgPrimary":"#0a0a0f","bgSecondary":"#12121a","bgCard":"#1a1a24","bgCardHover":"#22222e","bgAnimation":"","animationColor":"#ff6b35"},
        "purple": {"accent":"#8b5cf6","accentGlow":"rgba(139,92,246,0.3)","bgPrimary":"#0f0a1a","bgSecondary":"#161224","bgCard":"#1e1a2e","bgCardHover":"#262236","bgAnimation":"particles","animationColor":"#8b5cf6"},
        "matrix": {"accent":"#10b981","accentGlow":"rgba(16,185,129,0.3)","bgPrimary":"#050a05","bgSecondary":"#0a120a","bgCard":"#0f1a0f","bgCardHover":"#162216","bgAnimation":"matrix","animationColor":"#10b981"},
        "stars":  {"accent":"#3b82f6","accentGlow":"rgba(59,130,246,0.3)","bgPrimary":"#030812","bgSecondary":"#080d1a","bgCard":"#0e1524","bgCardHover":"#141d2e","bgAnimation":"stars","animationColor":"#3b82f6"},
        "midnight":{"accent":"#ec4899","accentGlow":"rgba(236,72,153,0.3)","bgPrimary":"#0a0510","bgSecondary":"#12081a","bgCard":"#1a0e26","bgCardHover":"#22142e","bgAnimation":"aurora","animationColor":"#ec4899"},
        "neon":   {"accent":"#00ff41","accentGlow":"rgba(0,255,65,0.3)","bgPrimary":"#020802","bgSecondary":"#04100a","bgCard":"#0a1a10","bgCardHover":"#122418","bgAnimation":"grid","animationColor":"#00ff41"},
        "fire":   {"accent":"#ff4500","accentGlow":"rgba(255,69,0,0.3)","bgPrimary":"#0c0402","bgSecondary":"#120804","bgCard":"#1a0e08","bgCardHover":"#24160e","bgAnimation":"fire","animationColor":"#ff4500"},
        "ocean":  {"accent":"#00bcd4","accentGlow":"rgba(0,188,212,0.3)","bgPrimary":"#020808","bgSecondary":"#041210","bgCard":"#081a1e","bgCardHover":"#0e2426","bgAnimation":"bubbles","animationColor":"#00bcd4"},
        "aurora": {"accent":"#a855f7","accentGlow":"rgba(168,85,247,0.3)","bgPrimary":"#04020a","bgSecondary":"#080614","bgCard":"#100e1e","bgCardHover":"#18142a","bgAnimation":"aurora","animationColor":"#a855f7"},
        "galaxy": {"accent":"#7c3aed","accentGlow":"rgba(124,58,237,0.3)","bgPrimary":"#04020c","bgSecondary":"#080614","bgCard":"#0e0c20","bgCardHover":"#16142e","bgAnimation":"galaxy","animationColor":"#7c3aed"},
    })

if __name__ == '__main__':
    print("Admin: http://localhost:8898")
    app.run(host='0.0.0.0', port=8898, debug=True)
