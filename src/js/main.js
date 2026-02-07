import { initPower } from './power.js';
import { initClock } from './clock.js';
import { initDesktopIcons } from './desktop-icons.js';

// Power toggle works on the parent document (index.html)
initPower();

// Everything else needs the iframe to be loaded
window.addEventListener('load', function () {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    initClock(iframeDoc);
    initDesktopIcons(iframeDoc);
});
