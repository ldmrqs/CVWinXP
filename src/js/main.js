import { initPower, setIframeDoc, shutdown } from './power.js';
import { initClock } from './clock.js';
import { initDesktopIcons } from './desktop-icons.js';

// Power toggle works on the parent document (index.html)
initPower();

// Everything else needs the iframe to be loaded
window.addEventListener('load', function () {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Pass iframeDoc to power module for login screen control
    setIframeDoc(iframeDoc);

    // Setup login screen click handler
    const loginUser = iframeDoc.getElementById('xp-login-user');
    if (loginUser) {
        loginUser.addEventListener('click', () => {
            const loginScreen = iframeDoc.querySelector('.xp-login');
            if (loginScreen) {
                loginScreen.classList.add('hidden');
                loginScreen.addEventListener('transitionend', () => {
                    loginScreen.style.display = 'none';
                }, { once: true });
            }
        });
    }

    // Setup shutdown button on login screen
    const shutdownBtn = iframeDoc.querySelector('.xp-login-bottom');
    if (shutdownBtn) {
        shutdownBtn.style.cursor = 'pointer';
        shutdownBtn.addEventListener('click', () => shutdown());
    }

    // Sound effects for mouse clicks and keyboard typing
    const clickSound = new Audio('/sounds/mouse-clicking-sound.mp3');
    const typeSound = new Audio('/sounds/keyboard-typing-sound.mp3');
    clickSound.volume = 0.3;
    typeSound.volume = 0.3;

    function playClick() {
        clickSound.currentTime = 0;
        clickSound.play();
    }

    function playType() {
        typeSound.currentTime = 0;
        typeSound.play();
    }

    // Listen on both parent and iframe
    document.addEventListener('click', playClick);
    iframeDoc.addEventListener('click', playClick);
    document.addEventListener('keydown', playType);
    iframeDoc.addEventListener('keydown', playType);

    initClock(iframeDoc);
    initDesktopIcons(iframeDoc);
});
