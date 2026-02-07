let sistemaLigado = false;
let iframeDocRef = null;
let shutdownFn = null;
let skipLoginOnBoot = false;

const pcSound = new Audio('/sounds/oldpcsound.mp3');
pcSound.loop = true;
pcSound.volume = 0.15;

export function setIframeDoc(doc) {
    iframeDocRef = doc;
}

export function shutdown() {
    if (shutdownFn && sistemaLigado) shutdownFn();
}

export function setSkipLogin(val) {
    skipLoginOnBoot = val;
}

export function initPower() {
    const monitor = document.querySelector('.tela');
    const ledMonitor = document.querySelector('.ledpower');
    const ledGabinete = document.querySelector('.ledgabinete');
    const botaoMonitor = document.querySelector('.botaopower');
    const botaoGabinete = document.querySelector('.botaogabinete');

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

            if (iframeDocRef) {
                const loginScreen = iframeDocRef.querySelector('.xp-login');
                if (loginScreen) {
                    if (skipLoginOnBoot) {
                        loginScreen.style.display = 'none';
                        skipLoginOnBoot = false;
                    } else {
                        loginScreen.style.display = '';
                        loginScreen.classList.remove('hidden');
                    }
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
