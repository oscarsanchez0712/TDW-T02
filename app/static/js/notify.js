(() => {
  const FACE_BASE = `
    <ellipse cx="14" cy="42" rx="9" ry="6" fill="#fff" stroke="#1f2933" stroke-width="3" transform="rotate(-20 14 42)"/>
    <ellipse cx="86" cy="42" rx="9" ry="6" fill="#fff" stroke="#1f2933" stroke-width="3" transform="rotate(20 86 42)"/>
    <path d="M30 24 Q26 10 34 6" fill="none" stroke="#d6a84a" stroke-width="5" stroke-linecap="round"/>
    <path d="M70 24 Q74 10 66 6" fill="none" stroke="#d6a84a" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="50" cy="50" rx="32" ry="33" fill="#fff" stroke="#1f2933" stroke-width="3"/>
    <ellipse cx="34" cy="30" rx="10" ry="8" fill="#1f2933"/>
    <ellipse cx="50" cy="74" rx="20" ry="14" fill="#fda4af" stroke="#1f2933" stroke-width="3"/>
    <ellipse cx="43" cy="70" rx="2.5" ry="3.5" fill="#1f2933"/>
    <ellipse cx="57" cy="70" rx="2.5" ry="3.5" fill="#1f2933"/>`;

  const FACES = {
    success: FACE_BASE + `
      <path d="M30 52 q6 -9 12 0" fill="none" stroke="#1f2933" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M58 52 q6 -9 12 0" fill="none" stroke="#1f2933" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="28" cy="60" r="5" fill="#fda4af" opacity=".8"/>
      <circle cx="72" cy="60" r="5" fill="#fda4af" opacity=".8"/>
      <path d="M42 80 q8 7 16 0" fill="none" stroke="#1f2933" stroke-width="3" stroke-linecap="round"/>`,
    error: FACE_BASE + `
      <circle cx="36" cy="52" r="4.5" fill="#1f2933"/>
      <circle cx="64" cy="52" r="4.5" fill="#1f2933"/>
      <circle cx="37.5" cy="50.5" r="1.5" fill="#fff"/>
      <circle cx="65.5" cy="50.5" r="1.5" fill="#fff"/>
      <path d="M28 46 L44 40" stroke="#1f2933" stroke-width="3" stroke-linecap="round"/>
      <path d="M72 46 L56 40" stroke="#1f2933" stroke-width="3" stroke-linecap="round"/>
      <path class="cow-tear" d="M33 58 q-5 8 0 11 q5 -3 0 -11 Z" fill="#60a5fa"/>
      <path d="M42 84 q8 -7 16 0" fill="none" stroke="#1f2933" stroke-width="3" stroke-linecap="round"/>`
  };

  const TEXTS = {
    success: {
      titles: [
        '¡Muuuy bien!',
        '¡Enviado, sin vacilar!',
        '¡Leche, qué éxito!',
        '¡Qué vaca-nazo!',
        '¡Todo en orden, vaquero!'
      ],
      messages: [
        'Tu mensaje llegó más rápido que una vaca al ordeño.',
        'Mensaje recibido. Estamos tan felices que hasta damos leche extra.',
        'Tu mensaje ya está pastando en nuestra bandeja de entrada.',
        'Todo salió leche pura. Te responderemos muy pronto.',
        'Se envió sin una sola pezuña fuera de lugar. ¡Gracias!'
      ]
    },
    error: {
      titles: [
        '¡Ay, vaca-ya!',
        'Esto no es muuuy bueno',
        'Algo huele a establo',
        '¡No hay leche que salga así!',
        'La vaquita está triste'
      ],
      messages: [
        'Tus datos se perdieron en el pastizal. Revísalos e inténtalo otra vez.',
        'Esto no huele a leche fresca. Revisa tu nombre, correo y mensaje.',
        'No pudimos ordeñar esos datos. Corrígelos e inténtalo de nuevo.',
        'La vaquita está triste porque algo no cuadra. ¡Anímala corrigiendo tus datos!',
        'Algo no cuadra, y no queremos que te quedes en el corral. Revisa los campos.'
      ]
    }
  };

  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  function getContainer() {
    let box = document.getElementById('cow-toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'cow-toasts';
      box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    return box;
  }

  window.cowToast = function (type, message, duration = 4500) {
    const kind = type === 'success' ? 'success' : 'error';
    const toast = document.createElement('div');
    toast.className = `cow-toast ${kind}`;
    toast.setAttribute('role', kind === 'error' ? 'alert' : 'status');

    toast.innerHTML = `
      <svg class="cow-toast-face" viewBox="0 0 100 100" aria-hidden="true">${FACES[kind]}</svg>
      <div class="cow-toast-text">
        <p class="cow-toast-title"></p>
        <p class="cow-toast-msg"></p>
      </div>
      <button type="button" class="cow-toast-close" aria-label="Cerrar">&times;</button>
      <div class="cow-toast-bar" style="animation-duration:${duration}ms"></div>`;

    toast.querySelector('.cow-toast-title').textContent = pick(TEXTS[kind].titles);
    toast.querySelector('.cow-toast-msg').textContent = message || pick(TEXTS[kind].messages);

    const close = () => {
      if (toast.classList.contains('out')) return;
      toast.classList.add('out');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };
    toast.querySelector('.cow-toast-close').addEventListener('click', close);
    setTimeout(close, duration);

    getContainer().appendChild(toast);
  };
})();