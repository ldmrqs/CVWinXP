export function initClock(iframeDoc) {
    const barraDetarefas = iframeDoc.querySelector('.barradetarefas');
    if (!barraDetarefas) return;

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
