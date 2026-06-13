""" 
omaquu-linksite Admin Dashboard
Flask backend for managing data.json + theme settings

Auth: Simple password protection via query param or cookie.
      Set ADMIN_PASSWORD env var (default: changeme)
"""
import json
import os
import hashlib
import secrets
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, render_template, make_response

app = Flask(__name__, template_folder='templates', static_folder='static')
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'data.json')
THEME_FILE = os.path.join(os.path.dirname(__file__), '..', 'theme.json')

# ─── Auth config ───
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'changeme')
COOKIE_NAME = 'omaquu_admin_s'
COOKIE_MAX_AGE = 60 * 60 * 24  # 24 hours

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

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
def read_data():
    if not os.path.exists(DATA_FILE):
        return {
            "profile": {"username": "@omaquu", "displayName": "omaquu", "bio": "Someloukkaantuja", "avatar": ""},
            "links": [],
            "codes": [],
            "affiliates": []
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
        "success": "#10b981"
    }

# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('admin.html')

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    pw = data.get('password', '')
    if pw == ADMIN_PASSWORD:
        # Cookie stores hash of the password — same value is_authenticated() checks
        resp = make_response(jsonify({'status': 'ok'}))
        resp.set_cookie(COOKIE_NAME, hash_pw(ADMIN_PASSWORD), max_age=COOKIE_MAX_AGE, httponly=True)
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

# ── Data endpoints ──
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
    return jsonify({"status": "ok"})

@app.route('/api/links', methods=['GET', 'POST'])
@auth_required
def links():
    data = read_data()
    if request.method == 'GET':
        return jsonify(data.get('links', []))
    data.setdefault('links', []).append(request.json)
    write_data(data)
    return jsonify({"status": "ok", "id": request.json.get('id')})

@app.route('/api/links/<id>', methods=['PUT', 'DELETE'])
@auth_required
def link_item(id):
    data = read_data()
    links = data.get('links', [])
    if request.method == 'PUT':
        for i, l in enumerate(links):
            if l.get('id') == id:
                links[i].update(request.json)
                break
    else:
        data['links'] = [l for l in links if l.get('id') != id]
    write_data(data)
    return jsonify({"status": "ok"})

@app.route('/api/codes', methods=['GET', 'POST'])
@auth_required
def codes():
    data = read_data()
    if request.method == 'GET':
        return jsonify(data.get('codes', []))
    data.setdefault('codes', []).append(request.json)
    write_data(data)
    return jsonify({"status": "ok"})

@app.route('/api/codes/<id>', methods=['PUT', 'DELETE'])
@auth_required
def code_item(id):
    data = read_data()
    codes = data.get('codes', [])
    if request.method == 'PUT':
        for i, c in enumerate(codes):
            if c.get('id') == id:
                codes[i].update(request.json)
                break
    else:
        data['codes'] = [c for c in codes if c.get('id') != id]
    write_data(data)
    return jsonify({"status": "ok"})

@app.route('/api/affiliates', methods=['GET', 'POST'])
@auth_required
def affiliates():
    data = read_data()
    if request.method == 'GET':
        return jsonify(data.get('affiliates', []))
    data.setdefault('affiliates', []).append(request.json)
    write_data(data)
    return jsonify({"status": "ok"})

@app.route('/api/affiliates/<id>', methods=['PUT', 'DELETE'])
@auth_required
def affiliate_item(id):
    data = read_data()
    affs = data.get('affiliates', [])
    if request.method == 'PUT':
        for i, a in enumerate(affs):
            if a.get('id') == id:
                affs[i].update(request.json)
                break
    else:
        data['affiliates'] = [a for a in affs if a.get('id') != id]
    write_data(data)
    return jsonify({"status": "ok"})

# ── Theme endpoints ──
@app.route('/api/theme', methods=['GET'])
@auth_required
def get_theme():
    return jsonify(read_theme())

@app.route('/api/theme', methods=['PUT'])
@auth_required
def update_theme():
    write_theme(request.json)
    return jsonify({"status": "ok"})

@app.route('/api/theme/presets', methods=['GET'])
@auth_required
def theme_presets():
    return jsonify({
        "orange": {"accent": "#ff6b35", "accentGlow": "rgba(255, 107, 53, 0.3)", "bgPrimary": "#0a0a0f"},
        "purple": {"accent": "#8b5cf6", "accentGlow": "rgba(139, 92, 246, 0.3)", "bgPrimary": "#0f0a1a"},
        "green": {"accent": "#10b981", "accentGlow": "rgba(16, 185, 129, 0.3)", "bgPrimary": "#0a0f0a"},
        "red": {"accent": "#ef4444", "accentGlow": "rgba(239, 68, 68, 0.3)", "bgPrimary": "#0f0a0a"},
        "blue": {"accent": "#3b82f6", "accentGlow": "rgba(59, 130, 246, 0.3)", "bgPrimary": "#0a0a0f"},
        "pink": {"accent": "#ec4899", "accentGlow": "rgba(236, 72, 153, 0.3)", "bgPrimary": "#0f0a0f"},
    })

if __name__ == '__main__':
    print("🎨 Admin dashboard: http://localhost:8898")
    app.run(host='0.0.0.0', port=8898, debug=True)