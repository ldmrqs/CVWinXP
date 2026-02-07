import { criarJanela } from './windows.js';
import { gerarIPFalso, salvarAutografo } from './guestbook.js';
import { abrirDoom } from './doom.js';

export function initDesktopIcons(iframeDoc) {
    const internetExplorer = iframeDoc.querySelector('.internet');
    const blocoDeNotas = iframeDoc.querySelector('.blocodenotas');
    const lixeira = iframeDoc.querySelector('.lixeira');
    const botaoIniciar = iframeDoc.querySelector('.botão-iniciar');

    if (internetExplorer) {
        internetExplorer.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            criarJanela(iframeDoc, 'Internet Explorer - larissa\'s retro cv', '/resume/', 510, 400, true);
        });
    }

    if (blocoDeNotas) {
        blocoDeNotas.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const ipFalso = gerarIPFalso();
            const janela = criarJanela(iframeDoc, 'Notepad - guestbook.txt', `
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
                            <button id="botaoSalvar" style="padding: 2px 10px; font-size: 11px; cursor: pointer;">💾 save</button>
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

            // Attach event listeners programmatically instead of onclick
            setTimeout(() => {
                const botaoSalvar = iframeDoc.getElementById('botaoSalvar');
                if (botaoSalvar) {
                    botaoSalvar.addEventListener('click', () => salvarAutografo(iframeDoc));
                }

                const textarea = iframeDoc.getElementById('livroAutografos');
                if (textarea) {
                    textarea.addEventListener('keydown', (e) => {
                        if (e.ctrlKey && e.key === 's') {
                            e.preventDefault();
                            salvarAutografo(iframeDoc);
                        }
                    });
                }
            }, 50);
        });
    }

    if (lixeira) {
        lixeira.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            criarJanela(iframeDoc, 'Trash', `
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
                        <img src="/images/desktop/doom2.png" alt="DOOM Icon" style="width: 40px; height: 20px;">
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
                    doomIcon.addEventListener('dblclick', () => abrirDoom(iframeDoc));
                }
            }, 100);
        });
    }

    if (botaoIniciar) {
        botaoIniciar.addEventListener('click', () => {
            alert('working on it!');
        });
    }
}
