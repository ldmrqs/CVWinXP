import { tornarArrastavel, addToTaskbar, removeFromTaskbar, setActiveTaskbarItem, getNextZIndex } from './windows.js';

// ─── Playlist ───
const PLAYLIST = [
    { title: 'Paramore - Pressure', src: '/sounds/music/paramore_pressure.mp3' },
    { title: 'Linkin Park - Numb', src: '/sounds/music/linkin_park_numb.mp3' },
    { title: 'Fall Out Boy - Thnks fr th Mmrs', src: '/sounds/music/fall_out_boy_thnks_fr_th_mmrs.mp3' },
    { title: 'Evanescence - Going Under', src: '/sounds/music/evanescence_going_under.mp3' },
];

// ─── State ───
let audio = null;
let currentTrack = 0;
let isPlaying = false;
let winampEl = null;
let rafId = null;
let marqueePos = 0;
let shuffle = false;
let repeat = false;
let taskbarBtn = null;

// ─── Helpers ───
function fmt(sec) {
    if (isNaN(sec) || sec < 0) return '0:00';
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

// ─── CSS injection ───
function injectCSS(doc) {
    if (doc.getElementById('wa-css')) return;
    const el = doc.createElement('style');
    el.id = 'wa-css';
    el.textContent = `
/* Winamp 2.1 Skin */
.wa-win {
    position: absolute;
    width: 275px;
    font-family: Arial, Helvetica, sans-serif;
    user-select: none;
    box-shadow: 2px 2px 10px rgba(0,0,0,.7);
    background: #232428;
}

/* ── Title Bar ── */
.wa-titlebar {
    background: linear-gradient(180deg, #587a96 0%, #3d5a73 15%, #2a4057 50%, #1d3348 85%, #3d6585 100%);
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3px;
    cursor: move;
    border-bottom: 1px solid #0a0a0a;
}
.wa-titlebar-text {
    color: #fff;
    font-size: 9px;
    font-weight: bold;
    letter-spacing: 3px;
    text-shadow: 1px 1px 1px rgba(0,0,0,.6);
}
.wa-titlebar-btns { display: flex; gap: 1px; }
.wa-titlebar-btns span {
    width: 9px; height: 9px;
    background: linear-gradient(180deg, #6a8ea8, #3a5a73);
    border: 1px outset #7a9aaa;
    border-radius: 1px;
    display: flex; align-items: center; justify-content: center;
    font-size: 7px; color: #fff; cursor: pointer; line-height: 1;
}
.wa-titlebar-btns span:hover { background: linear-gradient(180deg, #8ab0cc, #5a7a93); }

/* ── Display ── */
.wa-display {
    background: #000;
    margin: 4px 4px 2px;
    border: 1px solid #1a1a1a;
    padding: 4px;
}
.wa-display-top { display: flex; gap: 6px; margin-bottom: 3px; }
.wa-viz {
    width: 76px; height: 34px;
    background: #000;
    border: 1px solid #0a2a0a;
    flex-shrink: 0;
    overflow: hidden;
}
.wa-viz canvas { display: block; }
.wa-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
.wa-marquee {
    height: 12px; overflow: hidden; position: relative;
    background: #000;
}
.wa-marquee-text {
    color: #00ff00;
    font-size: 9px;
    font-family: 'Courier New', monospace;
    white-space: nowrap;
    position: absolute; top: 1px; left: 0;
    text-shadow: 0 0 4px #00ff0044;
}
.wa-tech-row { display: flex; align-items: center; gap: 4px; margin-top: 2px; }
.wa-kbps, .wa-khz {
    background: #0a0a0a;
    color: #00cc00;
    font-size: 7px;
    font-family: 'Courier New', monospace;
    padding: 1px 4px;
    border: 1px solid #1a3a1a;
    letter-spacing: 1px;
}
.wa-stereo {
    color: #00cc00;
    font-size: 7px;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
}
.wa-time-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.wa-time {
    color: #00ff00;
    font-family: 'Courier New', monospace;
    font-size: 20px;
    font-weight: bold;
    text-shadow: 0 0 10px #00ff0044;
    letter-spacing: 2px;
    line-height: 1;
}

/* ── Seek Bar ── */
.wa-seek {
    height: 7px;
    background: #000;
    margin: 2px 4px;
    border: 1px inset #333;
    cursor: pointer;
    position: relative;
}
.wa-seek-fill {
    height: 100%;
    background: linear-gradient(180deg, #8fc88f, #00aa00);
    width: 0%;
    pointer-events: none;
}
.wa-seek-thumb {
    position: absolute;
    top: -3px; width: 12px; height: 13px;
    background: linear-gradient(180deg, #e0e0e0, #aaa 40%, #888);
    border: 1px solid #555;
    border-radius: 2px;
    left: 0%;
    transform: translateX(-6px);
    pointer-events: none;
    box-shadow: 0 1px 2px rgba(0,0,0,.4);
}

/* ── Controls Area ── */
.wa-controls { padding: 3px 4px 2px; }
.wa-mid-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3px;
}
.wa-vol-wrap { display: flex; align-items: center; gap: 4px; }
.wa-vol-label {
    color: #888;
    font-size: 7px;
    font-weight: bold;
    min-width: 18px;
}
.wa-vol-bar {
    width: 68px; height: 5px;
    background: #000;
    border: 1px inset #333;
    cursor: pointer;
    position: relative;
}
.wa-vol-fill {
    height: 100%;
    background: linear-gradient(90deg, #336633, #00cc00);
    width: 70%;
    pointer-events: none;
}
.wa-toggles { display: flex; gap: 3px; }
.wa-toggle {
    padding: 1px 5px;
    font-size: 7px;
    font-weight: bold;
    background: linear-gradient(180deg, #3a3b40, #28292e);
    border: 1px outset #555;
    color: #666;
    cursor: pointer;
    letter-spacing: 1px;
}
.wa-toggle.active {
    color: #00ff00;
    text-shadow: 0 0 4px #00ff0044;
    background: linear-gradient(180deg, #28292e, #1a1b20);
    border-style: inset;
}

/* ── Transport ── */
.wa-transport {
    display: flex;
    justify-content: center;
    gap: 2px;
    padding: 0 4px 4px;
}
.wa-tbtn {
    width: 23px; height: 18px;
    background: linear-gradient(180deg, #4a4b50, #2a2b30 40%, #232428 60%, #3a3b40);
    border: 1px outset #666;
    border-radius: 2px;
    color: #ccc;
    font-size: 9px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
}
.wa-tbtn:active {
    border-style: inset;
    background: linear-gradient(180deg, #232428, #3a3b40);
}
.wa-tbtn:hover { color: #fff; }
.wa-tbtn-play.playing { color: #00ff00; text-shadow: 0 0 4px #00ff0055; }

/* ── Playlist ── */
.wa-playlist { border-top: 1px solid #444; }
.wa-pl-header {
    background: linear-gradient(180deg, #587a96 0%, #3d5a73 50%, #2a4057 100%);
    color: #fff;
    font-size: 8px;
    font-weight: bold;
    letter-spacing: 2px;
    padding: 2px 6px;
    text-shadow: 1px 1px 1px #000;
}
.wa-pl-list {
    background: #0a0a0a;
    height: 72px;
    overflow-y: auto;
    border: 1px inset #333;
    margin: 2px 4px;
}
.wa-pl-list::-webkit-scrollbar { width: 8px; }
.wa-pl-list::-webkit-scrollbar-track { background: #1a1a1a; }
.wa-pl-list::-webkit-scrollbar-thumb { background: #444; border: 1px solid #333; }
.wa-pl-track {
    padding: 2px 6px;
    font-family: 'Courier New', monospace;
    font-size: 8px;
    color: #00cc00;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    white-space: nowrap;
}
.wa-pl-track:hover { background: #151515; }
.wa-pl-track.active { color: #fff; background: #0000aa; }
.wa-pl-footer {
    background: linear-gradient(180deg, #3a3b40, #232428);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 6px 3px;
}
.wa-pl-footer-btns { display: flex; gap: 2px; }
.wa-pl-fbtn {
    font-size: 6px; font-weight: bold;
    color: #888; padding: 1px 5px;
    background: linear-gradient(180deg, #3a3b40, #28292e);
    border: 1px outset #555;
    cursor: default;
    letter-spacing: 1px;
}
.wa-pl-info {
    color: #00cc00;
    font-size: 7px;
    font-family: 'Courier New', monospace;
}
`;
    doc.head.appendChild(el);
}

// ─── HTML template ───
function buildHTML() {
    return `
<div class="wa-titlebar">
    <span class="wa-titlebar-text">WINAMP</span>
    <div class="wa-titlebar-btns">
        <span class="wa-btn-min" title="Minimize">_</span>
        <span class="wa-btn-close" title="Close">&times;</span>
    </div>
</div>
<div class="wa-display">
    <div class="wa-display-top">
        <div class="wa-viz"><canvas class="wa-canvas" width="76" height="34"></canvas></div>
        <div class="wa-info">
            <div class="wa-marquee"><span class="wa-marquee-text"></span></div>
            <div class="wa-tech-row">
                <span class="wa-kbps">128</span>
                <span class="wa-khz">44</span>
                <span class="wa-stereo">stereo</span>
            </div>
        </div>
    </div>
    <div class="wa-time-row"><span class="wa-time">0:00</span></div>
</div>
<div class="wa-seek">
    <div class="wa-seek-fill"></div>
    <div class="wa-seek-thumb"></div>
</div>
<div class="wa-controls">
    <div class="wa-mid-row">
        <div class="wa-vol-wrap">
            <span class="wa-vol-label">VOL</span>
            <div class="wa-vol-bar"><div class="wa-vol-fill"></div></div>
        </div>
        <div class="wa-toggles">
            <span class="wa-toggle wa-shuf">SHUF</span>
            <span class="wa-toggle wa-rep">REP</span>
            <span class="wa-toggle wa-pl-toggle active">PL</span>
        </div>
    </div>
</div>
<div class="wa-transport">
    <div class="wa-tbtn wa-prev" title="Previous">&#9198;</div>
    <div class="wa-tbtn wa-tbtn-play wa-play" title="Play">&#9654;</div>
    <div class="wa-tbtn wa-pause" title="Pause">&#10074;&#10074;</div>
    <div class="wa-tbtn wa-stop" title="Stop">&#9632;</div>
    <div class="wa-tbtn wa-next" title="Next">&#9197;</div>
</div>
<div class="wa-playlist">
    <div class="wa-pl-header">WINAMP PLAYLIST</div>
    <div class="wa-pl-list"></div>
    <div class="wa-pl-footer">
        <div class="wa-pl-footer-btns">
            <span class="wa-pl-fbtn">ADD</span>
            <span class="wa-pl-fbtn">REM</span>
            <span class="wa-pl-fbtn">SEL</span>
            <span class="wa-pl-fbtn">MISC</span>
        </div>
        <span class="wa-pl-info">${PLAYLIST.length} tracks</span>
    </div>
</div>`;
}

// ─── Main export ───
export function abrirWinamp(iframeDoc) {
    if (winampEl && winampEl.parentNode) {
        if (winampEl.style.display === 'none') {
            winampEl.style.display = '';
        }
        winampEl.style.zIndex = getNextZIndex();
        setActiveTaskbarItem(winampEl);
        return;
    }

    injectCSS(iframeDoc);

    if (!audio) {
        audio = new Audio();
        audio.volume = 0.7;
        audio.addEventListener('ended', () => {
            if (repeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                nextTrack(iframeDoc);
            }
        });
    }

    const win = iframeDoc.createElement('div');
    win.className = 'wa-win';
    const bw = iframeDoc.documentElement.clientWidth;
    const bh = iframeDoc.documentElement.clientHeight;
    win.style.top = Math.max(5, (bh - 290) / 2) + 'px';
    win.style.left = Math.max(5, (bw - 275) / 2) + 'px';
    win.style.zIndex = getNextZIndex();
    win.innerHTML = buildHTML();

    const plList = win.querySelector('.wa-pl-list');
    PLAYLIST.forEach((track, i) => {
        const item = iframeDoc.createElement('div');
        item.className = 'wa-pl-track' + (i === currentTrack ? ' active' : '');
        item.dataset.idx = i;
        item.textContent = `${i + 1}. ${track.title}`;
        item.addEventListener('dblclick', () => {
            currentTrack = i;
            loadAndPlay(iframeDoc);
        });
        plList.appendChild(item);
    });

    setupListeners(iframeDoc, win);
    tornarArrastavel(iframeDoc, win, win.querySelector('.wa-titlebar'));

    const desktop = iframeDoc.querySelector('.desktop');
    if (desktop) desktop.appendChild(win);
    winampEl = win;

    taskbarBtn = addToTaskbar(iframeDoc, win, 'Winamp');

    win.addEventListener('mousedown', () => {
        win.style.zIndex = getNextZIndex();
        setActiveTaskbarItem(win);
    });

    updateMarqueeText();
    startLoop(iframeDoc);
}

// ─── Event Listeners ───
function setupListeners(doc, win) {
    win.querySelector('.wa-btn-close').addEventListener('click', () => closeWinamp());

    win.querySelector('.wa-btn-min').addEventListener('click', () => {
        if (winampEl) {
            winampEl.style.display = 'none';
            if (taskbarBtn) taskbarBtn.classList.remove('pressed');
        }
    });

    win.querySelector('.wa-play').addEventListener('click', () => togglePlay(doc));
    win.querySelector('.wa-pause').addEventListener('click', () => pauseTrack());
    win.querySelector('.wa-stop').addEventListener('click', () => stopTrack(doc));
    win.querySelector('.wa-prev').addEventListener('click', () => prevTrack(doc));
    win.querySelector('.wa-next').addEventListener('click', () => nextTrack(doc));

    win.querySelector('.wa-seek').addEventListener('click', (e) => {
        if (!audio || !audio.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });

    win.querySelector('.wa-vol-bar').addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.volume = pct;
        win.querySelector('.wa-vol-fill').style.width = (pct * 100) + '%';
    });

    win.querySelector('.wa-shuf').addEventListener('click', (e) => {
        shuffle = !shuffle;
        e.currentTarget.classList.toggle('active', shuffle);
    });

    win.querySelector('.wa-rep').addEventListener('click', (e) => {
        repeat = !repeat;
        e.currentTarget.classList.toggle('active', repeat);
    });

    win.querySelector('.wa-pl-toggle').addEventListener('click', (e) => {
        const pl = win.querySelector('.wa-playlist');
        const visible = pl.style.display !== 'none';
        pl.style.display = visible ? 'none' : '';
        e.currentTarget.classList.toggle('active', !visible);
    });
}

// ─── Playback ───
function loadAndPlay(doc) {
    audio.src = PLAYLIST[currentTrack].src;
    audio.play();
    isPlaying = true;
    marqueePos = 0;
    updateMarqueeText();
    updatePlaylistHighlight();
    updatePlayButton();
    startLoop(doc);
}

function togglePlay(doc) {
    if (isPlaying) return;
    if (!audio.src || !audio.src.includes(PLAYLIST[currentTrack].src)) {
        audio.src = PLAYLIST[currentTrack].src;
    }
    audio.play();
    isPlaying = true;
    updatePlayButton();
    startLoop(doc);
}

function pauseTrack() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    updatePlayButton();
}

function stopTrack() {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    updatePlayButton();
}

function nextTrack(doc) {
    if (shuffle) {
        let next;
        do { next = Math.floor(Math.random() * PLAYLIST.length); }
        while (next === currentTrack && PLAYLIST.length > 1);
        currentTrack = next;
    } else {
        currentTrack = (currentTrack + 1) % PLAYLIST.length;
    }
    loadAndPlay(doc);
}

function prevTrack(doc) {
    if (shuffle) {
        let next;
        do { next = Math.floor(Math.random() * PLAYLIST.length); }
        while (next === currentTrack && PLAYLIST.length > 1);
        currentTrack = next;
    } else {
        currentTrack = (currentTrack - 1 + PLAYLIST.length) % PLAYLIST.length;
    }
    loadAndPlay(doc);
}

// ─── UI Updates ───
function updatePlaylistHighlight() {
    if (!winampEl) return;
    winampEl.querySelectorAll('.wa-pl-track').forEach((el, i) => {
        el.classList.toggle('active', i === currentTrack);
    });
}

function updatePlayButton() {
    if (!winampEl) return;
    const btn = winampEl.querySelector('.wa-tbtn-play');
    if (btn) btn.classList.toggle('playing', isPlaying);
}

function updateMarqueeText() {
    if (!winampEl) return;
    const el = winampEl.querySelector('.wa-marquee-text');
    if (el) {
        const txt = `${currentTrack + 1}. ${PLAYLIST[currentTrack].title}  ***  `;
        el.textContent = txt + txt; // duplicate for seamless scroll
    }
}

// ─── Animation Loop ───
function startLoop(doc) {
    if (rafId) return;
    function loop() {
        if (!winampEl || !winampEl.parentNode) {
            rafId = null;
            return;
        }
        updateTime();
        updateSeek();
        updateMarquee();
        drawViz();
        rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
}

function updateTime() {
    const el = winampEl.querySelector('.wa-time');
    if (el && audio) el.textContent = fmt(audio.currentTime);
}

function updateSeek() {
    if (!audio || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    const fill = winampEl.querySelector('.wa-seek-fill');
    const thumb = winampEl.querySelector('.wa-seek-thumb');
    if (fill) fill.style.width = pct + '%';
    if (thumb) thumb.style.left = pct + '%';
}

function updateMarquee() {
    const el = winampEl.querySelector('.wa-marquee-text');
    if (!el) return;
    marqueePos -= 0.5;
    const halfWidth = el.offsetWidth / 2;
    if (halfWidth > 0 && marqueePos < -halfWidth) {
        marqueePos = 0;
    }
    el.style.transform = `translateX(${marqueePos}px)`;
}

// ─── Visualization (fake spectrum) ───
function drawViz() {
    const canvas = winampEl.querySelector('.wa-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    if (!isPlaying) return;

    const bars = 20;
    const barW = w / bars;
    const t = performance.now() / 1000;

    for (let i = 0; i < bars; i++) {
        // Bass bias: left bars taller
        const bassBias = 1 - (i / bars) * 0.5;
        // Multiple sin waves for organic movement
        const wave =
            Math.sin(t * 3.2 + i * 0.9) * 0.25 +
            Math.sin(t * 5.1 + i * 1.4) * 0.2 +
            Math.cos(t * 2.3 + i * 0.6) * 0.15 +
            Math.sin(t * 7.7 + i * 2.1) * 0.1;
        const val = Math.max(0.04, (0.35 + wave) * bassBias);
        const barH = val * h;
        const green = Math.floor(100 + val * 200);

        ctx.fillStyle = `rgb(0, ${Math.min(255, green)}, 0)`;
        ctx.fillRect(
            Math.floor(i * barW),
            h - barH,
            Math.ceil(barW) - 1,
            barH
        );
    }
}

// ─── Cleanup ───
function closeWinamp() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    isPlaying = false;
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (winampEl) {
        removeFromTaskbar(winampEl);
        winampEl.remove();
        winampEl = null;
    }
    taskbarBtn = null;
}
