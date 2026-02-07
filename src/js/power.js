let sistemaLigado = false;
let iframeDocRef = null;
let shutdownFn = null;

const pcSound = new Audio('/sounds/oldpcsound.mp3');
pcSound.loop = true;
pcSound.volume = 0.15;

export function setIframeDoc(doc) {
    iframeDocRef = doc;
}

export function shutdown() {
    if (shutdownFn && sistemaLigado) shutdownFn();
}

export function initPower() {
    const monitor = document.querySelector('.tela');
    const ledMonitor = document.querySelector('.ledpower');
    const ledGabinete = document.querySelector('.ledgabinete');
    const botaoMonitor = document.querySelector('.botaopower');
    const botaoGabinete = document.querySelector('.botaogabinete');

    // Começa desligado
    monitor.classList.add('desligado');
    ledMonitor.style.background = '#333';
    ledMonitor.style.boxShadow = 'none';
    ledGabinete.style.background = '#333';
    ledGabinete.style.boxShadow = 'none';

    function togglePower() {
        sistemaLigado = !sistemaLigado;

        if (sistemaLigado) {
            monitor.classList.remove('desligado');
            ledMonitor.style.background = 'greenyellow';
            ledMonitor.style.boxShadow = '0 0 20px 5px #00ff00';
            ledGabinete.style.background = 'greenyellow';
            ledGabinete.style.boxShadow = '0 0 20px 5px #00ff00';
            pcSound.play();

            // Show login screen
            if (iframeDocRef) {
                const loginScreen = iframeDocRef.querySelector('.xp-login');
                if (loginScreen) {
                    loginScreen.style.display = '';
                    loginScreen.classList.remove('hidden');
                }
            }
        } else {
            monitor.classList.add('desligado');
            ledMonitor.style.background = '#333';
            ledMonitor.style.boxShadow = 'none';
            ledGabinete.style.background = '#333';
            ledGabinete.style.boxShadow = 'none';
            pcSound.pause();
            pcSound.currentTime = 0;

            // Reset login screen for next boot
            if (iframeDocRef) {
                const loginScreen = iframeDocRef.querySelector('.xp-login');
                if (loginScreen) {
                    loginScreen.style.display = '';
                    loginScreen.classList.remove('hidden');
                }
            }
        }
    }

    shutdownFn = togglePower;

    if (botaoMonitor) {
        botaoMonitor.addEventListener('click', togglePower);
    }
    if (botaoGabinete) {
        botaoGabinete.addEventListener('click', togglePower);
    }
}
