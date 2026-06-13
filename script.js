// ============================================
// omaquu Link Site - Main Script v2
// Combines: Links + Codes + Shop (old hashtag/search) + Kick Live
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
    profile: { username: '@omaquu', displayName: 'omaquu', bio: '', avatar: '' },
    links: [], codes: [], affiliates: []
};

let activeFilters = new Set();
let searchActive = false;

// ─── LOAD DATA ───
async function loadData() {
    try {
        // Load theme first
        try {
            const themeRes = await fetch('theme.json');
            if (themeRes.ok) {
                const theme = await themeRes.json();
                applyTheme(theme);
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

// ─── THEME ───
function applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, val]) => {
        const varMap = {
            accent: '--accent', accentGlow: '--accent-glow',
            bgPrimary: '--bg-primary', bgSecondary: '--bg-secondary',
            bgCard: '--bg-card', bgCardHover: '--bg-card-hover',
            textPrimary: '--text-primary', textSecondary: '--text-secondary',
            textMuted: '--text-muted', border: '--border',
            live: '--live', success: '--success'
        };
        if (varMap[key]) root.style.setProperty(varMap[key], val);
    });
}

// ─── EMBED AUTO-DETECT ───
function detectEmbedFromUrl(url) {
    if (!url) return null;
    url = url.trim();
    const kickMatch = url.match(/kick\.com\/([a-zA-Z0-9_]+)/);
    if (kickMatch) return { type: 'kick', username: kickMatch[1], embedUrl: `https://kick.com/embed/${kickMatch[1]}` };
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return { type: 'youtube', videoId: ytMatch[1], embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };
    const twitchMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    if (twitchMatch) return { type: 'twitch', username: twitchMatch[1], embedUrl: `https://player.twitch.tv/?channel=${twitchMatch[1]}&parent=${location.hostname}` };
    const tiktokMatch = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
    if (tiktokMatch) return { type: 'tiktok', videoId: tiktokMatch[1], embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` };
    return null;
}

// ─── RENDER ALL ───
function renderAll() {
    renderProfile();
    renderLinks();
    renderCodes();
    renderAffiliates();
    renderFilterTags();
    renderAutoEmbeds();
    lucide.createIcons();
}

// ─── PROFILE ───
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

// ─── LINKS ───
function renderLinks() {
    const container = document.getElementById('linksList');
    container.innerHTML = '';
    
    siteData.links.forEach(link => {
        const iconName = ICONS[link.icon] || 'link';
        const catLabel = CATEGORY_LABELS[link.category] || '';
        const cardClass = `link-card${link.category === 'stream' ? ' stream' : link.category === 'support' ? ' support' : ''}`;
        const liveBadge = link.live ? '<span class="live-badge">LIVE</span>' : '';
        const catText = catLabel ? `<div class="link-category">${catLabel}</div>` : '';
        
        container.innerHTML += `
            <a href="${link.url}" class="${cardClass}" target="_blank" rel="noopener noreferrer">
                <div class="link-icon"><i data-lucide="${iconName}"></i></div>
                <div class="link-info">
                    <div class="link-title">${link.title}${liveBadge}</div>
                    ${catText}
                </div>
                <div class="link-arrow"><i data-lucide="chevron-right"></i></div>
            </a>
        `;
    });
}

// ─── CODES ───
function renderCodes() {
    const container = document.getElementById('codesList');
    container.innerHTML = '';
    
    siteData.codes.forEach(code => {
        container.innerHTML += `
            <div class="code-card">
                <div class="code-header">
                    <span class="code-store">${code.store}</span>
                    <span class="code-discount">${code.discount} OFF</span>
                </div>
                <div class="code-description">${code.description || ''}</div>
                <div class="code-box">
                    <span class="code-value">${code.code}</span>
                    <button class="copy-btn" onclick="copyCode('${code.code}', this)">
                        <i data-lucide="copy"></i> Copy
                    </button>
                </div>
                ${code.url ? `<a href="${code.url}" target="_blank" rel="noopener noreferrer" class="code-link">
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

// ─── SHOP / AFFILIATES (vanhan hashtag + haku) ───
function renderAffiliates() {
    const container = document.getElementById('affiliatesList');
    container.innerHTML = '';
    
    siteData.affiliates.forEach(aff => {
        const features = aff.features || aff.tags || [];
        const tagsHtml = features.map(f => 
            `<span class="affiliate-tag" data-tag="${f}" onclick="filterByTag('${f}')">#${f}</span>`
        ).join('');
        
        const card = document.createElement('div');
        card.className = 'affiliate-card';
        card.dataset.tags = JSON.stringify(features);
        card.innerHTML = `
            ${aff.image ? `
            <div class="affiliate-image-wrap">
                <img src="${aff.image}" alt="${aff.title}" class="affiliate-image" loading="lazy">
            </div>
            ` : ''}
            <div class="affiliate-content">
                <div class="affiliate-title">${aff.title}</div>
                <div class="affiliate-desc">${aff.description || ''}</div>
                <div class="affiliate-price">${aff.price || ''}</div>
                <div class="affiliate-features">${tagsHtml}</div>
                <a href="${aff.url}" target="_blank" rel="noopener noreferrer" class="affiliate-cta" onclick="event.stopPropagation()">
                    <i data-lucide="shopping-cart"></i> Osta nyt
                </a>
            </div>
        `;
        
        card.addEventListener('click', () => window.open(aff.url, '_blank'));
        container.appendChild(card);
    });
}

// ─── FILTER TAGS (vanha haku + hashtag) ───
function renderFilterTags() {
    const container = document.getElementById('filterTags');
    const allTags = new Set();
    siteData.affiliates.forEach(aff => {
        (aff.features || aff.tags || []).forEach(t => allTags.add(t));
    });
    
    if (allTags.size === 0) { container.innerHTML = ''; return; }
    
    container.innerHTML = `<span class="filter-tag ${activeFilters.size === 0 ? 'active' : ''}" onclick="clearFilters()">Kaikki</span>` +
        Array.from(allTags).map(tag => 
            `<span class="filter-tag ${activeFilters.has(tag) ? 'active' : ''}" data-tag="${tag}" onclick="toggleFilter('${tag}')">#${tag}</span>`
        ).join('');
}

function toggleFilter(tag) {
    if (activeFilters.has(tag)) {
        activeFilters.delete(tag);
    } else {
        activeFilters.add(tag);
    }
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
    // Switch to shop tab
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
            if (searchVal || activeFilters.size > 0) {
                card.classList.add('highlighted');
            }
            visibleCount++;
        } else {
            card.classList.add('hidden-card');
            card.classList.remove('highlighted');
        }
    });
    
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// ─── KICK LIVE EMBED ───
// This now uses the auto-detect system. The kick embed at the top of the page
// only shows when the streamer is actually LIVE (checked via API).
async function checkKickLive() {
    const embed = document.getElementById('kickEmbed');
    const frame = document.getElementById('kickFrame');
    
    // Find kick link and get username from data
    const kickLink = siteData.links?.find(l => l.icon === 'kick' || l.url?.includes('kick.com/'));
    if (!kickLink) return;
    
    const detected = detectEmbedFromUrl(kickLink.url);
    if (!detected || detected.type !== 'kick') return;
    
    try {
        // Check Kick API for live status
        const res = await fetch(`https://kick.com/api/v2/channels/${detected.username}`);
        if (res.ok) {
            const data = await res.json();
            if (data.data?.livestream) {
                embed.style.display = 'block';
                frame.src = detected.embedUrl;
                return;
            }
        }
    } catch(e) {}
    
    // Don't show embed if not live
    embed.style.display = 'none';
}

// ─── AUTO EMBEDS (from links with embed-able URLs) ───
function renderAutoEmbeds() {
    // Look for links that have auto-detected embeds and render inline embeds
    // Currently this is used by the kick live check — future: could render 
    // YouTube video embeds etc. under specific links
    checkKickLive();
}

// ─── TAB SWITCHING ───
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

// ─── SEARCH BAR ENTER ───
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

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSearch();
    loadData();
});

// ─── FALLBACK ───
function getFallbackData() {
    return {
        profile: { username: '@omaquu', displayName: 'omaquu', bio: 'Someloukkaantuja', avatar: '' },
        links: [
            { id: 'youtube', title: 'YouTube', url: 'https://www.youtube.com/@omaquu', icon: 'youtube', category: 'social', live: false },
            { id: 'kick', title: 'kick.com', url: 'https://kick.com/omaquu', icon: 'kick', category: 'stream', live: true },
            { id: 'twitch', title: 'Twitch.tv', url: 'https://www.twitch.tv/omaquu', icon: 'twitch', category: 'stream', live: false },
            { id: 'tiktok', title: 'TikTok', url: 'https://www.tiktok.com/@omaquu', icon: 'tiktok', category: 'social', live: false },
        ],
        codes: [
            { id: 'biohackbalance', store: 'Biohackbalance.se', code: 'OMAQUU10', discount: '10%', description: 'Superfood tuotteet', url: 'https://biohackbalance.se' }
        ],
        affiliates: [
            { id: 'epomaker', title: 'EPOMAKER HE65 Mec', description: '65% Mechanical Keyboard', price: '$75.99', image: 'https://cdn.shopify.com/s/files/1/0280/3931/5529/files/6_39119f8d-255b-404c-9b5e-688a11e9d56b.jpg?v=1747212239', url: 'https://epomaker.com/products/epomaker-he65-mec?_pos=1&_psq=he65+mec&_ss=e&_v=1.0&sca_ref=8947059.0C4M5Nm0LS', features: ['tech', 'keyboard', 'new'], tags: ['tech', 'keyboard', 'new'] }
        ]
    };
}