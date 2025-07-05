// Estado do sistema
let sistemaLigado = true;
let janelaAtiva = null;
let zIndexCounter = 100;

// Configuração EmailJS - VERIFIQUE ESTES IDs NO SEU DASHBOARD!
const EMAIL_SERVICE_ID = "service_2di7gtn"; // Confirme se este é o ID correto
const EMAIL_TEMPLATE_ID = "template_svtugz7"; // Este está correto conforme a imagem
let ultimoEnvio = 0;

// Elementos principais
const monitor = document.querySelector('.tela');
const ledMonitor = document.querySelector('.ledpower');
const ledGabinete = document.querySelector('.ledgabinete');
const botaoMonitor = document.querySelector('#botaoligardesligar');
const botaoGabinete = document.querySelector('#simbolobotaogabinete');

// Função pra gerar IP falso
function gerarIPFalso() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Função pra ligar/desligar o sistema
function togglePower() {
    sistemaLigado = !sistemaLigado;

    if (sistemaLigado) {
        monitor.style.opacity = '1';
        ledMonitor.style.background = 'greenyellow';
        ledMonitor.style.boxShadow = '0 0 20px 5px #00ff00';
        ledGabinete.style.background = 'greenyellow';
        ledGabinete.style.boxShadow = '0 0 20px 5px #00ff00';
    } else {
        monitor.style.opacity = '0.1';
        ledMonitor.style.background = '#333';
        ledMonitor.style.boxShadow = 'none';
        ledGabinete.style.background = '#333';
        ledGabinete.style.boxShadow = 'none';
    }
}

// Event listeners pros botões de power
if (botaoMonitor) {
    botaoMonitor.addEventListener('click', togglePower);
}
if (botaoGabinete) {
    botaoGabinete.addEventListener('click', togglePower);
}

// Função pra salvar o autógrafo
window.salvarAutografo = function() {
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

    const agora = Date.now();
    if (agora - ultimoEnvio < 30000) {
        const segundosRestantes = Math.ceil((30000 - (agora - ultimoEnvio)) / 1000);
        mostrarFeedback(`wait a few ${segundosRestantes}s to send another one.`, 'warning');
        return;
    }

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = 'sending...';

    const dadosEmail = {
        to_email: "ldrmqs@gmail.com",
        from_name: "Website Visitor",
        message: mensagem,
        timestamp: new Date().toLocaleString('pt-BR'),
        user_agent: navigator.userAgent.substring(0, 100) // Limita o tamanho
    };

    // Debug - remova depois de funcionar
    console.log('Tentando enviar email...');
    console.log('Service ID:', EMAIL_SERVICE_ID);
    console.log('Template ID:', EMAIL_TEMPLATE_ID);
    console.log('Dados:', dadosEmail);

    emailjs.send("service_2di7gtn", "template_svtugz7", dadosEmail)
        .then((response) => {
            console.log('Email enviado com sucesso!', response);
            ultimoEnvio = Date.now();
            mostrarFeedback('success! thanks for the message, fren.', 'success');

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
        })
        .catch((error) => {
            console.error('Erro detalhado:', error);
            mostrarFeedback('❌ error! try again, bro', 'error');
            botaoSalvar.disabled = false;
            botaoSalvar.textContent = '💾 save';
        });
};

// Função pra mostrar feedback
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

// Aguarda o iframe carregar
window.addEventListener('load', function() {
    const iframe = document.querySelector('iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Adiciona relógio na barra de tarefas
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

    // Função pra criar janelas
    function criarJanela(titulo, conteudo, largura = 400, altura = 300, usarIframe = false) {
        // Ajusta o tamanho se for maior que a tela
        if (largura > 550) largura = 550;
        if (altura > 320) altura = 320;

        // Centraliza melhor na tela do monitor
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
        `;

        const barraTitulo = document.createElement('div');
        barraTitulo.className = 'barra-titulo barra-titulo-xp';

        const tituloSpan = document.createElement('span');
        tituloSpan.className = 'titulo-janela';
        tituloSpan.textContent = titulo;

        const botoes = document.createElement('div');
        botoes.className = 'botoes-janela';

        // Criar botões com classes específicas
        const botaoMinimizar = document.createElement('div');
        botaoMinimizar.className = 'botao-janela botao-minimizar';
        botaoMinimizar.addEventListener('click', () => minimizarJanela(janela));

        const botaoMaximizar = document.createElement('div');
        botaoMaximizar.className = 'botao-janela botao-maximizar';
        // Não faz nada por enquanto

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

    // Função pra tornar janelas arrastáveis
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

    // Event listeners pros ícones
    const internetExplorer = iframeDoc.querySelector('.internet');
    const blocoDeNotas = iframeDoc.querySelector('.blocodenotas');
    const lixeira = iframeDoc.querySelector('.lixeira');

    if (internetExplorer) {
        internetExplorer.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            // Agora carrega o portfolio.html no iframe
            criarJanela('Internet Explorer - larissa\'s dark corner', 'resume.html', 510, 400, true);
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
                            <span style="font-size: 10px; color: #666; margin-left: 10px;">or try Ctrl+S</span>
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
hello, IP: ${ipFalso}! welcome to my cv and my guestbook.

write whatever you want here and save it to leave me a message.

i'll read it and reply to you as soon as possible.
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
    
    
            // Adiciona evento de duplo clique no ícone do DOOM
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
