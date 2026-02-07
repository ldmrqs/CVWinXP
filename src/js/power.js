let sistemaLigado = true;

export function initPower() {
    const monitor = document.querySelector('.tela');
    const ledMonitor = document.querySelector('.ledpower');
    const ledGabinete = document.querySelector('.ledgabinete');
    const botaoMonitor = document.querySelector('#botaoligardesligar');
    const botaoGabinete = document.querySelector('#simbolobotaogabinete');

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

    if (botaoMonitor) {
        botaoMonitor.addEventListener('click', togglePower);
    }
    if (botaoGabinete) {
        botaoGabinete.addEventListener('click', togglePower);
    }
}
