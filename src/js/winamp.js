import { criarJanela } from './windows.js';

const playlist = [
    { title: 'Linkin Park - Numb', src: '/sounds/music/linkin_park_numb.mp3' },
    { title: 'Paramore - Pressure', src: '/sounds/music/paramore_pressure.mp3' },
    { title: 'Fall Out Boy - Thnks fr th Mmrs', src: '/sounds/music/fall_out_boy_thnks_fr_th_mmrs.mp3' },
    { title: 'Evanescence - Going Under', src: '/sounds/music/evanescence_going_under.mp3' },
];

let audio = null;
let currentTrack = 0;
let isPlaying = false;
let seekInterval = null;

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function abrirWinamp(iframeDoc) {
    if (!audio) {
        audio = new Audio(playlist[0].src);
        audio.addEventListener('ended', () => nextTrack(iframeDoc));
    }

    const janela = criarJanela(iframeDoc, 'Winamp', '', 275, 300);

    // Override content area completely
    const conteudoDiv = janela.querySelector('.conteudo-janela');
    conteudoDiv.style.cssText = `
        padding: 0;
        height: calc(100% - 30px);
        overflow: hidden;
        background: #232428;
        box-sizing: border-box;
    `;
    conteudoDiv.innerHTML = '';

    // === MAIN PLAYER SECTION ===
    const mainSection = iframeDoc.createElement('div');
    mainSection.style.cssText = `
        background: linear-gradient(to bottom, #232428, #2a2b30);
        border-bottom: 1px solid #111;
        padding: 6px 8px;
    `;

    // Title bar with scrolling text
    const titleBar = iframeDoc.createElement('div');
    titleBar.style.cssText = `
        background: #000;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        padding: 4px 6px;
        margin-bottom: 6px;
        overflow: hidden;
        white-space: nowrap;
        border: 1px inset #444;
        height: 14px;
        line-height: 14px;
    `;

    const titleText = iframeDoc.createElement('span');
    titleText.id = 'winamp-title';
    titleText.textContent = playlist[currentTrack].title;
    titleText.style.cssText = `display: inline-block;`;
    titleBar.appendChild(titleText);
    mainSection.appendChild(titleBar);

    // Time display
    const timeRow = iframeDoc.createElement('div');
    timeRow.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
    `;

    const timeDisplay = iframeDoc.createElement('div');
    timeDisplay.id = 'winamp-time';
    timeDisplay.style.cssText = `
        font-family: 'Courier New', monospace;
        font-size: 16px;
        color: #00ff00;
        text-shadow: 0 0 6px #00ff00;
        letter-spacing: 1px;
    `;
    timeDisplay.textContent = '0:00';

    const bitrate = iframeDoc.createElement('div');
    bitrate.style.cssText = `
        font-family: 'Courier New', monospace;
        font-size: 8px;
        color: #00ff00;
        opacity: 0.6;
    `;
    bitrate.textContent = '128 kbps  44 kHz';

    timeRow.appendChild(timeDisplay);
    timeRow.appendChild(bitrate);
    mainSection.appendChild(timeRow);

    // Seek bar
    const seekContainer = iframeDoc.createElement('div');
    seekContainer.style.cssText = `
        width: 100%;
        height: 8px;
        background: #000;
        border: 1px inset #444;
        margin-bottom: 6px;
        cursor: pointer;
        position: relative;
    `;

    const seekFill = iframeDoc.createElement('div');
    seekFill.id = 'winamp-seek';
    seekFill.style.cssText = `
        height: 100%;
        background: linear-gradient(to bottom, #7fc87f, #00aa00);
        width: 0%;
        transition: width 0.3s linear;
    `;
    seekContainer.appendChild(seekFill);

    seekContainer.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const rect = seekContainer.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
    });

    mainSection.appendChild(seekContainer);

    // Volume row
    const volumeRow = iframeDoc.createElement('div');
    volumeRow.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 6px;
    `;

    const volLabel = iframeDoc.createElement('span');
    volLabel.style.cssText = `font-size: 8px; color: #aaa; font-family: Tahoma, sans-serif;`;
    volLabel.textContent = 'VOL';

    const volBar = iframeDoc.createElement('div');
    volBar.style.cssText = `
        flex: 1;
        height: 6px;
        background: #000;
        border: 1px inset #444;
        cursor: pointer;
        position: relative;
    `;

    const volFill = iframeDoc.createElement('div');
    volFill.style.cssText = `
        height: 100%;
        background: linear-gradient(to right, #558855, #00cc00);
        width: 70%;
    `;
    volBar.appendChild(volFill);

    volBar.addEventListener('click', (e) => {
        const rect = volBar.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.volume = pct;
        volFill.style.width = (pct * 100) + '%';
    });

    volumeRow.appendChild(volLabel);
    volumeRow.appendChild(volBar);
    mainSection.appendChild(volumeRow);

    // Transport controls
    const controls = iframeDoc.createElement('div');
    controls.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 3px;
    `;

    const btnStyle = `
        width: 30px;
        height: 20px;
        background: linear-gradient(to bottom, #3a3b40, #28292e);
        border: 1px outset #555;
        border-radius: 2px;
        color: #ccc;
        font-size: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
    `;

    const btnPrev = iframeDoc.createElement('div');
    btnPrev.style.cssText = btnStyle;
    btnPrev.innerHTML = '&#9198;';
    btnPrev.addEventListener('click', () => prevTrack(iframeDoc));

    const btnPlay = iframeDoc.createElement('div');
    btnPlay.id = 'winamp-play';
    btnPlay.style.cssText = btnStyle;
    btnPlay.innerHTML = '&#9654;';
    btnPlay.addEventListener('click', () => togglePlay(iframeDoc));

    const btnPause = iframeDoc.createElement('div');
    btnPause.style.cssText = btnStyle;
    btnPause.innerHTML = '&#9646;&#9646;';
    btnPause.style.fontSize = '8px';
    btnPause.addEventListener('click', () => pauseTrack(iframeDoc));

    const btnStop = iframeDoc.createElement('div');
    btnStop.style.cssText = btnStyle;
    btnStop.innerHTML = '&#9632;';
    btnStop.addEventListener('click', () => stopTrack(iframeDoc));

    const btnNext = iframeDoc.createElement('div');
    btnNext.style.cssText = btnStyle;
    btnNext.innerHTML = '&#9197;';
    btnNext.addEventListener('click', () => nextTrack(iframeDoc));

    controls.appendChild(btnPrev);
    controls.appendChild(btnPlay);
    controls.appendChild(btnPause);
    controls.appendChild(btnStop);
    controls.appendChild(btnNext);
    mainSection.appendChild(controls);

    conteudoDiv.appendChild(mainSection);

    // === PLAYLIST SECTION ===
    const playlistSection = iframeDoc.createElement('div');
    playlistSection.style.cssText = `
        background: linear-gradient(to bottom, #232428, #1a1b1f);
        flex: 1;
        display: flex;
        flex-direction: column;
    `;

    const plHeader = iframeDoc.createElement('div');
    plHeader.style.cssText = `
        background: linear-gradient(to bottom, #3a3b40, #28292e);
        color: #fff;
        font-family: Tahoma, sans-serif;
        font-size: 9px;
        font-weight: bold;
        padding: 3px 8px;
        border-bottom: 1px solid #111;
        letter-spacing: 1px;
    `;
    plHeader.textContent = 'WINAMP PLAYLIST';
    playlistSection.appendChild(plHeader);

    const plList = iframeDoc.createElement('div');
    plList.id = 'winamp-playlist';
    plList.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 4px 0;
    `;

    playlist.forEach((track, i) => {
        const item = iframeDoc.createElement('div');
        item.className = 'winamp-track';
        item.dataset.index = i;
        item.style.cssText = `
            padding: 3px 8px;
            font-family: 'Courier New', monospace;
            font-size: 9px;
            color: ${i === currentTrack ? '#fff' : '#00cc00'};
            background: ${i === currentTrack ? '#0000aa' : 'transparent'};
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        item.textContent = `${i + 1}. ${track.title}`;
        item.addEventListener('dblclick', () => {
            currentTrack = i;
            loadAndPlay(iframeDoc);
        });
        plList.appendChild(item);
    });

    playlistSection.appendChild(plList);
    conteudoDiv.appendChild(playlistSection);

    // Start UI update loop
    startSeekUpdate(iframeDoc);

    // Handle window close — stop the update loop
    const closeBtn = janela.querySelector('.botao-fechar');
    const origClose = closeBtn.onclick;
    closeBtn.onclick = null;
    closeBtn.addEventListener('click', () => {
        clearInterval(seekInterval);
        seekInterval = null;
    });
}

function loadAndPlay(iframeDoc) {
    audio.src = playlist[currentTrack].src;
    audio.play();
    isPlaying = true;
    updateUI(iframeDoc);
    startSeekUpdate(iframeDoc);
}

function togglePlay(iframeDoc) {
    if (isPlaying) return;
    if (audio.src.includes(playlist[currentTrack].src)) {
        audio.play();
    } else {
        audio.src = playlist[currentTrack].src;
        audio.play();
    }
    isPlaying = true;
    updateUI(iframeDoc);
    startSeekUpdate(iframeDoc);
}

function pauseTrack(iframeDoc) {
    audio.pause();
    isPlaying = false;
}

function stopTrack(iframeDoc) {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    updateUI(iframeDoc);
}

function nextTrack(iframeDoc) {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadAndPlay(iframeDoc);
}

function prevTrack(iframeDoc) {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadAndPlay(iframeDoc);
}

function updateUI(iframeDoc) {
    const titleEl = iframeDoc.getElementById('winamp-title');
    if (titleEl) titleEl.textContent = playlist[currentTrack].title;

    const tracks = iframeDoc.querySelectorAll('.winamp-track');
    tracks.forEach((el, i) => {
        el.style.color = i === currentTrack ? '#fff' : '#00cc00';
        el.style.background = i === currentTrack ? '#0000aa' : 'transparent';
    });
}

function startSeekUpdate(iframeDoc) {
    if (seekInterval) clearInterval(seekInterval);
    seekInterval = setInterval(() => {
        const timeEl = iframeDoc.getElementById('winamp-time');
        const seekEl = iframeDoc.getElementById('winamp-seek');
        if (!timeEl || !seekEl) {
            clearInterval(seekInterval);
            seekInterval = null;
            return;
        }
        timeEl.textContent = formatTime(audio.currentTime);
        if (audio.duration) {
            seekEl.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
        }
    }, 300);
}
