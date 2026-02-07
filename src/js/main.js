import { initPower, setIframeDoc, shutdown, setSkipLogin } from './power.js';
import { initClock } from './clock.js';
import { initDesktopIcons } from './desktop-icons.js';

initPower();

window.shutdownPC = shutdown;
window.setSkipLoginPC = setSkipLogin;

window.addEventListener('load', function () {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    setIframeDoc(iframeDoc);

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

    const shutdownBtn = iframeDoc.querySelector('.xp-login-bottom');
    if (shutdownBtn) {
        shutdownBtn.style.cursor = 'pointer';
        shutdownBtn.addEventListener('click', () => shutdown());
    }

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

    document.addEventListener('click', playClick);
    iframeDoc.addEventListener('click', playClick);
    document.addEventListener('keydown', playType);
    iframeDoc.addEventListener('keydown', playType);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;
                const iframes = node.tagName === 'IFRAME' ? [node] : node.querySelectorAll?.('iframe') || [];
                iframes.forEach(nested => {
                    nested.addEventListener('load', () => {
                        try {
                            const nestedDoc = nested.contentDocument || nested.contentWindow.document;
                            nestedDoc.addEventListener('click', playClick);
                            nestedDoc.addEventListener('keydown', playType);
                        } catch (e) { /* cross-origin iframe, skip */ }
                    });
                });
            }
        }
    });
    observer.observe(iframeDoc.body, { childList: true, subtree: true });

    initClock(iframeDoc);
    initDesktopIcons(iframeDoc);
});
