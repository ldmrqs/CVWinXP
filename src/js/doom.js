import { criarJanela } from './windows.js';

export function abrirDoom(iframeDoc) {
    criarJanela(iframeDoc, 'DOOM.exe', `
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
}
