import { criarJanela } from './windows.js';

export function abrirPaint(iframeDoc) {
    criarJanela(iframeDoc, 'untitled - Paint', `
        <div id="paint-app" style="
            display: flex;
            flex-direction: column;
            height: 100%;
            margin: -10px;
            font-family: Tahoma, sans-serif;
            font-size: 11px;
            user-select: none;
            background: #ece9d8;
        ">
            <!-- Menu bar -->
            <div style="
                background: #ece9d8;
                padding: 1px 4px;
                display: flex;
                gap: 8px;
                font-size: 11px;
                border-bottom: 1px solid #aaa;
            ">
                <span style="cursor: default;">File</span>
                <span style="cursor: default;">Edit</span>
                <span style="cursor: default;">View</span>
                <span style="cursor: default;">Image</span>
                <span style="cursor: default;">Colors</span>
                <span style="cursor: default;">Help</span>
            </div>

            <!-- Main area: toolbox left + canvas -->
            <div style="display: flex; flex: 1; overflow: hidden;">

                <!-- Left toolbox -->
                <div style="
                    background: #ece9d8;
                    border-right: 1px solid #aaa;
                    padding: 3px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    width: 42px;
                    flex-shrink: 0;
                ">
                    <!-- Tool grid 2 columns -->
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1px;
                    ">
                        <button id="paint-pencil" title="Pencil" style="width: 18px; height: 18px; font-size: 8px; cursor: pointer; border: 1px solid #808080; background: #d4d0c8; padding: 0; display: flex; align-items: center; justify-content: center;">✏</button>
                        <button id="paint-brush" title="Brush" style="width: 18px; height: 18px; font-size: 8px; cursor: pointer; border: 1px solid #808080; background: #f0f0f0; padding: 0; display: flex; align-items: center; justify-content: center;">🖌</button>
                        <button id="paint-eraser" title="Eraser" style="width: 18px; height: 18px; font-size: 8px; cursor: pointer; border: 1px solid #808080; background: #f0f0f0; padding: 0; display: flex; align-items: center; justify-content: center;">⌫</button>
                        <button id="paint-fill" title="Fill" style="width: 18px; height: 18px; font-size: 8px; cursor: pointer; border: 1px solid #808080; background: #f0f0f0; padding: 0; display: flex; align-items: center; justify-content: center;">🪣</button>
                        <button id="paint-line" title="Line" style="width: 18px; height: 18px; font-size: 9px; cursor: pointer; border: 1px solid #808080; background: #f0f0f0; padding: 0; display: flex; align-items: center; justify-content: center;">╲</button>
                        <button id="paint-rect" title="Rectangle" style="width: 18px; height: 18px; font-size: 8px; cursor: pointer; border: 1px solid #808080; background: #f0f0f0; padding: 0; display: flex; align-items: center; justify-content: center;">▭</button>
                    </div>

                    <!-- Brush size options -->
                    <div id="paint-sizes" style="
                        margin-top: 4px;
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        align-items: center;
                    ">
                        <div class="paint-size-opt" data-size="1" style="width: 16px; height: 16px; border: 1px solid #808080; background: #f0f0f0; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <div style="width: 2px; height: 2px; background: black; border-radius: 50%;"></div>
                        </div>
                        <div class="paint-size-opt" data-size="3" style="width: 16px; height: 16px; border: 1px solid #808080; background: #d4d0c8; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <div style="width: 4px; height: 4px; background: black; border-radius: 50%;"></div>
                        </div>
                        <div class="paint-size-opt" data-size="6" style="width: 16px; height: 16px; border: 1px solid #808080; background: #f0f0f0; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <div style="width: 7px; height: 7px; background: black; border-radius: 50%;"></div>
                        </div>
                        <div class="paint-size-opt" data-size="10" style="width: 16px; height: 16px; border: 1px solid #808080; background: #f0f0f0; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <div style="width: 10px; height: 10px; background: black; border-radius: 50%;"></div>
                        </div>
                    </div>

                    <!-- Foreground/background color indicator -->
                    <div style="position: relative; width: 24px; height: 24px; margin-top: 6px;">
                        <div id="paint-bg-color" style="
                            position: absolute; right: 0; bottom: 0;
                            width: 16px; height: 16px;
                            background: #ffffff;
                            border: 1px solid #808080;
                        "></div>
                        <div id="paint-fg-color" style="
                            position: absolute; left: 0; top: 0;
                            width: 16px; height: 16px;
                            background: #000000;
                            border: 1px solid #808080;
                        "></div>
                    </div>
                </div>

                <!-- Canvas area -->
                <div style="flex: 1; overflow: hidden; background: #808080; padding: 2px;">
                    <canvas id="paint-canvas" style="background: white; cursor: crosshair; display: block;"></canvas>
                </div>
            </div>

            <!-- Bottom color palette -->
            <div style="
                background: #ece9d8;
                padding: 3px 4px;
                border-top: 1px solid #aaa;
                display: flex;
                align-items: center;
                gap: 1px;
            ">
                <div id="paint-palette" style="display: flex; gap: 1px; flex-wrap: wrap; max-height: 26px;"></div>
            </div>

            <!-- Status bar -->
            <div style="
                background: #ece9d8;
                border-top: 1px solid #aaa;
                padding: 1px 4px;
                font-size: 10px;
                color: #444;
            ">
                <span id="paint-status">ready</span>
            </div>
        </div>
    `, 420, 300);

    setTimeout(() => initPaintCanvas(iframeDoc), 50);
}

function initPaintCanvas(iframeDoc) {
    const canvas = iframeDoc.getElementById('paint-canvas');
    if (!canvas) return;

    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let drawing = false;
    let tool = 'pencil';
    let color = '#000000';
    let size = 3;
    let startX, startY;
    let snapshot;

    // Classic MS Paint XP palette (2 rows of 14)
    const colors = [
        '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#4000ff', '#804000',
        '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8000'
    ];

    // Build palette
    const palette = iframeDoc.getElementById('paint-palette');
    colors.forEach(c => {
        const swatch = iframeDoc.createElement('div');
        swatch.style.cssText = `
            width: 11px; height: 11px;
            background: ${c};
            border: 1px solid #808080;
            cursor: pointer;
        `;
        swatch.addEventListener('click', () => {
            color = c;
            iframeDoc.getElementById('paint-fg-color').style.background = c;
        });
        palette.appendChild(swatch);
    });

    // Tool buttons
    const toolBtns = {
        pencil: iframeDoc.getElementById('paint-pencil'),
        brush: iframeDoc.getElementById('paint-brush'),
        eraser: iframeDoc.getElementById('paint-eraser'),
        fill: iframeDoc.getElementById('paint-fill'),
        line: iframeDoc.getElementById('paint-line'),
        rect: iframeDoc.getElementById('paint-rect'),
    };

    function selectTool(name) {
        tool = name;
        Object.entries(toolBtns).forEach(([key, btn]) => {
            btn.style.background = key === name ? '#d4d0c8' : '#f0f0f0';
        });
        canvas.style.cursor = (name === 'fill') ? 'crosshair' : 'crosshair';
    }

    Object.entries(toolBtns).forEach(([name, btn]) => {
        btn.addEventListener('click', () => selectTool(name));
    });

    // Size options
    const sizeOpts = iframeDoc.querySelectorAll('.paint-size-opt');
    sizeOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            size = parseInt(opt.dataset.size);
            sizeOpts.forEach(o => o.style.background = '#f0f0f0');
            opt.style.background = '#d4d0c8';
        });
    });

    // Fill bucket
    function floodFill(startX, startY, fillColor) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;

        const idx = (y * w + startX) * 4;
        var y = startY;
        const targetR = data[(startY * w + startX) * 4];
        const targetG = data[(startY * w + startX) * 4 + 1];
        const targetB = data[(startY * w + startX) * 4 + 2];

        const temp = iframeDoc.createElement('div');
        temp.style.color = fillColor;
        iframeDoc.body.appendChild(temp);
        const computed = getComputedStyle(temp).color;
        iframeDoc.body.removeChild(temp);
        const match = computed.match(/\d+/g);
        const fillR = parseInt(match[0]);
        const fillG = parseInt(match[1]);
        const fillB = parseInt(match[2]);

        if (targetR === fillR && targetG === fillG && targetB === fillB) return;

        const stack = [[startX, startY]];
        const visited = new Set();

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = y * w + x;
            if (x < 0 || x >= w || y < 0 || y >= h || visited.has(key)) continue;

            const i = key * 4;
            if (Math.abs(data[i] - targetR) > 10 || Math.abs(data[i+1] - targetG) > 10 || Math.abs(data[i+2] - targetB) > 10) continue;

            visited.add(key);
            data[i] = fillR;
            data[i+1] = fillG;
            data[i+2] = fillB;
            data[i+3] = 255;

            stack.push([x+1, y], [x-1, y], [x, y+1], [x, y-1]);
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // Drawing
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    canvas.addEventListener('mousedown', (e) => {
        const pos = getPos(e);

        if (tool === 'fill') {
            floodFill(Math.round(pos.x), Math.round(pos.y), color);
            return;
        }

        drawing = true;
        startX = pos.x;
        startY = pos.y;

        if (tool === 'line' || tool === 'rect') {
            snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
        const pos = getPos(e);
        const status = iframeDoc.getElementById('paint-status');
        if (status) status.textContent = `${Math.round(pos.x)}, ${Math.round(pos.y)}px`;

        if (!drawing) return;

        if (tool === 'line') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(pos.x, pos.y);
            ctx.lineWidth = size;
            ctx.strokeStyle = color;
            ctx.lineCap = 'round';
            ctx.stroke();
        } else if (tool === 'rect') {
            ctx.putImageData(snapshot, 0, 0);
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
        } else {
            ctx.lineWidth = tool === 'brush' ? size * 2 : size;
            ctx.lineCap = 'round';
            ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        ctx.beginPath();
    });

    canvas.addEventListener('mouseleave', () => {
        drawing = false;
        ctx.beginPath();
    });

    selectTool('pencil');
}
