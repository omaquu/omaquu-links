// ============================================
// omaquu Link Site - Main Script v3
// Features: Links + Codes + Shop + Kick Live
//   + Quick Links + Per-link colors + Stream Always
//   + Background animations (particles/matrix/stars)
//   + Tag counts in shop
// ============================================

// Icon mappings
const ICONS = {
    youtube: 'youtube', twitch: 'tv', kick: 'zap', tiktok: 'music',
    x: 'x', instagram: 'instagram', snapchat: 'circle', discord: 'message-circle',
    kofi: 'coffee', email: 'mail', link: 'external-link'
};

const CATEGORY_LABELS = {
    social: 'Sosiaalinen media', stream: 'Striimi',
    support: 'Tuki', contact: 'Yhteys'
};

let siteData = {
    profile: { username: '@omaquu', displayName: 'omaquu', bio: '', avatar: '', quickLinks: [] },
    links: [], codes: [], affiliates: [], streamAlwaysVisible: false
};

let currentTheme = {};
let activeFilters = new Set();
let activeCodeFilters = new Set();
let codesLayout = 'list';
let shopLayout = 'list';
let animFrame = null;

// ─── LOAD DATA ────────────────────────────────────────────────────────────
async function loadData() {
    try {
        // Load theme first
        try {
            const themeRes = await fetch('theme.json');
            if (themeRes.ok) {
                currentTheme = await themeRes.json();
                applyTheme(currentTheme);
            }
        } catch(e) {}

        // Load data
        const response = await fetch('data.json');
        siteData = await response.json();
        renderAll();
        checkStreamLive();
    } catch (err) {
        console.error('Failed to load data:', err);
        siteData = getFallbackData();
        renderAll();
    }
}

// ─── THEME ────────────────────────────────────────────────────────────────
function applyTheme(theme) {
    const root = document.documentElement;
    const varMap = {
        accent: '--accent', accentGlow: '--accent-glow',
        bgPrimary: '--bg-primary', bgSecondary: '--bg-secondary',
        bgCard: '--bg-card', bgCardHover: '--bg-card-hover',
        textPrimary: '--text-primary', textSecondary: '--text-secondary',
        textMuted: '--text-muted', border: '--border',
        live: '--live', success: '--success'
    };
    Object.entries(varMap).forEach(([key, cssVar]) => {
        if (theme[key]) root.style.setProperty(cssVar, theme[key]);
    });

    // cardStyle: borderRadius + shadow
    if (theme.cardStyle) {
        if (theme.cardStyle.borderRadius)
            root.style.setProperty('--card-radius', theme.cardStyle.borderRadius);
        if (theme.cardStyle.shadow)
            root.style.setProperty('--card-shadow', theme.cardStyle.shadow);
    }

    // Intro animation
    if (theme.intro) {
        document.body.setAttribute('data-intro', theme.intro);
    }

    // Background image
    const bgOverlay = document.getElementById('bgImageOverlay');
    if (bgOverlay) {
        if (theme.bgImage) {
            bgOverlay.style.backgroundImage = `url(${theme.bgImage})`;
            bgOverlay.style.display = 'block';
        } else {
            bgOverlay.style.display = 'none';
        }
    }

    // Background animation
    if (theme.bgAnimation) {
        startBgAnimation(theme.bgAnimation, theme.animationColor || theme.accent || '#ff6b35');
    } else if (animFrame) {
        cancelAnimationFrame(animFrame);
        animFrame = null;
        const canvas = document.getElementById('bgCanvas');
        if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }
}

// ─── BACKGROUND ANIMATIONS ─────────────────────────────────────────────────
function startBgAnimation(type, color) {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    if (animFrame) cancelAnimationFrame(animFrame);

    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if (type === 'particles') {
        // Floating particles
        const particles = Array.from({length: 60}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            alpha: Math.random() * 0.5 + 0.1
        }));

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });
            // Draw lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${r},${g},${b},${0.1 * (1 - dist / 120)})`;
                        ctx.stroke();
                    }
                }
            }
            animFrame = requestAnimationFrame(drawParticles);
        }
        drawParticles();

    } else if (type === 'matrix') {
        // Matrix rain
        const fontSize = 14;
        const cols = Math.floor(canvas.width / fontSize);
        const drops = Array(cols).fill(1);
        const chars = 'OMAQUU0123456789ABCDEF@#$%&';

        function drawMatrix() {
            ctx.fillStyle = 'rgba(10,10,15,0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
            ctx.font = fontSize + 'px monospace';

            drops.forEach((y, i) => {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, y * fontSize);
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });
            animFrame = requestAnimationFrame(drawMatrix);
        }
        drawMatrix();

    } else if (type === 'stars') {
        // Twinkling stars
        const stars = Array.from({length: 150}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.02 + 0.005,
            phase: Math.random() * Math.PI * 2
        }));
        let time = 0;

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.016;
            stars.forEach(s => {
                const alpha = 0.3 + 0.5 * Math.sin(time * s.speed * 60 + s.phase);
                ctx.beginPath();
                ctx.arc(s.x, s.y, Math.max(0.3, s.size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.fill();
            });
            animFrame = requestAnimationFrame(drawStars);
        }
        drawStars();

    } else if (type === 'grid') {
        // Neon grid (Tron-like)
        let offset = 0;
        const spacing = 50;
        function drawGrid() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            offset = (offset + 0.3) % spacing;
            ctx.strokeStyle = `rgba(${r},${g},${b},0.12)`;
            ctx.lineWidth = 1;
            // Vertical lines
            for (let x = -offset; x < canvas.width + spacing; x += spacing) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            // Horizontal lines moving down
            for (let y = -offset; y < canvas.height + spacing; y += spacing) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }
            // Horizon glow
            const grad = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(1, `rgba(${r},${g},${b},0.06)`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            animFrame = requestAnimationFrame(drawGrid);
        }
        drawGrid();

    } else if (type === 'fire') {
        // Rising fire particles
        const sparks = Array.from({length: 80}, () => ({
            x: Math.random() * canvas.width, y: canvas.height + Math.random() * 100,
            vx: (Math.random() - 0.5) * 1.5, vy: -(Math.random() * 2 + 0.5),
            size: Math.random() * 4 + 1, life: Math.random()
        }));
        function drawFire() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            sparks.forEach(p => {
                const alpha = p.life * 0.7;
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
                // Color shifts from accent to orange/yellow as it rises
                const er = Math.min(255, r + (255 - r) * (1 - p.life));
                const eg = Math.min(200, g + (180 - g) * (1 - p.life));
                ctx.fillStyle = `rgba(${er},${eg},${b},${alpha})`;
                ctx.fill();
                p.x += p.vx; p.y += p.vy; p.life -= 0.005;
                if (p.life <= 0) { p.x = Math.random() * canvas.width; p.y = canvas.height + 10; p.life = 1; }
            });
            animFrame = requestAnimationFrame(drawFire);
        }
        drawFire();

    } else if (type === 'bubbles') {
        // Rising bubbles
        const bubbles = Array.from({length: 50}, () => ({
            x: Math.random() * canvas.width, y: canvas.height + Math.random() * 200,
            size: Math.random() * 8 + 2, speed: Math.random() * 0.8 + 0.3,
            wobble: Math.random() * Math.PI * 2
        }));
        let t = 0;
        function drawBubbles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.01;
            bubbles.forEach(b => {
                const bx = b.x + Math.sin(t + b.wobble) * 20;
                ctx.beginPath();
                ctx.arc(bx, b.y, Math.max(1, b.size), 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${r},${g},${b},0.3)`;
                ctx.lineWidth = 1;
                ctx.stroke();
                // Highlight
                ctx.beginPath();
                ctx.arc(bx - b.size * 0.25, b.y - b.size * 0.25, Math.max(0.5, b.size * 0.2), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},0.15)`;
                ctx.fill();
                b.y -= b.speed;
                if (b.y < -b.size * 2) { b.y = canvas.height + b.size; b.x = Math.random() * canvas.width; }
            });
            animFrame = requestAnimationFrame(drawBubbles);
        }
        drawBubbles();

    } else if (type === 'aurora') {
        // Northern lights waves
        let t = 0;
        function drawAurora() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.008;
            for (let band = 0; band < 4; band++) {
                ctx.beginPath();
                const yBase = canvas.height * (0.2 + band * 0.12);
                ctx.moveTo(0, yBase);
                for (let x = 0; x <= canvas.width; x += 4) {
                    const y = yBase + Math.sin(x * 0.005 + t * 2 + band) * 30
                                    + Math.sin(x * 0.01 + t * 3 + band * 2) * 15;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
                const alpha = 0.03 + band * 0.01;
                // Alternate between accent color and complementary
                const cr = band % 2 === 0 ? r : Math.min(255, r + 80);
                const cg = band % 2 === 0 ? g : Math.max(0, g - 60);
                const cb = band % 2 === 0 ? b : Math.min(255, b + 100);
                ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
                ctx.fill();
            }
            animFrame = requestAnimationFrame(drawAurora);
        }
        drawAurora();

    } else if (type === 'galaxy') {
        // Swirling galaxy dots
        const dots = Array.from({length: 200}, () => ({
            angle: Math.random() * Math.PI * 2,
            dist: Math.random() * Math.min(canvas.width, canvas.height) * 0.4 + 20,
            speed: (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1),
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.5 + 0.1
        }));
        const cx = canvas.width / 2, cy = canvas.height / 2;
        function drawGalaxy() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(d => {
                const x = cx + Math.cos(d.angle) * d.dist;
                const y = cy + Math.sin(d.angle) * d.dist * 0.6;
                ctx.beginPath();
                ctx.arc(x, y, Math.max(0.3, d.size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${d.alpha})`;
                ctx.fill();
                d.angle += d.speed;
            });
            // Center glow
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
            grad.addColorStop(0, `rgba(${r},${g},${b},0.08)`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(cx - 60, cy - 60, 120, 120);
            animFrame = requestAnimationFrame(drawGalaxy);
        }
        drawGalaxy();
    } else if (type === 'ufo') {
        // UFO with beam
        let ufoX = canvas.width * 0.25;
        let ufoY = canvas.height * 0.3;
        const ufoSpeed = 0.5;
        const beamWidth = 80;
        const beamHeight = 120;
        
        function drawUFO() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Move UFO horizontally
            ufoX += ufoSpeed;
            if (ufoX > canvas.width + 100) ufoX = -100;
            
            // Draw beam
            ctx.fillStyle = `rgba(${r},${g},${b},0.2)`;
            ctx.beginPath();
            ctx.moveTo(ufoX + 24, ufoY + 24);  // Bottom center of UFO
            ctx.lineTo(ufoX - beamWidth/2, ufoY + beamHeight);  // Bottom left
            ctx.lineTo(ufoX + beamWidth/2, ufoY + beamHeight);  // Bottom right
            ctx.closePath();
            ctx.fill();
            
            // Draw UFO body
            ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
            ctx.beginPath();
            ctx.ellipse(ufoX + 24, ufoY + 24, 30, 12, 0, 0, Math.PI * 2);  // Main body
            ctx.fill();
            
            // UFO dome
            ctx.fillStyle = `rgba(${(r+100)%255},${(g+100)%255},${(b+100)%255},0.9)`;
            ctx.beginPath();
            ctx.arc(ufoX + 24, ufoY + 12, 20, 8, 0, Math.PI, false);  // Dome
            ctx.lineTo(ufoX + 44, ufoY + 12);
            ctx.closePath();
            ctx.fill();
            
            // UFO lights
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(ufoX + 12, ufoY + 24, 3, 0, Math.PI * 2);  // Left light
            ctx.arc(ufoX + 36, ufoY + 24, 3, 0, Math.PI * 2);  // Right light
            ctx.fill();
            
            animFrame = requestAnimationFrame(drawUFO);
        }
        drawUFO();

    } else if (type === 'cyberpunk') {
        // Cyberpunk glitch and neon
        const glitchOffset = 4;
        let time = 0;
        const lines = [];
        for (let i = 0; i < 20; i++) {
            lines.push({
                x1: Math.random() * canvas.width,
                y1: Math.random() * canvas.height * 0.3,
                x2: Math.random() * canvas.width,
                y2: Math.random() * canvas.height * 0.3 + canvas.height * 0.7,
                width: Math.random() * 2 + 1,
                speed: Math.random() * 0.01 + 0.005,
                phase: Math.random() * Math.PI * 2
            });
        }
        const glitches = [];
        for (let i = 0; i < 8; i++) {
            glitches.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                w: Math.random() * 60 + 20,
                h: Math.random() * 20 + 5,
                speed: Math.random() * 0.02 + 0.005,
                offset: Math.random() * 100,
                colorShift: Math.random() > 0.5
            });
        }
        
        function drawCyberpunk() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.016;
            
            // Draw neon lines
            ctx.lineCap = 'round';
            lines.forEach(line => {
                ctx.strokeStyle = `rgba(${r},${g},${b},0.4)`;
                ctx.lineWidth = line.width;
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.stroke();
                
                // Add pulsing
                const pulse = 0.3 + 0.7 * Math.sin(time * line.speed * 100 + line.phase);
                ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 + 0.6 * pulse})`;
                ctx.lineWidth = line.width * (0.5 + pulse * 0.5);
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.stroke();
            });
            
            // Draw occasional glitches
            if (Math.random() < 0.02) {
                const g = glitches[Math.floor(Math.random() * glitches.length)];
                ctx.fillStyle = g.colorShift ? 
                    `rgba(${(b+100)%255},${(r+100)%255},${(g+100)%255},0.3)` :
                    `rgba(${(r+100)%255},${(g+100)%255},${(b+100)%255},0.3)`;
                ctx.fillRect(g.x, g.y, g.w, g.h);
                
                // Glitch offset lines
                for (let i = 0; i < 3; i++) {
                    const offset = (Math.random() - 0.5) * glitchOffset;
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(g.x + offset, g.y + (i * g.h / 2));
                    ctx.lineTo(g.x + g.w + offset, g.y + (i * g.h / 2));
                    ctx.stroke();
                }
            }
            
            // Scan lines
            ctx.strokeStyle = `rgba(0,0,0,0.1)`;
            for (let y = 0; y < canvas.height; y += 4) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            animFrame = requestAnimationFrame(drawCyberpunk);
        }
        drawCyberpunk();

}

// ─── EMBED AUTO-DETECT ────────────────────────────────────────────────────
function detectEmbedFromUrl(url) {
    if (!url) return null;
    url = url.trim();
    const kickMatch = url.match(/kick\.com\/([a-zA-Z0-9_]+)/);
    if (kickMatch) return { type: 'kick', username: kickMatch[1], embedUrl: `https://player.kick.com/${kickMatch[1]}` };
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return { type: 'youtube', videoId: ytMatch[1], embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };
    const twitchMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    if (twitchMatch) return { type: 'twitch', username: twitchMatch[1], embedUrl: `https://player.twitch.tv/?channel=${twitchMatch[1]}&parent=${location.hostname}` };
    const tiktokMatch = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
    if (tiktokMatch) return { type: 'tiktok', videoId: tiktokMatch[1], embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` };
    return null;
}

// ─── RENDER ALL ───────────────────────────────────────────────────────────
function renderAll() {
    renderProfile();
    renderQuickLinks();
    renderLinks();
    renderCodes();
    renderCodeFilterTags();
    renderAffiliates();
    renderFilterTags();
    lucide.createIcons();
}

// ─── PROFILE ──────────────────────────────────────────────────────────────
function renderProfile() {
    const { profile } = siteData;
    document.getElementById('displayName').textContent = profile.displayName;
    document.getElementById('bio').textContent = profile.bio;
    
    const avatar = document.getElementById('avatar');
    const placeholder = document.getElementById('avatarPlaceholder');
    if (profile.avatar) {
        avatar.src = profile.avatar;
        avatar.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        avatar.style.display = 'none';
        placeholder.style.display = 'flex';
        placeholder.textContent = (profile.username?.charAt(1) || 'O').toUpperCase();
    }
}

// ─── QUICK LINKS ──────────────────────────────────────────────────────────
function renderQuickLinks() {
    const container = document.getElementById('quickLinks');
    const links = siteData.profile?.quickLinks || [];
    if (!links.length) { container.innerHTML = ''; return; }

    container.innerHTML = links.map(q => `
        <a href="${escHtml(q.url)}" class="quick-link" target="_blank" rel="noopener noreferrer" title="${escHtml(q.name || q.url)}">
            <span class="quick-link-emoji">${q.emoji || '🔗'}</span>
            ${q.name ? `<span class="quick-link-name">${escHtml(q.name)}</span>` : ''}
        </a>
    `).join('');
}

// ─── LINKS ────────────────────────────────────────────────────────────────
function renderLinks() {
    const container = document.getElementById('linksList');
    container.innerHTML = '';
    
    // Sort by sort_order
    const sorted = [...(siteData.links || [])].sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

    sorted.forEach(link => {
        const iconName = ICONS[link.icon] || 'link';
        const catLabel = CATEGORY_LABELS[link.category] || '';
        const cardClass = `link-card${link.category === 'stream' ? ' stream' : link.category === 'support' ? ' support' : ''}`;
        const liveBadge = link.live ? '<span class="live-badge">LIVE</span>' : '';
        const catText = catLabel ? `<div class="link-category">${catLabel}</div>` : '';
        
        // Per-link color accent
        const colorStyle = link.color ? `style="--link-accent:${link.color}"` : '';
        
        container.innerHTML += `
            <a href="${escHtml(link.url)}" class="${cardClass}" ${colorStyle} target="_blank" rel="noopener noreferrer" onclick="trackClick('links','${link.id}')">
                <div class="link-icon"${link.color ? ` style="background:${link.color}22;color:${link.color}"` : ''}>
                    <i data-lucide="${iconName}"></i>
                </div>
                <div class="link-info">
                    <div class="link-title">${escHtml(link.title)}${liveBadge}</div>
                    ${catText}
                </div>
                <div class="link-arrow"><i data-lucide="chevron-right"></i></div>
            </a>
        `;
    });
}

// ─── CODES ────────────────────────────────────────────────────────────────
function renderCodes() {
    const container = document.getElementById('codesList');
    container.innerHTML = '';
    container.className = 'codes-list layout-' + codesLayout;
    
    const sorted = [...(siteData.codes || [])].sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
    // HOT: top 2 by clicks
    const byClicks = [...sorted].sort((a,b) => (b.clicks||0) - (a.clicks||0));
    const hotIds = new Set();
    for (let i = 0; i < Math.min(2, byClicks.length); i++) {
        if ((byClicks[i].clicks||0) > 0) hotIds.add(byClicks[i].id);
    }
    
    sorted.forEach(code => {
        const isHot = hotIds.has(code.id);
        const colorAccent = code.color ? `style="--code-accent:${code.color}"` : '';
        const codeTags = normalizeTags(code.tags || code.features || '');
        const tagsHtml = codeTags.map(t =>
            `<span class="code-tag" onclick="event.stopPropagation();filterCodeByTag('${escHtml(t)}')">#${escHtml(t)}</span>`
        ).join('');
        
        const card = document.createElement('div');
        card.className = 'code-card compact' + (isHot ? ' hot' : '');
        card.dataset.tags = JSON.stringify(codeTags);
        card.dataset.id = code.id;
        if (code.color) card.style.setProperty('--code-accent', code.color);
        
        card.innerHTML = `
            ${isHot ? '<div class="hot-badge">🔥 HOT</div>' : ''}
            <div class="code-header">
                <span class="code-store">${escHtml(code.store || code.title)}</span>
                <span class="code-discount"${code.color ? ` style="background:linear-gradient(135deg,${code.color},${code.color}cc)"` : ''}>${escHtml(code.discount || '')} OFF</span>
            </div>
            <div class="code-description">${escHtml(code.description || '')}</div>
            ${codeTags.length ? `<div class="code-features">${tagsHtml}</div>` : ''}
            <div class="code-box">
                <span class="code-value"${code.color ? ` style="color:${code.color}"` : ''}>${escHtml(code.code)}</span>
                <button class="copy-btn" onclick="event.stopPropagation();copyCode('${escHtml(code.code)}', this)"${code.color ? ` style="background:${code.color}"` : ''}>
                    <i data-lucide="copy"></i> Copy
                </button>
            </div>
            ${code.url ? `<a href="${escHtml(code.url)}" target="_blank" rel="noopener noreferrer" class="code-link" onclick="event.stopPropagation();trackClick('codes','${code.id}')">
                <i data-lucide="external-link"></i> Siirry kauppaan
            </a>` : ''}
            <div class="code-clicks">${(code.clicks||0)} clicks</div>
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.copy-btn') || e.target.closest('.code-link') || e.target.closest('.code-tag')) return;
            showItemPopup(code, 'code');
        });
        container.appendChild(card);
    });
    
    filterCodes();
}

function copyCode(code, btn) {
    navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<i data-lucide="check"></i> Copied!';
        lucide.createIcons();
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i data-lucide="copy"></i> Copy';
            lucide.createIcons();
        }, 2000);
    });
}

// ─── CODE FILTER TAGS ───────────────────────────────────────────────────
function renderCodeFilterTags() {
    const container = document.getElementById('codeFilterTags');
    if (!container) return;
    const tagCounts = {};
    siteData.codes.forEach(c => {
        normalizeTags(c.tags || c.features || []).forEach(t => {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
    });
    const allTags = Object.keys(tagCounts);
    if (allTags.length === 0) { container.innerHTML = ''; return; }
    allTags.sort((a, b) => tagCounts[b] - tagCounts[a]);
    container.innerHTML = `<span class="filter-tag ${activeCodeFilters.size === 0 ? 'active' : ''}" onclick="clearCodeFilters()">Kaikki</span>` +
        allTags.map(tag =>
            `<span class="filter-tag ${activeCodeFilters.has(tag) ? 'active' : ''}" data-tag="${escHtml(tag)}" onclick="toggleCodeFilter('${escHtml(tag)}')">#${escHtml(tag)} <span class="tag-count">(${tagCounts[tag]})</span></span>`
        ).join('');
}

function toggleCodeFilter(tag) {
    if (activeCodeFilters.has(tag)) activeCodeFilters.delete(tag);
    else activeCodeFilters.add(tag);
    filterCodes();
    renderCodeFilterTags();
}

function clearCodeFilters() {
    activeCodeFilters.clear();
    filterCodes();
    renderCodeFilterTags();
}

function filterCodeByTag(tag) {
    activeCodeFilters.clear();
    activeCodeFilters.add(tag);
    document.querySelector('[data-tab="codes"]').click();
    filterCodes();
    renderCodeFilterTags();
}

function filterCodes() {
    const searchVal = document.getElementById('codesSearch')?.value.toLowerCase() || '';
    const cards = document.querySelectorAll('.code-card');
    cards.forEach(card => {
        const tags = JSON.parse(card.dataset.tags || '[]');
        const text = card.textContent.toLowerCase();
        const matchesSearch = !searchVal || text.includes(searchVal);
        const matchesFilters = activeCodeFilters.size === 0 ||
            Array.from(activeCodeFilters).every(f => tags.includes(f));
        card.style.display = (matchesSearch && matchesFilters) ? '' : 'none';
    });
}

// ─── LAYOUT TOGGLES ──────────────────────────────────────────────────────
function setCodesLayout(layout) {
    codesLayout = layout;
    document.querySelectorAll('#codes .layout-btn').forEach(b => b.classList.toggle('active', b.dataset.layout === layout));
    document.getElementById('codesList').className = 'codes-list layout-' + layout;
}

function setShopLayout(layout) {
    shopLayout = layout;
    document.querySelectorAll('#affiliates .layout-btn').forEach(b => b.classList.toggle('active', b.dataset.layout === layout));
    document.getElementById('affiliatesList').className = 'affiliates-grid layout-' + layout;
}

// ─── POPUP (expanded detail, no page leave) ──────────────────────────────
function showItemPopup(item, type) {
    let overlay = document.getElementById('itemPopup');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'itemPopup';
        overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.classList.remove('open'); } });
        document.body.appendChild(overlay);
    }
    
    trackClick(type + 's', item.id);
    
    const isAffiliate = type === 'affiliate';
    const tags = normalizeTags(item.tags || item.features || []);
    const tagsHtml = tags.map(t => `<span class="popup-tag">#${escHtml(t)}</span>`).join('');
    const color = item.color || '';
    
    overlay.innerHTML = `<div class="popup-card${color ? ' has-color' : ''}" ${color ? `style="--popup-accent:${color}"` : ''}>
        <button class="popup-close" onclick="document.getElementById('itemPopup').classList.remove('open')">✕</button>
        ${item.image ? `<img src="${escHtml(item.image)}" class="popup-image" alt="">` : ''}
        ${item.isHot || (item.clicks > 0) ? '<div class="popup-hot">🔥 HOT</div>' : ''}
        <h2 class="popup-title">${escHtml(item.title || item.store)}</h2>
        ${item.description ? `<p class="popup-desc">${escHtml(item.description)}</p>` : ''}
        ${item.discount ? `<div class="popup-discount"${color ? ` style="background:${color}"` : ''}>${escHtml(item.discount)} OFF</div>` : ''}
        ${item.price ? `<div class="popup-price">${escHtml(item.price)}</div>` : ''}
        ${tags.length ? `<div class="popup-tags">${tagsHtml}</div>` : ''}
        ${item.code ? `<div class="popup-code-box">
            <span class="popup-code-value"${color ? ` style="color:${color}"` : ''}>${escHtml(item.code)}</span>
            <button class="copy-btn popup-copy"${color ? ` style="background:${color}"` : ''} onclick="copyCode('${escHtml(item.code)}', this)">
                <i data-lucide="copy"></i> Copy
            </button>
        </div>` : ''}
        ${item.url ? `<a href="${escHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="popup-cta"${color ? ` style="background:${color}"` : ''}>
            ${isAffiliate ? '<i data-lucide="shopping-cart"></i> Osta nyt' : '<i data-lucide="external-link"></i> Siirry kauppaan'}
        </a>` : ''}
        ${item.youtubeId ? `<button class="popup-yt" onclick="showYtEmbed('${escHtml(item.youtubeId)}')"><i data-lucide="play"></i> Katso video</button>` : ''}
        <div class="popup-clicks">${(item.clicks||0)} clicks</div>
    </div>`;
    overlay.classList.add('open');
    lucide.createIcons();
}

// ─── CLICK TRACKING ──────────────────────────────────────────────────────
function trackClick(type, id) {
    fetch('/api/click/' + type + '/' + id, { method: 'POST' }).catch(() => {});
}

// ─── SHOP / AFFILIATES ────────────────────────────────────────────────────
function renderAffiliates() {
    const container = document.getElementById('affiliatesList');
    container.innerHTML = '';
    container.className = 'affiliates-grid layout-' + shopLayout;
    
    const sorted = [...(siteData.affiliates || [])].sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
    // HOT: top 2 by clicks
    const byClicks = [...sorted].sort((a,b) => (b.clicks||0) - (a.clicks||0));
    const hotIds = new Set();
    for (let i = 0; i < Math.min(2, byClicks.length); i++) {
        if ((byClicks[i].clicks||0) > 0) hotIds.add(byClicks[i].id);
    }

    sorted.forEach(aff => {
        const isHot = hotIds.has(aff.id);
        const features = normalizeTags(aff.features || aff.tags);
        const maxTags = 4;
        const visibleTags = features.slice(0, maxTags);
        const hiddenTags = features.slice(maxTags);
        const tagsHtml = visibleTags.map(f => 
            `<span class="affiliate-tag" data-tag="${escHtml(f)}" onclick="event.stopPropagation();filterByTag('${escHtml(f)}')">#${escHtml(f)}</span>`
        ).join('');
        const moreBtn = hiddenTags.length > 0 
            ? `<span class="tag-more" onclick="event.stopPropagation();toggleHiddenTags(this, '${aff.id}')">+${hiddenTags.length} lisää...</span>`
            : '';
        const hiddenTagsHtml = hiddenTags.map(f => 
            `<span class="affiliate-tag hidden-tags" data-tag="${escHtml(f)}" data-aff="${aff.id}" onclick="event.stopPropagation();filterByTag('${escHtml(f)}')">#${escHtml(f)}</span>`
        ).join('');
        
        const card = document.createElement('div');
        card.className = 'affiliate-card compact' + (isHot ? ' hot' : '');
        // Color is set as CSS custom prop but NOT applied visually except on hover
        if (aff.color) card.style.setProperty('--link-accent', aff.color);
        card.dataset.tags = JSON.stringify(features);
        card.dataset.id = aff.id;
        card.innerHTML = `
            ${isHot ? '<div class="hot-badge">🔥 HOT</div>' : ''}
            ${aff.image ? `
            <div class="affiliate-image-wrap">
                <img src="${escHtml(aff.image)}" alt="${escHtml(aff.title)}" class="affiliate-image" loading="lazy">
                ${aff.youtubeId ? `<div class="yt-play-overlay" onclick="event.stopPropagation();showYtEmbed('${escHtml(aff.youtubeId)}')"><span>▶</span></div>` : ''}
            </div>
            ` : ''}
            <div class="affiliate-content">
                <div class="affiliate-title">${escHtml(aff.title)}</div>
                <div class="affiliate-desc">${escHtml(aff.description || '')}</div>
                <div class="affiliate-price">${escHtml(aff.price || '')}</div>
                <div class="affiliate-features">${tagsHtml}${moreBtn}${hiddenTagsHtml}</div>
                ${aff.youtubeId ? `<button class="yt-preview-btn" onclick="event.stopPropagation();showYtEmbed('${escHtml(aff.youtubeId)}')"><i data-lucide="play"></i> Katso video</button>` : ''}
                <a href="${escHtml(aff.url)}" target="_blank" rel="noopener noreferrer" class="affiliate-cta" onclick="event.stopPropagation();trackClick('affiliates','${aff.id}')">
                    <i data-lucide="shopping-cart"></i> Osta nyt
                </a>
                <div class="affiliate-clicks">${(aff.clicks||0)} clicks</div>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.affiliate-cta') || e.target.closest('.affiliate-tag') || e.target.closest('.yt-preview-btn') || e.target.closest('.yt-play-overlay')) return;
            showItemPopup({...aff, isHot}, 'affiliate');
        });
        container.appendChild(card);
    });
    
    filterShop();
}

function normalizeTags(raw) {
    if (Array.isArray(raw)) return raw.map(t => String(t).trim().toLowerCase()).filter(Boolean);
    if (typeof raw === 'string') return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    return [];
}

function toggleHiddenTags(el, affId) {
    const hiddenEls = document.querySelectorAll(`.hidden-tags[data-aff="${affId}"]`);
    hiddenEls.forEach(tag => tag.classList.toggle('show'));
    el.style.display = 'none';
}

// ─── FILTER TAGS (with counts) ────────────────────────────────────────────
function renderFilterTags() {
    const container = document.getElementById('filterTags');
    const tagCounts = {};
    
    siteData.affiliates.forEach(aff => {
        normalizeTags(aff.features || aff.tags).forEach(t => {
            tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
    });
    
    const allTags = Object.keys(tagCounts);
    if (allTags.length === 0) { container.innerHTML = ''; return; }
    
    // Sort by count descending
    allTags.sort((a, b) => tagCounts[b] - tagCounts[a]);

    container.innerHTML = `<span class="filter-tag ${activeFilters.size === 0 ? 'active' : ''}" onclick="clearFilters()">Kaikki</span>` +
        allTags.map(tag => 
            `<span class="filter-tag ${activeFilters.has(tag) ? 'active' : ''}" data-tag="${escHtml(tag)}" onclick="toggleFilter('${escHtml(tag)}')">#${escHtml(tag)} <span class="tag-count">(${tagCounts[tag]})</span></span>`
        ).join('');
}

function toggleFilter(tag) {
    if (activeFilters.has(tag)) activeFilters.delete(tag);
    else activeFilters.add(tag);
    filterShop();
    renderFilterTags();
}

function clearFilters() {
    activeFilters.clear();
    filterShop();
    renderFilterTags();
}

function filterByTag(tag) {
    activeFilters.clear();
    activeFilters.add(tag);
    document.querySelector('[data-tab="affiliates"]').click();
    filterShop();
    renderFilterTags();
}

function filterShop() {
    const searchVal = document.getElementById('shopSearch')?.value.toLowerCase() || '';
    const cards = document.querySelectorAll('.affiliate-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const tags = JSON.parse(card.dataset.tags || '[]');
        const text = card.textContent.toLowerCase();
        
        const matchesSearch = !searchVal || text.includes(searchVal);
        const matchesFilters = activeFilters.size === 0 || 
            Array.from(activeFilters).every(f => tags.includes(f));
        
        if (matchesSearch && matchesFilters) {
            card.classList.remove('hidden-card', 'faded', 'highlighted');
            if (searchVal || activeFilters.size > 0) card.classList.add('highlighted');
            visibleCount++;
        } else {
            card.classList.add('hidden-card');
            card.classList.remove('highlighted');
        }
    });
    
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// ─── STREAM EMBED (Kick/Twitch) ─────────────────────────────────────────
async function checkStreamLive() {
    const embed = document.getElementById('kickEmbed');
    const frame = document.getElementById('kickFrame');
    const liveDot = document.getElementById('liveDot');
    const embedTitle = document.getElementById('embedTitle');
    
    const alwaysShow = siteData.streamAlwaysVisible === true;
    const streamType = siteData.streamType || 'kick';
    const streamUser = siteData.streamUsername || 'omaquu';
    
    // Set embed src based on type
    let embedSrc = '';
    if (streamType === 'twitch') {
        embedSrc = `https://player.twitch.tv/?channel=${streamUser}&parent=${location.hostname}`;
    } else {
        embedSrc = `https://player.kick.com/${streamUser}`;
    }
    
    frame.src = embedSrc;
    
    // Try to check live status
    let isLive = false;
    try {
        if (streamType === 'kick') {
            const res = await fetch(`https://kick.com/api/v2/channels/${streamUser}`);
            if (res.ok) {
                const data = await res.json();
                if (data.data?.livestream) isLive = true;
            }
        }
        // Twitch live check would need client-id — skip for now
        if (streamType === 'twitch') isLive = true;  // Twitch needs auth, assume live when always
    } catch(e) {}
    
    if (isLive) {
        embed.style.display = 'block';
        liveDot.style.background = 'var(--live)';
        liveDot.classList.add('live-dot');
        embedTitle.textContent = `LIVE @${streamUser}`;
        embed.style.borderColor = 'var(--live)';
        embed.style.boxShadow = '0 0 20px rgba(239,68,68,0.2)';
        frame.src = embedSrc;
    } else if (alwaysShow) {
        embed.style.display = 'block';
        liveDot.style.background = '';
        liveDot.classList.remove('live-dot');
        embedTitle.textContent = `@${streamUser} · Offline · ${streamType.toUpperCase()}`;
        embed.style.borderColor = 'var(--border)';
        embed.style.boxShadow = 'none';
        frame.src = embedSrc;
    } else {
        embed.style.display = 'none';
    }
}

// ─── YOUTUBE EMBED MODAL ─────────────────────────────────────────────────
function showYtEmbed(videoId) {
    let overlay = document.getElementById('ytOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ytOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div style="width:90%;max-width:560px;aspect-ratio:16/9;position:relative">
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" style="width:100%;height:100%;border:0;border-radius:12px" allowfullscreen allow="autoplay"></iframe>
        <div onclick="document.getElementById('ytOverlay').remove()" style="position:absolute;top:-30px;right:0;color:#fff;font-size:1.5rem;cursor:pointer">✕</div>
    </div>`;
}

// ─── TAB SWITCHING ───────────────────────────────────────────────────────
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(c => {
                c.classList.remove('active');
                if (c.id === tabId) c.classList.add('active');
            });
        });
    });
}

// ─── SEARCH BAR ───────────────────────────────────────────────────────────
function initSearch() {
    const searchInput = document.getElementById('shopSearch');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                filterShop();
            }
        });
    }
}

// ─── UTILS ────────────────────────────────────────────────────────────────
function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"');
}

// ─── INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSearch();
    loadData();
});

// ─── FALLBACK ─────────────────────────────────────────────────────────────
}
function getFallbackData() {
    return {
        profile: { username: '@omaquu', displayName: 'omaquu', bio: 'Someloukkaantuja', avatar: '', quickLinks: [] },
        links: [
            { id: 'youtube', title: 'YouTube', url: 'https://www.youtube.com/@omaquu', icon: 'youtube', category: 'social', live: false, sort_order: 1 },
            { id: 'kick', title: 'kick.com', url: 'https://kick.com/omaquu', icon: 'kick', category: 'stream', live: true, sort_order: 2 },
            { id: 'twitch', title: 'Twitch.tv', url: 'https://www.twitch.tv/omaquu', icon: 'twitch', category: 'stream', live: false, sort_order: 3 },
            { id: 'tiktok', title: 'TikTok', url: 'https://www.tiktok.com/@omaquu', icon: 'tiktok', category: 'social', live: false, sort_order: 4 },
        ],
        codes: [
            { id: 'biohackbalance', store: 'Biohackbalance.se', code: 'OMAQUU10', discount: '10%', description: 'Superfood tuotteet', url: 'https://biohackbalance.se', sort_order: 0 }
        ],
        affiliates: [
            { id: 'epomaker', title: 'EPOMAKER HE65 Mec', description: '65% Mechanical Keyboard', price: '$75.99', image: 'https://cdn.shopify.com/s/files/1/0280/3931/5529/files/6_39119f8d-255b-404c-9b5e-688a11e9d56b.jpg?v=1747212239', url: 'https://epomaker.com/products/epomaker-he65-mec', features: ['tech', 'keyboard', 'new'], tags: ['tech', 'keyboard', 'new'], sort_order: 0 }
        ],
        streamAlwaysVisible: false
    };
}