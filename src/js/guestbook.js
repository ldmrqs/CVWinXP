import { API_URL } from './api-config.js';

let ultimoEnvio = 0;

export function gerarIPFalso() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

export function mostrarFeedback(feedbackEl, mensagem, tipo) {
    if (!feedbackEl) return;
    feedbackEl.textContent = mensagem;
    feedbackEl.style.display = 'block';
    feedbackEl.style.color = tipo === 'error' ? '#ff0000' :
                             tipo === 'success' ? '#008000' :
                             tipo === 'easter' ? '#0054e3' : '#ff8c00';

    setTimeout(() => {
        feedbackEl.style.display = 'none';
    }, 5000);
}

export async function salvarAutografo(iframeDoc) {
    const textarea = iframeDoc.getElementById('livroAutografos');
    const botaoSalvar = iframeDoc.getElementById('botaoSalvar');
    const feedback = iframeDoc.getElementById('feedback');
    const conteudo = textarea.value;

    const divisor = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    const partes = conteudo.split(divisor);
    const mensagem = partes[partes.length - 1].trim();

    if (!mensagem) {
        mostrarFeedback(feedback, '❌ Write something before saving!', 'error');
        return;
    }

    if (mensagem.length < 3) {
        mostrarFeedback(feedback, '❌ Too short, try something else, fren.', 'error');
        return;
    }

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = 'saving...';

    try {
        const response = await fetch(`${API_URL}/guestbook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: mensagem })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            ultimoEnvio = Date.now();
            mostrarFeedback(feedback, 'success!', 'success');

            setTimeout(() => {
                mostrarFeedback(feedback, "thank you for passing by! and don't worry, that's not your real IP address.", 'easter');
            }, 2000);

            if (mensagem.toLowerCase().includes('windows xp')) {
                setTimeout(() => mostrarFeedback(feedback, '🎵 *toca o som de inicialização do XP* 🎵', 'easter'), 4500);
            }
            if (mensagem.toLowerCase().includes('saudade')) {
                setTimeout(() => mostrarFeedback(feedback, 'wish we could turn back time to the good old days...', 'easter'), 4500);
            }

            textarea.value = conteudo.split(divisor)[0] + divisor + '\n\n';

            setTimeout(() => {
                botaoSalvar.disabled = false;
                botaoSalvar.textContent = '💾 save';
            }, 3000);
        } else {
            mostrarFeedback(feedback, data.error || '❌ error! try again, bro', 'error');
            botaoSalvar.disabled = false;
            botaoSalvar.textContent = '💾 save';
        }
    } catch (error) {
        console.error('Error sending message:', error);
        mostrarFeedback(feedback, '❌ error! try again, bro', 'error');
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = '💾 save';
    }
}
