import { criarJanela, removeFromTaskbar } from './windows.js';
import { gerarIPFalso, salvarAutografo } from './guestbook.js';
import { abrirDoom } from './doom.js';
import { abrirPaint } from './paint.js';
import { abrirWinamp } from './winamp.js';
import { abrirTerminal } from './terminal.js';

export function initDesktopIcons(iframeDoc) {
    const internetExplorer = iframeDoc.querySelector('.internet');
    const blocoDeNotas = iframeDoc.querySelector('.blocodenotas');
    const paint = iframeDoc.querySelector('.paint');
    const winamp = iframeDoc.querySelector('.winamp');
    const lixeira = iframeDoc.querySelector('.lixeira');
    const cmd = iframeDoc.querySelector('.cmd');
    const botaoIniciar = iframeDoc.querySelector('.botão-iniciar');

    if (internetExplorer) {
        internetExplorer.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            criarJanela(iframeDoc, 'Internet Explorer - ldmrqs website', '/resume/', 510, 400, true);
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

    if (paint) {
        paint.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            abrirPaint(iframeDoc);
        });
    }

    if (winamp) {
        winamp.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            abrirWinamp(iframeDoc);
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

    if (cmd) {
        cmd.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            abrirTerminal(iframeDoc);
        });
    }

    if (botaoIniciar) {
        botaoIniciar.addEventListener('click', () => {
            criarJanela(iframeDoc, 'copyright', `
                <div style="
                    display: flex;
                    flex-direction: column;
                    height: calc(100% + 20px);
                    margin: -10px;
                    background: #ece9d8;
                    font-family: 'Tahoma', sans-serif;
                    overflow: hidden;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 15px;
                    ">
                        <div style="
                            width: 32px;
                            height: 32px;
                            flex-shrink: 0;
                            background: radial-gradient(circle at 35% 35%, #ff4444, #cc0000, #880000);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: 18px;
                            box-shadow: 1px 2px 4px rgba(0,0,0,0.4);
                            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                        ">✕</div>
                        <p style="font-size: 11px; margin: 0; color: #000;">
                            &copy; 2025 ldmrqs — powered by nostalgia and too much coke zero.
                        </p>
                    </div>
                    <div style="
                        display: flex;
                        justify-content: center;
                        padding: 0 15px 12px;
                    ">
                        <button id="xp-error-ok" style="
                            min-width: 75px;
                            padding: 3px 0;
                            font-size: 11px;
                            font-family: Tahoma, sans-serif;
                            cursor: pointer;
                            background: #ece9d8;
                            border: 1px solid #003c74;
                            border-radius: 3px;
                            box-shadow: 0 0 0 1px #fff inset, 1px 1px 0 0 #bbb;
                        ">OK</button>
                    </div>
                </div>
            `, 320, 120);

            new Audio('/sounds/xp-error.mp3').play();

            setTimeout(() => {
                const okBtn = iframeDoc.getElementById('xp-error-ok');
                if (okBtn) {
                    okBtn.addEventListener('click', () => {
                        const janela = okBtn.closest('.janela');
                        removeFromTaskbar(janela);
                        janela.remove();
                    });
                }
            }, 50);
        });
    }
}
