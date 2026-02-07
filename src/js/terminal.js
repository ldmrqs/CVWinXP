import { criarJanela } from './windows.js';

export function abrirTerminal(iframeDoc) {
    const html = `
        <div id="terminal-app" style="
            display: flex;
            flex-direction: column;
            height: calc(100% + 20px);
            margin: -10px;
            background: #000;
            font-family: 'Lucida Console', 'Courier New', monospace;
            font-size: 11px;
            overflow: hidden;
            position: relative;
        ">
            <div id="terminal-body" style="
                flex: 1;
                overflow-y: auto;
                padding: 8px;
                cursor: text;
            ">
                <div id="terminal-output" style="color: #ffffff; white-space: pre-wrap; word-wrap: break-word;"></div>
                <div id="terminal-input-line" style="display: flex; color: #ffffff;">
                    <span id="terminal-prompt" style="flex-shrink: 0;">C:\\Users\\larissa&gt;</span>
                    <input id="terminal-input" type="text" style="
                        flex: 1;
                        background: transparent;
                        border: none;
                        outline: none;
                        color: inherit;
                        font-family: inherit;
                        font-size: inherit;
                        padding: 0;
                        margin: 0;
                        caret-color: #ffffff;
                    " spellcheck="false" autocomplete="off">
                </div>
            </div>
        </div>
    `;

    criarJanela(iframeDoc, 'C:\\WINDOWS\\system32\\cmd.exe', html, 440, 300);
    setTimeout(() => initTerminal(iframeDoc), 50);
}

function initTerminal(iframeDoc) {
    const output = iframeDoc.getElementById('terminal-output');
    const input = iframeDoc.getElementById('terminal-input');
    const inputLine = iframeDoc.getElementById('terminal-input-line');
    const body = iframeDoc.getElementById('terminal-body');
    const app = iframeDoc.getElementById('terminal-app');

    if (!output || !input) return;

    const PROMPT = 'C:\\Users\\larissa>';

    output.textContent = [
        'Microsoft Windows XP [Version 5.1.2600]',
        '(C) Copyright 1985-2001 Microsoft Corp.',
        '',
        'type "help" to see available commands.',
        '',
    ].join('\n');

    input.focus();
    app.addEventListener('click', () => input.focus());

    function appendLine(text) {
        output.textContent += text + '\n';
        body.scrollTop = body.scrollHeight;
    }

    function appendLines(lines) {
        output.textContent += lines.join('\n') + '\n';
        body.scrollTop = body.scrollHeight;
    }

    function setColor(color) {
        output.style.color = color;
        inputLine.style.color = color;
        input.style.caretColor = color;
    }

    const history = [];
    let historyIndex = -1;

    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value;
            history.push(cmd);
            historyIndex = history.length;

            appendLine(PROMPT + cmd);
            input.value = '';

            if (cmd.trim()) {
                processCommand(cmd.trim());
            }

            body.scrollTop = body.scrollHeight;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                input.value = '';
            }
        }
    });

    function processCommand(cmd) {
        const parts = cmd.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        switch (command) {
            case 'help': cmdHelp(); break;
            case 'whoami': cmdWhoami(); break;
            case 'cls': cmdCls(); break;
            case 'color': cmdColor(args.toLowerCase()); break;
            case 'dir': cmdDir(); break;
            case 'cd': cmdCd(); break;
            case 'sudo': appendLine('nice try, fren. this is windows, not linux!'); break;
            case 'matrix': cmdMatrix(); break;
            case 'lain': cmdLain(); break;
            case 'ping': cmdPing(args); break;
            case 'exit': cmdExit(); break;
            case 'definitely_not_a_virus.exe': cmdVirus(); break;
            default:
                appendLine(`'${command}' is not recognized as an internal or external command,`);
                appendLine('operable program or batch file.');
                break;
        }
    }

    function cmdHelp() {
        appendLines([
            '',
            'Available commands:',
            '  help       show this help message',
            '  whoami     who am i?',
            '  cls        clear the screen',
            '  color      change text color (e.g. color green)',
            '  dir        list directory contents',
            '  cd         change directory',
            '  ping       ping a host',
            '  sudo       try to elevate privileges',
            '  matrix     take the red pill',
            '  exit       close the terminal',
            '',
        ]);
    }

    function cmdWhoami() {
        appendLines([
            '',
            'who am i? that\'s a good question. who are you? i don\'t know',
            'either. but, if you want to know me, open the browser to find out.',
            '',
        ]);
    }

    function cmdCls() {
        output.textContent = '';
    }

    function cmdColor(args) {
        const colors = {
            white: '#ffffff',
            green: '#00ff00',
            yellow: '#ffff00',
            red: '#ff4444',
            blue: '#5555ff',
            cyan: '#00ffff',
            magenta: '#ff00ff',
            orange: '#ff8800',
            reset: '#ffffff',
        };

        if (!args || !colors[args]) {
            appendLines([
                '',
                'Usage: color <name>',
                'Available colors: ' + Object.keys(colors).join(', '),
                '',
            ]);
            return;
        }

        setColor(colors[args]);
        appendLine(`text color changed to ${args}.`);
    }

    function cmdDir() {
        appendLines([
            '',
            ' Volume in drive C has no label.',
            ' Volume Serial Number is 1337-0666',
            '',
            ' Directory of C:\\Users\\larissa',
            '',
            '01/01/2025  10:00 AM    <DIR>          .',
            '01/01/2025  10:00 AM    <DIR>          ..',
            '01/01/2025  10:00 AM    <DIR>          Desktop',
            '01/01/2025  10:00 AM    <DIR>          Documents',
            '01/01/2025  10:00 AM    <DIR>          Music',
            '01/01/2025  10:00 AM    <DIR>          My Pictures',
            '01/01/2025  10:00 AM        13,337     readme.txt',
            '01/01/2025  10:00 AM           666     secrets.txt',
            '01/01/2025  10:00 AM             0     definitely_not_a_virus.exe',
            '               3 File(s)         14,003 bytes',
            '               6 Dir(s)   31,337,666 bytes free',
            '',
        ]);
    }

    function cmdCd() {
        appendLine("you can't escape this terminal, fren.");
    }

    function cmdVirus() {
        appendLines([
            '',
            'after all this time.. i can\'t believe you found me.',
            'very nice work, asimov.',
            '',
        ]);
        window.top.open('https://www.ratosworld.com/', '_blank');
    }

    function cmdExit() {
        const janela = app.closest('.janela');
        if (janela) {
            const closeBtn = janela.querySelector('.botao-fechar');
            if (closeBtn) closeBtn.click();
        }
    }

    function cmdMatrix() {
        inputLine.style.display = 'none';

        const canvas = iframeDoc.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;';
        canvas.width = app.offsetWidth;
        canvas.height = app.offsetHeight;
        app.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const fontSize = 10;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        const interval = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            canvas.remove();
            inputLine.style.display = '';
            appendLine('');
            appendLine('wake up, neo...');
            appendLine('');
            input.focus();
            body.scrollTop = body.scrollHeight;
        }, 5000);
    }

    let lainInterval = null;

    function cmdLain() {
        input.disabled = true;
        inputLine.style.display = 'none';
        lainInterval = setInterval(() => {
            appendLine("let's all love lain.");
            body.scrollTop = body.scrollHeight;
        }, 150);

        const stopLain = () => {
            if (lainInterval) {
                clearInterval(lainInterval);
                lainInterval = null;
            }
            app.removeEventListener('click', stopLain);

            const overlay = iframeDoc.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:99999;display:flex;align-items:center;justify-content:center;';
            const img = iframeDoc.createElement('img');
            img.src = '/lain.gif';
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
            overlay.appendChild(img);
            iframeDoc.body.appendChild(overlay);

            setTimeout(() => {
                overlay.remove();
                try {
                    window.parent.setSkipLoginPC(true);
                    window.parent.shutdownPC();
                } catch { /* cross-origin fallback */ }
            }, 3000);
        };
        app.addEventListener('click', stopLain);
    }

    function cmdPing(args) {
        const host = args || 'localhost';
        const ip = (host === 'localhost' || host === '127.0.0.1')
            ? '127.0.0.1'
            : `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

        appendLine('');
        appendLine(`Pinging ${ip} with 32 bytes of data:`);
        appendLine('');

        input.disabled = true;
        let count = 0;

        const pingInterval = setInterval(() => {
            const time = Math.floor(Math.random() * 3) + 1;
            appendLine(`Reply from ${ip}: bytes=32 time=${time}ms TTL=128`);
            body.scrollTop = body.scrollHeight;
            count++;

            if (count >= 4) {
                clearInterval(pingInterval);
                appendLines([
                    '',
                    `Ping statistics for ${ip}:`,
                    '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),',
                    'Approximate round trip times in milli-seconds:',
                    '    Minimum = 1ms, Maximum = 3ms, Average = 2ms',
                    '',
                ]);
                input.disabled = false;
                input.focus();
                body.scrollTop = body.scrollHeight;
            }
        }, 800);
    }
}
