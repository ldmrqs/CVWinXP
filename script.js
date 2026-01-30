
let sistemaLigado = true;
let janelaAtiva = null;
let zIndexCounter = 100;

// API configuration (credentials now secure on backend)
// Automatically detects if running locally or in production
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api'
    : 'https://ldmrqs.com/api'; // Update this to your actual backend URL
let ultimoEnvio = 0;

const monitor = document.querySelector('.tela');
const ledMonitor = document.querySelector('.ledpower');
const ledGabinete = document.querySelector('.ledgabinete');
const botaoMonitor = document.querySelector('#botaoligardesligar');
const botaoGabinete = document.querySelector('#simbolobotaogabinete');

// false ip address function for the easter egg
function gerarIPFalso() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// to turn on or off the system
function togglePower() {
    sistemaLigado = !sistemaLigado;

    if (sistemaLigado) {
        monitor.classList.remove('desligado');
        ledMonitor.style.background = 'greenyellow';
        ledMonitor.style.boxShadow = '0 0 20px 5px #00ff00';
        ledGabinete.style.background = 'greenyellow';
        ledGabinete.style.boxShadow = '0 0 20px 5px #00ff00';
    } else {
        monitor.classList.add('desligado');
        ledMonitor.style.background = '#333';
        ledMonitor.style.boxShadow = 'none';
        ledGabinete.style.background = '#333';
        ledGabinete.style.boxShadow = 'none';
    }
}


// power button event listeners
if (botaoMonitor) {
    botaoMonitor.addEventListener('click', togglePower);
}
if (botaoGabinete) {
    botaoGabinete.addEventListener('click', togglePower);
}

// function to autograph the guestbook (now using secure backend API)
window.salvarAutografo = async function() {
    const textarea = document.getElementById('livroAutografos');
    const botaoSalvar = document.getElementById('botaoSalvar');
    const conteudo = textarea.value;

    const divisor = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    const partes = conteudo.split(divisor);
    const mensagem = partes[partes.length - 1].trim();

    if (!mensagem) {
        mostrarFeedback('❌ Write something before saving!', 'error');
        return;
    }

    if (mensagem.length < 3) {
        mostrarFeedback('❌ Too short, try something else, fren.', 'error');
        return;
    }

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = 'saving...';

    try {
        // Send to secure backend API
        const response = await fetch(`${API_URL}/guestbook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: mensagem })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            ultimoEnvio = Date.now();
            mostrarFeedback('success!', 'success');

            // Easter egg do IP falso
            setTimeout(() => {
                mostrarFeedback("thank you for passing by! and don't worry, that's not your real IP address.", 'easter');
            }, 2000);

            // Outros easter eggs
            if (mensagem.toLowerCase().includes('windows xp')) {
                setTimeout(() => mostrarFeedback('🎵 *toca o som de inicialização do XP* 🎵', 'easter'), 4500);
            }
            if (mensagem.toLowerCase().includes('saudade')) {
                setTimeout(() => mostrarFeedback('wish we could turn back time to the good old days...', 'easter'), 4500);
            }

            textarea.value = conteudo.split(divisor)[0] + divisor + '\n\n';

            setTimeout(() => {
                botaoSalvar.disabled = false;
                botaoSalvar.textContent = '💾 save';
            }, 3000);
        } else {
            mostrarFeedback(data.error || '❌ error! try again, bro', 'error');
            botaoSalvar.disabled = false;
            botaoSalvar.textContent = '💾 save';
        }
    } catch (error) {
        console.error('Error sending message:', error);
        mostrarFeedback('❌ error! try again, bro', 'error');
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = '💾 save';
    }
};

// feedback function
function mostrarFeedback(mensagem, tipo) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = mensagem;
        feedback.style.display = 'block';
        feedback.style.color = tipo === 'error' ? '#ff0000' : 
                               tipo === 'success' ? '#008000' : 
                               tipo === 'easter' ? '#0054e3' : '#ff8c00';

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }
}

window.addEventListener('load', function() {
    const iframe = document.querySelector('iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // taskbar clock
    const barraDetarefas = iframeDoc.querySelector('.barradetarefas');
    if (barraDetarefas) {
        const relogio = document.createElement('div');
        relogio.className = 'relogio';
        relogio.style.cssText = `
            position: absolute;
            right: 10px;
            color: white;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            font-size: 11px;
            display: flex;
            align-items: center;
            height: 100%;
        `;
        barraDetarefas.appendChild(relogio);

        function atualizarRelogio() {
            const agora = new Date();
            const horas = String(agora.getHours()).padStart(2, '0');
            const minutos = String(agora.getMinutes()).padStart(2, '0');
            relogio.textContent = `${horas}:${minutos}`;
        }
        atualizarRelogio();
        setInterval(atualizarRelogio, 1000);
    }


    function criarJanela(titulo, conteudo, largura = 400, altura = 300, usarIframe = false) {
        // Ajusta o tamanho se for maior que a tela
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
            overflow: hidden; /* ADICIONA OVERFLOW HIDDEN AQUI */
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
        botaoMinimizar.addEventListener('click', () => minimizarJanela(janela));
    
        const botaoMaximizar = document.createElement('div');
        botaoMaximizar.className = 'botao-janela botao-maximizar';
        // doesnt do anything yet
    
        const botaoFechar = document.createElement('div');
        botaoFechar.className = 'botao-janela botao-fechar';
        botaoFechar.addEventListener('click', () => fecharJanela(janela));
    
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
                box-sizing: border-box; /* ADICIONA BOX-SIZING */
            `;
            conteudoDiv.innerHTML = conteudo;
        }
    
        janela.appendChild(barraTitulo);
        janela.appendChild(conteudoDiv);
    
        tornarArrastavel(janela, barraTitulo);
    
        const desktop = iframeDoc.querySelector('.desktop');
        if (desktop) {
            desktop.appendChild(janela);
        }
    
        return janela;
    }
    


    function tornarArrastavel(elemento, handle) {
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

    function minimizarJanela(janela) {
        janela.style.display = 'none';
    }

    function fecharJanela(janela) {
        janela.remove();
    }


    const internetExplorer = iframeDoc.querySelector('.internet');
    const blocoDeNotas = iframeDoc.querySelector('.blocodenotas');
    const lixeira = iframeDoc.querySelector('.lixeira');

    if (internetExplorer) {
        internetExplorer.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            
            criarJanela('Internet Explorer - larissa\'s retro cv', 'resume.html', 510, 400, true);
        });
    }



    
    if (blocoDeNotas) {
        blocoDeNotas.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const ipFalso = gerarIPFalso();
            criarJanela('Notepad - guestbook.txt', `
                <div style="
                    display: flex; 
                    flex-direction: column; 
                    height: 100%;
                    margin: -10px;
                ">
                    <div style="
                        background: #f0f0f0; 
                        padding: 10px 10px; 
                        border-bottom: 1px solid #ccc; 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: center;
                    ">
                        <div>
                            <button id="botaoSalvar" onclick="salvarAutografo()" style="padding: 2px 10px; font-size: 11px; cursor: pointer;">💾 save</button>
                            <span style="font-size: 10px; color: #666; margin-left: 10px;"></span>
                        </div>
                        <div id="feedback" style="font-size: 11px; display: none;"></div>
                    </div>
                    <div style="
                        flex: 1;
                        overflow: hidden;
                        padding: 0;
                    ">
                        <textarea id="livroAutografos" style="
                            width: 100%;
                            height: 100%;
                            border: none; 
                            resize: none; 
                            font-family: 'Courier New', monospace; 
                            padding: 10px; 
                            font-size: 12px;
                            margin: 0;
                            box-sizing: border-box;
                            background: white;
                            outline: none;
                            display: block;
                        ">
hello, IP: ${ipFalso}! welcome to my guestbook.

write whatever you want here and save it to leave me a message.

c'mon, fren, leave your mark!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

</textarea>
                    </div>
                </div>
            `, 450, 300);

            const textarea = document.getElementById('livroAutografos');
            if (textarea) {
                textarea.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key === 's') {
                        e.preventDefault();
                        salvarAutografo();
                    }
                });
            }
        });
    }

    if (lixeira) {
        lixeira.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            criarJanela('Trash', `
                <div style="
                    display: flex;
                    justify-content: left;
                    align-items: left;
                    height: 100%;
                ">
                    <div style="
                        text-align: left;
                        cursor: pointer;
                        padding: 10px;
                    " id="doomIcon">
                        <img src="doom2.png" alt="DOOM Icon" style="width: 40px; height: 20px;">
                        <p style="
                            font-size: 10px; 
                            margin: 0px 0 0 0;
                            user-select: none;
                            cursor: default;
                        ">doom.exe</p>
                    </div>
                </div>
            `, 280, 180);


            
            setTimeout(() => {
                const doomIcon = iframeDoc.getElementById('doomIcon');
                if (doomIcon) {
                    doomIcon.addEventListener('dblclick', () => {
                        // Cria janela do DOOM com Archive.org
                        criarJanela('DOOM.exe', `
                            <div style="
                                width: 100%;
                                height: 100%;
                                background: black;
                                margin: -10px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                color: white;
                                font-family: 'Courier New';
                            ">
                                <div style="text-align: center;">
                                                <iframe 
                                        src="https://archive.org/embed/DoomsharewareEpisode" 
                                        width="510" 
                                        height="290" 
                                        frameborder="0" 
                                        sandbox="allow-scripts allow-same-origin"
                                        webkitallowfullscreen="true" 
                                        mozallowfullscreen="true" 
                                        allowfullscreen>
                                    </iframe>
                                </div>
                            </div>
                        `, 510, 400);
                    });
                }
            }, 100);
        });
    }





    const botaoIniciar = iframeDoc.querySelector('.botão-iniciar');
    if (botaoIniciar) {
        botaoIniciar.addEventListener('click', () => {
            alert('working on it!');
        });
    }
});
