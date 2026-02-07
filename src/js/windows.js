let zIndexCounter = 100;

export function criarJanela(iframeDoc, titulo, conteudo, largura = 400, altura = 300, usarIframe = false) {
    if (largura > 550) largura = 550;
    if (altura > 320) altura = 320;

    const centerX = Math.max(25, (600 - largura) / 2);
    const centerY = Math.max(10, (380 - altura) / 2);

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
    botaoMinimizar.addEventListener('click', () => { janela.style.display = 'none'; });

    const botaoMaximizar = document.createElement('div');
    botaoMaximizar.className = 'botao-janela botao-maximizar';

    const botaoFechar = document.createElement('div');
    botaoFechar.className = 'botao-janela botao-fechar';
    botaoFechar.addEventListener('click', () => { janela.remove(); });

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

    tornarArrastavel(iframeDoc, janela, barraTitulo);

    const desktop = iframeDoc.querySelector('.desktop');
    if (desktop) {
        desktop.appendChild(janela);
    }

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
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elemento.style.top = (elemento.offsetTop - pos2) + "px";
        elemento.style.left = (elemento.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        iframeDoc.onmouseup = null;
        iframeDoc.onmousemove = null;
    }
}
