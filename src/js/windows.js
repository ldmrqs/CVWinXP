let zIndexCounter = 100;

const taskbarItems = new Map();

const ICON_MAP = {
    'internet explorer': '/images/desktop/internetexplorer.png',
    'notepad':           '/images/desktop/blocodenotas.png',
    'paint':             '/images/desktop/paint.png',
    'winamp':            '/images/desktop/winamp-icon.png',
    'trash':             '/images/desktop/lixeirawinxp.png',
    'doom':              '/images/desktop/doom2.png',
    'cmd.exe':           '/images/desktop/cmd.png',
};
const DEFAULT_ICON = '/images/desktop/windows-xp-logo.png';

function getIconForTitle(titulo) {
    const lower = titulo.toLowerCase();
    for (const [keyword, path] of Object.entries(ICON_MAP)) {
        if (lower.includes(keyword)) return path;
    }
    return DEFAULT_ICON;
}

export function getNextZIndex() {
    return ++zIndexCounter;
}

export function addToTaskbar(iframeDoc, janelaEl, titulo) {
    const container = iframeDoc.querySelector('.taskbar-items');
    if (!container) return null;

    const btn = iframeDoc.createElement('div');
    btn.className = 'taskbar-item pressed';

    const icon = iframeDoc.createElement('img');
    icon.className = 'taskbar-item-icon';
    icon.src = getIconForTitle(titulo);
    icon.alt = '';

    const text = iframeDoc.createElement('span');
    text.className = 'taskbar-item-text';
    text.textContent = titulo;

    btn.appendChild(icon);
    btn.appendChild(text);

    btn.addEventListener('click', () => {
        if (janelaEl.style.display === 'none') {
            
            janelaEl.style.display = '';
            janelaEl.style.zIndex = ++zIndexCounter;
            setActiveTaskbarItem(janelaEl);
        } else if (btn.classList.contains('pressed')) {
            janelaEl.style.display = 'none';
            btn.classList.remove('pressed');
        } else {
            janelaEl.style.zIndex = ++zIndexCounter;
            setActiveTaskbarItem(janelaEl);
        }
    });

    container.appendChild(btn);
    taskbarItems.set(janelaEl, btn);

    setActiveTaskbarItem(janelaEl);

    return btn;
}

export function removeFromTaskbar(janelaEl) {
    const btn = taskbarItems.get(janelaEl);
    if (btn) {
        btn.remove();
        taskbarItems.delete(janelaEl);
    }
}

export function setActiveTaskbarItem(janelaEl) {
    for (const [, btn] of taskbarItems) {
        btn.classList.remove('pressed');
    }
    const btn = taskbarItems.get(janelaEl);
    if (btn) {
        btn.classList.add('pressed');
    }
}

export function criarJanela(iframeDoc, titulo, conteudo, largura = 400, altura = 300, usarIframe = false) {
    if (largura > 550) largura = 550;
    if (altura > 320) altura = 320;

    const bodyW = iframeDoc.documentElement.clientWidth;
    const bodyH = iframeDoc.documentElement.clientHeight;
    const taskbarHeight = 16;
    const centerX = Math.max(0, (bodyW - largura) / 2);
    const centerY = Math.max(0, (bodyH - taskbarHeight - altura) / 2);

    const janela = document.createElement('div');
    janela.className = 'janela janela-xp';
    janela.style.cssText = `
        position: absolute;
        width: ${largura}px;
        height: ${altura}px;
        background: #ece9d8;
        border: 3px solid #0054e3;
        border-radius: 8px 8px 0 0;
        box-shadow: 0 0 0 1px #003dd0 inset, 2px 2px 5px rgba(0,0,0,0.5);
        z-index: ${++zIndexCounter};
        top: ${centerY}px;
        left: ${centerX}px;
        overflow: hidden;
    `;

    const barraTitulo = document.createElement('div');
    barraTitulo.className = 'barra-titulo barra-titulo-xp';

    const tituloSpan = document.createElement('span');
    tituloSpan.className = 'titulo-janela';
    tituloSpan.textContent = titulo;

    const botoes = document.createElement('div');
    botoes.className = 'botoes-janela';

    const botaoMinimizar = document.createElement('div');
    botaoMinimizar.className = 'botao-janela botao-minimizar';
    botaoMinimizar.addEventListener('click', () => {
        janela.style.display = 'none';
        const btn = taskbarItems.get(janela);
        if (btn) btn.classList.remove('pressed');
    });

    const botaoMaximizar = document.createElement('div');
    botaoMaximizar.className = 'botao-janela botao-maximizar';

    const botaoFechar = document.createElement('div');
    botaoFechar.className = 'botao-janela botao-fechar';
    botaoFechar.addEventListener('click', () => {
        removeFromTaskbar(janela);
        janela.remove();
    });

    botoes.appendChild(botaoMinimizar);
    botoes.appendChild(botaoMaximizar);
    botoes.appendChild(botaoFechar);

    barraTitulo.appendChild(tituloSpan);
    barraTitulo.appendChild(botoes);

    const conteudoDiv = document.createElement('div');
    conteudoDiv.className = 'conteudo-janela';

    if (usarIframe) {
        conteudoDiv.style.cssText = `
            padding: 0;
            height: calc(100% - 30px);
            overflow: hidden;
            background: white;
        `;
        conteudoDiv.innerHTML = `<iframe src="${conteudo}" style="width: 100%; height: 100%; border: none;"></iframe>`;
    } else {
        conteudoDiv.style.cssText = `
            padding: 10px;
            height: calc(100% - 30px);
            overflow: auto;
            font-family: 'Tahoma', 'Segoe UI', sans-serif;
            font-size: 11px;
            background: white;
            box-sizing: border-box;
        `;
        conteudoDiv.innerHTML = conteudo;
    }

    janela.appendChild(barraTitulo);
    janela.appendChild(conteudoDiv);

    janela.addEventListener('mousedown', () => {
        janela.style.zIndex = ++zIndexCounter;
        setActiveTaskbarItem(janela);
    });

    tornarArrastavel(iframeDoc, janela, barraTitulo);

    const desktop = iframeDoc.querySelector('.desktop');
    if (desktop) {
        desktop.appendChild(janela);
    }

    addToTaskbar(iframeDoc, janela, titulo);

    return janela;
}

export function tornarArrastavel(iframeDoc, elemento, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        iframeDoc.onmouseup = closeDragElement;
        iframeDoc.onmousemove = elementDrag;
        elemento.style.zIndex = ++zIndexCounter;
        setActiveTaskbarItem(elemento);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let newTop = elemento.offsetTop - pos2;
        let newLeft = elemento.offsetLeft - pos1;

        const taskbarHeight = 16;
        const bodyW = iframeDoc.documentElement.clientWidth;
        const bodyH = iframeDoc.documentElement.clientHeight;

        const maxTop = Math.max(0, bodyH - taskbarHeight - elemento.offsetHeight);
        if (newTop < 0) newTop = 0;
        if (newTop > maxTop) newTop = maxTop;
        if (newLeft < -elemento.offsetWidth + 50) newLeft = -elemento.offsetWidth + 50;
        if (newLeft > bodyW - 50) newLeft = bodyW - 50;

        elemento.style.top = newTop + "px";
        elemento.style.left = newLeft + "px";
    }

    function closeDragElement() {
        iframeDoc.onmouseup = null;
        iframeDoc.onmousemove = null;
    }
}
