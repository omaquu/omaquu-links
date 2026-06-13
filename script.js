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
        checkKickLive();
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
            <a href="${escHtml(link.url)}" class="${cardClass}" ${colorStyle} target="_blank" rel="noopener noreferrer">
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
    
    const sorted = [...(siteData.codes || [])].sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

    sorted.forEach(code => {
        const colorAccent = code.color ? `style="--code-accent:${code.color}"` : '';
        container.innerHTML += `
            <div class="code-card" ${colorAccent}>
                <div class="code-header">
                    <span class="code-store">${escHtml(code.store || code.title)}</span>
                    <span class="code-discount"${code.color ? ` style="background:linear-gradient(135deg,${code.color},${code.color}cc)"` : ''}>${escHtml(code.discount || '')} OFF</span>
                </div>
                <div class="code-description">${escHtml(code.description || '')}</div>
                <div class="code-box">
                    <span class="code-value"${code.color ? ` style="color:${code.color}"` : ''}>${escHtml(code.code)}</span>
                    <button class="copy-btn" onclick="copyCode('${escHtml(code.code)}', this)"${code.color ? ` style="background:${code.color}"` : ''}>
                        <i data-lucide="copy"></i> Copy
                    </button>
                </div>
                ${code.url ? `<a href="${escHtml(code.url)}" target="_blank" rel="noopener noreferrer" class="code-link">
                    <i data-lucide="external-link"></i> Siirry kauppaan
                </a>` : ''}
            </div>
        `;
    });
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

// ─── SHOP / AFFILIATES ────────────────────────────────────────────────────
function renderAffiliates() {
    const container = document.getElementById('affiliatesList');
    container.innerHTML = '';
    
    const sorted = [...(siteData.affiliates || [])].sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

    sorted.forEach(aff => {
        const features = normalizeTags(aff.features || aff.tags);
        const tagsHtml = features.map(f => 
            `<span class="affiliate-tag" data-tag="${escHtml(f)}" onclick="filterByTag('${escHtml(f)}')">#${escHtml(f)}</span>`
        ).join('');
        
        const card = document.createElement('div');
        card.className = 'affiliate-card';
        if (aff.color) card.style.setProperty('--link-accent', aff.color);
        card.dataset.tags = JSON.stringify(features);
        card.innerHTML = `
            ${aff.image ? `
            <div class="affiliate-image-wrap">
                <img src="${escHtml(aff.image)}" alt="${escHtml(aff.title)}" class="affiliate-image" loading="lazy">
            </div>
            ` : ''}
            <div class="affiliate-content">
                <div class="affiliate-title">${escHtml(aff.title)}</div>
                <div class="affiliate-desc">${escHtml(aff.description || '')}</div>
                <div class="affiliate-price">${escHtml(aff.price || '')}</div>
                <div class="affiliate-features">${tagsHtml}</div>
                <a href="${escHtml(aff.url)}" target="_blank" rel="noopener noreferrer" class="affiliate-cta"${aff.color ? ` style="background:${aff.color}"` : ''} onclick="event.stopPropagation()">
                    <i data-lucide="shopping-cart"></i> Osta nyt
                </a>
            </div>
        `;
        
        card.addEventListener('click', () => window.open(aff.url, '_blank'));
        container.appendChild(card);
    });
}

function normalizeTags(raw) {
    if (Array.isArray(raw)) return raw.map(t => String(t).trim().toLowerCase()).filter(Boolean);
    if (typeof raw === 'string') return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    return [];
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

// ─── KICK LIVE EMBED ──────────────────────────────────────────────────────
async function checkKickLive() {
    const embed = document.getElementById('kickEmbed');
    const frame = document.getElementById('kickFrame');
    const liveDot = document.getElementById('liveDot');
    const embedTitle = document.getElementById('embedTitle');
    
    // If streamAlwaysVisible, show embed always (even if offline)
    const alwaysShow = siteData.streamAlwaysVisible === true;
    
    // Find kick link
    const kickLink = siteData.links?.find(l => l.icon === 'kick' || l.url?.includes('kick.com/'));
    if (!kickLink) {
        if (alwaysShow) {
            // No kick link found but always-show is on — try hardcoded omaquu
            setupEmbed(embed, frame, liveDot, embedTitle, 'omaquu', alwaysShow);
        } else {
            embed.style.display = 'none';
        }
        return;
    }
    
    const detected = detectEmbedFromUrl(kickLink.url);
    if (!detected || detected.type !== 'kick') {
        embed.style.display = alwaysShow ? 'block' : 'none';
        return;
    }
    
    setupEmbed(embed, frame, liveDot, embedTitle, detected.username, alwaysShow);
}

async function setupEmbed(embed, frame, liveDot, embedTitle, username, alwaysShow) {
    frame.src = `https://player.kick.com/${username}`;
    
    try {
        const res = await fetch(`https://kick.com/api/v2/channels/${username}`);
        if (res.ok) {
            const data = await res.json();
            if (data.data?.livestream) {
                // Actually live!
                embed.style.display = 'block';
                liveDot.style.background = 'var(--live)';
                liveDot.classList.add('live-dot');
                embedTitle.textContent = `LIVE @${username}`;
                embed.style.borderColor = 'var(--live)';
                embed.style.boxShadow = '0 0 20px rgba(239,68,68,0.2)';
                return;
            }
        }
    } catch(e) {}
    
    // Not live
    if (alwaysShow) {
        embed.style.display = 'block';
        liveDot.style.background = 'var(--text-muted)';
        liveDot.classList.remove('live-dot');
        embedTitle.textContent = `@${username} · Offline`;
        embed.style.borderColor = 'var(--border)';
        embed.style.boxShadow = 'none';
    } else {
        embed.style.display = 'none';
    }
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