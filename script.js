// ============================================
// omaquu Link Site - Main Script v3
// Features: Links + Codes + Shop + Kick Live
//   + Quick Links + Per-link colors + Stream Always
//   + Background animations (particles/matrix/stars)
//   + Tag counts in shop
// ============================================

// ─── ICONS ────────────────────────────────────────────────────────────────
// Icon mappings (Lucide names)
const ICONS = {
    youtube: 'youtube', twitch: 'twitch', kick: 'zap', tiktok: 'music',
    x: 'twitter', instagram: 'instagram', snapchat: 'smile', discord: 'message-circle',
    kofi: 'coffee', email: 'mail', link: 'external-link'
};

// SVG icon fallbacks for platforms (use these instead of Lucide for better brand icons)
const ICON_SVG = {
    twitch: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V9.34a8.28 8.28 0 005.58 2.27z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    kick: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    kofi: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/></svg>',
    snapchat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.166-.088.344-.104.464-.104.182 0 .359.029.516.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.044-.192.104-.276.179-.09.075-.18.166-.18.359 0 .165.06.33.21.479.45.45 1.557 1.23 2.465 1.814.165.105.36.224.538.379.3.255.406.435.435.659.029.135.029.405-.06.734-.06.21-.136.479-.226.854-.076.315-.06.405-.06.569.015.149.015.24.074.284.12.09.555.149 1.049.165h.06c.584-.016 1.114-.09 1.212-.165.104-.075.134-.194.134-.569-.015-.194-.03-.33-.03-.405.015-.135.06-.255.166-.405.135-.193.195-.435.12-.63-.06-.149-.12-.359-.165-.63-.045-.164-.06-.255-.06-.435.015-.149.06-.3.164-.464.121-.165.226-.36.226-.584.015-.224-.061-.435-.18-.585-.09-.12-.151-.194-.151-.33 0-.12.09-.285.27-.48.21-.224.42-.465.6-.734.239-.374.434-.719.614-1.054.135-.255.27-.48.404-.674.075-.12.179-.27.315-.465.09-.135.105-.165.12-.24.015-.075.015-.165-.015-.255-.075-.24-.06-.465.045-.675.12-.224.27-.39.465-.524.135-.105.285-.18.465-.255.135-.075.315-.105.48-.135.135-.03.315-.06.465-.06.105 0 .18.015.21.015.119.06.149.149.134.3-.03.36.225.72.585.839.135.045.255.06.36.06.195.03.39.03.57.06.12.015.21.06.285.135.075.075.12.18.12.315-.015.135-.075.24-.18.315-.09.075-.195.12-.315.15-.105.03-.225.06-.33.105-.09.06-.18.135-.27.224-.315.375-.495.675-.569 1.125.06-.015.12-.015.18-.015.15-.015.315-.015.495-.015h.405c.165 0 .315 0 .45.015.089.015.24.015.36.03.135.015.255.045.315.12.075.075.075.195.06.315-.015.09-.06.165-.135.21-.061.045-.135.09-.24.12-.105.03-.225.06-.33.075-.12.015-.255.045-.42.045-.09.015-.18.015-.285.015-.18.015-.36.03-.51.075-.18.045-.39.09-.6.15-.164.045-.344.105-.509.18-.195.09-.389.209-.554.344-.105.09-.24.224-.404.39-.12.12-.255.27-.375.404-.135.15-.255.3-.36.45-.12.15-.225.33-.36.54-.06.12-.135.24-.195.36-.075.135-.15.285-.225.435-.12.255-.225.54-.3.824-.09.36-.12.674-.06.884.015.045.045.135.075.165.075.09.18.12.36.12.165-.015.39-.09.63-.225.12-.075.24-.15.345-.24.12-.09.225-.195.285-.33.044-.09.074-.21.074-.345 0-.075.015-.165.015-.24 0-.21.075-.39.195-.555.075-.09.12-.15.12-.21 0-.09-.03-.135-.075-.18-.061-.075-.091-.135-.091-.195 0-.06.046-.12.136-.165.105-.075.225-.135.36-.18.135-.06.3-.09.48-.09.12 0 .255.015.39.06.135.03.255.09.33.15.06.075.09.18.09.315-.03.12-.12.24-.255.33-.135.105-.27.195-.405.285-.135.09-.27.18-.39.285-.105.09-.225.21-.315.33-.12.134-.225.27-.315.42-.09.165-.18.345-.27.525-.06.165-.09.315-.09.48-.015.15.015.315.075.495.075.21.164.42.344.615.135.15.315.315.54.48.135.09.285.21.465.33.15.09.33.18.495.24.06.03.12.045.165.06.06.015.135.03.21.045h.15c.33-.03.675-.135 1.004-.3.135-.06.255-.12.33-.18.06-.075.12-.195.18-.345.03-.09.045-.194.045-.314-.03-.134-.105-.224-.165-.269-.135-.09-.18-.18-.18-.359 0-.075.015-.15.06-.24.105-.3.135-.54.135-.84 0-.195-.03-.36-.075-.51a1.982 1.982 0 00-.105-.36 1.213 1.213 0 01-.105-.39c0-.165.06-.33.165-.51.03-.075.075-.135.105-.21.075-.165.105-.36.105-.555 0-.21-.03-.405-.12-.6-.075-.21-.195-.39-.33-.585-.12-.165-.27-.315-.42-.465-.09-.09-.18-.195-.24-.315a1.22 1.22 0 01-.105-.33c0-.09.015-.18.045-.27.045-.135.09-.27.135-.39.03-.09.075-.18.09-.27.03-.135.015-.27-.03-.39-.045-.15-.135-.315-.27-.494a.922.922 0 00-.135-.18c-.135-.135-.3-.24-.495-.315a2.867 2.867 0 00-.465-.18c-.15-.06-.3-.06-.42-.06-.06 0-.165 0-.3.015-.12.03-.255.06-.39.09-.135.03-.285.06-.405.105-.12.045-.24.105-.345.165a1.14 1.14 0 00-.27.195 3.625 3.625 0 00-.3.21 4.816 4.816 0 00-.39.36c-.12.105-.225.24-.33.39-.105.135-.21.285-.3.45-.09.165-.18.36-.24.585-.06.15-.12.33-.135.51-.015.12.015.24.09.36.045.09.09.165.135.24.135.24.15.51.045.735z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>'
};

// Helper: get icon HTML (SVG fallback or Lucide data attribute)
function getIconHtml(platform) {
    if (ICON_SVG[platform]) {
        return `<span class="icon-svg">${ICON_SVG[platform]}</span>`;
    }
    const iconName = ICONS[platform] || 'link';
    return `<i data-lucide="${iconName}"></i>`;
}

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
let shopLayout = 'grid-2';
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
    // Derive live glow from live color
    if (theme.live) {
        root.style.setProperty('--live-glow', theme.live + '33');
    }
    // Derive success glow from success color
    if (theme.success) {
        root.style.setProperty('--success-glow', theme.success + '33');
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

    // Background gradient (apply to body)
    if (theme.bgGradient1 && theme.bgGradient2) {
      document.body.style.background = `linear-gradient(${theme.bgGradientAngle || 180}deg, ${theme.bgGradient1}, ${theme.bgGradient2})`;
    } else if (theme.bgGradient1) {
      document.body.style.background = theme.bgGradient1;
    } else if (theme.bgPrimary) {
      document.body.style.background = theme.bgPrimary;
    }

    // Card opacity (apply to CSS variable)
    if (theme.cardOpacity !== undefined) {
      const opacity = Math.max(0.1, Math.min(1, theme.cardOpacity / 100));
      root.style.setProperty('--card-opacity', opacity);
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
        let ufoX = -120, ufoY = canvas.height * 0.15, beamPhase = 0, ufoPhase = 0;
        function drawUFO() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 3D wave movement - no left-to-right, only up-down bobbing
            ufoPhase += 0.025;
            const baseY = canvas.height * 0.15;
            ufoY = baseY + Math.sin(ufoPhase) * 60 + Math.sin(ufoPhase * 1.7) * 25;
            // UFO drifts slowly right with slight wave
            ufoX += 0.35;
            if (ufoX > canvas.width + 200) ufoX = -200;
            beamPhase += 0.04;
            // Fog/mist layers
            const fogCount = 5;
            for (let f = 0; f < fogCount; f++) {
                const fogY = canvas.height * (0.35 + f * 0.12) + Math.sin(ufoPhase * 0.5 + f) * 15;
                const fogA = 0.04 + Math.sin(ufoPhase * 0.3 + f * 0.7) * 0.02;
                const fogGrad = ctx.createRadialGradient(
                    canvas.width * (0.2 + f * 0.15) + Math.sin(ufoPhase * 0.4 + f * 1.2) * 40,
                    fogY, 0,
                    canvas.width * (0.2 + f * 0.15) + Math.sin(ufoPhase * 0.4 + f * 1.2) * 40,
                    fogY, canvas.width * 0.4
                );
                fogGrad.addColorStop(0, `rgba(${r},${g},${b},${fogA.toFixed(3)})`);
                fogGrad.addColorStop(0.5, `rgba(${r},${g},${b},${(fogA * 0.3).toFixed(3)})`);
                fogGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = fogGrad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            // Light beam (starts ABOVE UFO dome, behind it)
            const beamTop = ufoY - 30;
            const bGrad = ctx.createLinearGradient(ufoX, beamTop, ufoX, canvas.height);
            bGrad.addColorStop(0, `rgba(${r},${g},${b},0.55)`);
            bGrad.addColorStop(0.4, `rgba(${r},${g},${b},0.2)`);
            bGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.moveTo(ufoX - 40, beamTop);
            ctx.lineTo(ufoX - 160, canvas.height);
            ctx.lineTo(ufoX + 160, canvas.height);
            ctx.lineTo(ufoX + 40, beamTop);
            ctx.closePath();
            ctx.fillStyle = bGrad;
            ctx.fill();
            // Beam pulse orb (falling through beam)
            const pulseY = beamTop + (Math.sin(beamPhase) * 0.5 + 0.5) * (canvas.height - beamTop - 40);
            ctx.beginPath();
            ctx.arc(ufoX, pulseY, 7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ufoX, pulseY, 12, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},0.25)`;
            ctx.fill();
            // UFO dome (glass)
            ctx.beginPath();
            ctx.ellipse(ufoX, ufoY, 58, 20, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},0.4)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Cabin
            ctx.beginPath();
            ctx.ellipse(ufoX, ufoY - 12, 22, 14, 0, Math.PI, 0);
            ctx.fillStyle = `rgba(${r},${g},${b},0.3)`;
            ctx.fill();
            // Lights (blinking)
            for (let i = -2; i <= 2; i++) {
                const la = Math.sin(beamPhase * 2.5 + i * 1.3) * 0.5 + 0.5;
                ctx.beginPath();
                ctx.arc(ufoX + i * 20, ufoY + 4, 4.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,80,${la.toFixed(2)})`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(ufoX + i * 20, ufoY + 4, 8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,220,80,${(la * 0.2).toFixed(2)})`;
                ctx.fill();
            }
            // Extra glow under UFO
            const underGlow = ctx.createRadialGradient(ufoX, ufoY + 15, 0, ufoX, ufoY + 15, 80);
            underGlow.addColorStop(0, `rgba(${r},${g},${b},0.2)`);
            underGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = underGlow;
            ctx.fillRect(ufoX - 80, ufoY, 160, 100);
            animFrame = requestAnimationFrame(drawUFO);
        }
        drawUFO();

    } else if (type === 'cyberpunk') {
        let offset = 0;
        // Palm pool: 4 palms, move from edges across screen
        const palmPool = Array.from({length: 4}, (_, i) => ({
            x: Math.random() < 0.5 ? -0.15 : 1.15, // start off-screen left or right
            z: 0, // depth (0=far/horizon, 1=close/viewer)
            speed: 0.002 + Math.random() * 0.002, // forward speed (z)
            hSpeed: 0.001 + Math.random() * 0.001, // horizontal speed
            dir: Math.random() < 0.5 ? 1 : -1, // direction: 1=left→right, -1=right→left
            height: 0.22 + Math.random() * 0.1,
            trunk: 0.14 + Math.random() * 0.06,
        }));
        function drawCyber() {
            const t = Date.now() / 1000;
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            const horizon = H * 0.5;
            const vpX = W / 2;
            // ── ABOVE HORIZON: gradient sky ──
            const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
            skyGrad.addColorStop(0, 'rgba(10,5,30,1)');
            skyGrad.addColorStop(0.5, 'rgba(20,0,50,1)');
            skyGrad.addColorStop(1, 'rgba(40,0,60,1)');
            ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, horizon);
            // ── SUN: orange, sits on horizon, with extra glow ──
            const sunX = W / 2, sunY = horizon, sunR = 70;
            // Outer glow
            const sg2 = ctx.createRadialGradient(sunX, sunY - sunR * 0.3, sunR * 0.5, sunX, sunY - sunR * 0.3, sunR * 3);
            sg2.addColorStop(0, 'rgba(255,150,0,0.4)'); sg2.addColorStop(0.5, 'rgba(255,80,0,0.15)'); sg2.addColorStop(1, 'transparent');
            ctx.fillStyle = sg2; ctx.fillRect(0, 0, W, horizon);
            // Inner glow
            const sg = ctx.createRadialGradient(sunX, sunY - sunR * 0.3, sunR * 0.2, sunX, sunY - sunR * 0.3, sunR * 1.8);
            sg.addColorStop(0, 'rgba(255,160,0,0.6)'); sg.addColorStop(0.5, 'rgba(255,100,0,0.3)'); sg.addColorStop(1, 'transparent');
            ctx.fillStyle = sg; ctx.fillRect(0, 0, W, horizon);
            ctx.beginPath(); ctx.arc(sunX, sunY - sunR * 0.3, sunR, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,130,0,0.95)'; ctx.fill();
            ctx.save();
            ctx.beginPath(); ctx.arc(sunX, sunY - sunR * 0.3, sunR, 0, Math.PI * 2); ctx.clip();
            for (let s = 0; s < 10; s++) {
                const sy = sunY - sunR * 0.3 - sunR + (s / 10) * sunR * 2;
                const sh = 2 + s * 0.8;
                ctx.fillStyle = `rgba(20,5,35,${0.3 + s * 0.07})`; ctx.fillRect(sunX - sunR, sy, sunR * 2, sh);
            }
            ctx.restore();
            // ── HORIZON LINE: neon glow ──
            ctx.beginPath(); ctx.moveTo(0, horizon); ctx.lineTo(W, horizon);
            ctx.strokeStyle = 'rgba(255,0,200,0.9)'; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, horizon); ctx.lineTo(W, horizon);
            ctx.strokeStyle = 'rgba(255,0,200,0.3)'; ctx.lineWidth = 8; ctx.stroke();
            // ── BELOW HORIZON: animated synthwave ground ──
            const ground = ctx.createLinearGradient(0, horizon, 0, H);
            ground.addColorStop(0, 'rgba(20,0,30,1)'); ground.addColorStop(1, 'rgba(5,0,15,1)');
            ctx.fillStyle = ground; ctx.fillRect(0, horizon, W, H - horizon);
            // Only horizontal lines (one wireframe effect)
            const hLines = Array.from({length: 12}, () => ({ y: Math.random(), speed: Math.random() * 0.002 + 0.001 }));
            hLines.forEach(l => {
                l.y += l.speed;
                if (l.y > 1) l.y = 0;
                const yy = horizon + Math.pow(l.y, 1.5) * (H - horizon);
                const pulse = Math.sin(t * 1.2 + l.y * 5) * 0.08 + 0.25;
                ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy);
                ctx.strokeStyle = `rgba(255,0,200,${pulse.toFixed(2)})`;
                ctx.lineWidth = 1 + l.y * 1.5; ctx.stroke();
            });
            // ── Vanishing point verticals (wireframe road) ──
            const vLines = 20;
            for (let i = 0; i < vLines; i++) {
                const frac = (i / (vLines - 1)) - 0.5; // -0.5 to 0.5
                // Wobble: lines bend slightly to simulate forward motion
                const wobbleAmp = Math.abs(frac) * 60; // more wobble at edges
                const wobble = Math.sin(t * 2.5 + i * 0.7) * wobbleAmp;
                const bx = vpX + frac * W * 2 + wobble;
                // Draw with 2 control points for slight curve
                const midX = vpX + frac * W * 1;
                const midY = horizon + (H - horizon) * 0.5;
                const pulse = Math.sin(t * 0.8 + i * 0.3) * 0.05 + 0.15;
                ctx.beginPath(); ctx.moveTo(vpX, horizon);
                ctx.quadraticCurveTo(midX + wobble * 0.5, midY, bx, H);
                ctx.strokeStyle = `rgba(255,0,200,${pulse.toFixed(2)})`;
                ctx.lineWidth = 0.8; ctx.stroke();
            }
            // ── MOVING PALMS: from horizon to viewer, edge to edge ──
            function drawPalm(px, py, ph, pt, scale) {
                // Neon green palm
                const green = 'rgba(0,255,120,';
                const glowG = 'rgba(0,255,120,';
                const lw = 2 + scale * 3;
                // Glow
                ctx.shadowColor = 'rgba(0,255,120,0.8)';
                ctx.shadowBlur = 8 * scale;
                // Trunk
                ctx.strokeStyle = green + '0.9)';
                ctx.lineWidth = lw;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.quadraticCurveTo(px + scale * 8, py - pt * 0.5, px, py - pt);
                ctx.stroke();
                // Trunk rings
                for (let tt = 0; tt < 4; tt++) {
                    const ty = py - tt * (pt / 4);
                    ctx.strokeStyle = green + '0.4)';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(px - scale * 4, ty); ctx.lineTo(px + scale * 4, ty); ctx.stroke();
                }
                ctx.shadowBlur = 0;
                // Leaves
                const topX = px, topY = py - pt;
                for (let l = 0; l < 7; l++) {
                    const angle = -Math.PI / 2 + (l / 6 - 0.5) * 1.5;
                    const len = ph * 0.8;
                    const ex = topX + Math.cos(angle) * len, ey = topY + Math.sin(angle) * len;
                    ctx.beginPath(); ctx.moveTo(topX, topY);
                    ctx.bezierCurveTo(
                        topX + Math.cos(angle - 0.4) * len * 0.4, topY + Math.sin(angle - 0.4) * len * 0.4 + 10 * scale,
                        topX + Math.cos(angle + 0.4) * len * 0.4, topY + Math.sin(angle + 0.4) * len * 0.4 + 10 * scale,
                        ex, ey
                    );
                    ctx.strokeStyle = green + '0.85)';
                    ctx.lineWidth = 1.5 + scale; ctx.stroke();
                }
            }
            // Sort by z (far first so close ones draw over)
            palmPool.sort((a, b) => a.z - b.z);
            palmPool.forEach(p => {
                p.z += p.speed;
                p.x += p.dir * p.hSpeed * (0.3 + p.z * 0.7); // moves faster when closer
                // Respawn: when past screen or too close
                if (p.z > 1.2 || p.x < -0.25 || p.x > 1.25) {
                    p.z = 0;
                    p.dir = Math.random() < 0.5 ? 1 : -1;
                    p.x = p.dir > 0 ? -0.15 : 1.15;
                    p.hSpeed = 0.001 + Math.random() * 0.001;
                    p.speed = 0.002 + Math.random() * 0.002;
                    p.height = 0.22 + Math.random() * 0.1;
                    p.trunk = 0.14 + Math.random() * 0.06;
                }
                // Perspective: z=0 is on horizon (small), z=1 is close to viewer (large)
                const scale = 0.08 + p.z * 0.95; // 0.08 at horizon, ~1 at close
                const screenX = p.x * W;
                if (screenX < -200 || screenX > W + 200) return; // off screen, skip
                // Palm y: from horizon (at z=0) to bottom of screen (at z=1)
                const screenY = horizon + (H - horizon) * Math.pow(p.z, 0.8);
                // Only draw if in front of viewer
                if (p.z > 0.02) {
                    const ph = H * p.height * scale;
                    const pt = H * p.trunk * scale;
                    drawPalm(screenX, screenY, ph, pt, scale);
                }
            });
            // ── Scanlines (subtle)
            for (let y = 0; y < H; y += 5) {
                ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, y, W, 1);
            }
            offset += 0.5;
            animFrame = requestAnimationFrame(drawCyber);
        }
        drawCyber();
    }
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
        const catLabel = CATEGORY_LABELS[link.category] || '';
        const cardClass = `link-card${link.category === 'stream' ? ' stream' : link.category === 'support' ? ' support' : ''}`;
        const liveBadge = link.live ? '<span class="live-badge">LIVE</span>' : '';
        const catText = catLabel ? `<div class="link-category">${catLabel}</div>` : '';
        
        // Per-link color accent
        const colorStyle = link.color ? `style="--link-accent:${link.color}"` : '';
        
        container.innerHTML += `
            <a href="${escHtml(link.url)}" class="${cardClass}" ${colorStyle} target="_blank" rel="noopener noreferrer" onclick="trackClick('links','${link.id}')">
                <div class="link-icon"${link.color ? ` style="background:${link.color}22;color:${link.color}"` : ''}>
                    ${getIconHtml(link.icon)}
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
    
    const sorted = [...(siteData.affiliates || [])];
    // HOT: top 2 by clicks go first
    const byClicks = [...sorted].sort((a,b) => (b.clicks||0) - (a.clicks||0));
    const hotIds = new Set();
    for (let i = 0; i < Math.min(2, byClicks.length); i++) {
        if ((byClicks[i].clicks||0) > 0) hotIds.add(byClicks[i].id);
    }
    // Sort: HOT first (by clicks), then by sort_order descending (newest first)
    const hotItems = sorted.filter(a => hotIds.has(a.id)).sort((a,b) => (b.clicks||0) - (a.clicks||0));
    const otherItems = sorted.filter(a => !hotIds.has(a.id)).sort((a, b) => (b.sort_order||0) - (a.sort_order||0));
    const finalSorted = [...hotItems, ...otherItems];

    finalSorted.forEach(aff => {
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
    } else if (alwaysShow) {
        embed.style.display = 'block';
        liveDot.style.background = 'var(--text-muted)';
        liveDot.classList.remove('live-dot');
        embedTitle.textContent = `@${streamUser} · Offline · ${streamType.toUpperCase()}`;
        embed.style.borderColor = 'var(--border)';
        embed.style.boxShadow = 'none';
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