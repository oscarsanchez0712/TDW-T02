document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const responseDiv = document.getElementById('form-response');

  if (!contactForm) return;

  // Mensajes de validación en ambos idiomas (siguen el botón ES/EN del sitio)
  const MENSAJES = {
    es: {
      nombre: 'Ingresa tu nombre o el de tu empresa (mínimo 3 caracteres, con al menos una letra).',
      correo: 'Ingresa un correo electrónico válido (ejemplo@dominio.com).',
      telefono: 'Ingresa un número de celular peruano válido (9 dígitos, empieza con 9).',
      mensajeMin: 'El mensaje debe tener al menos 10 caracteres.',
      mensajeMax: 'El mensaje no puede superar los 500 caracteres.',
      consentimiento: 'Debes aceptar el uso de tus datos para poder enviar la consulta.',
      enviando: 'Enviando...',
      errorGuardar: 'Error al guardar los datos.',
      conexion: 'El establo está cerrado por un momento. Inténtalo de nuevo en unos minutos.'
    },
    en: {
      nombre: 'Enter your name or company name (at least 3 characters, with at least one letter).',
      correo: 'Enter a valid email address (example@domain.com).',
      telefono: 'Enter a valid Peruvian mobile number (9 digits, starting with 9).',
      mensajeMin: 'The message must be at least 10 characters long.',
      mensajeMax: 'The message cannot exceed 500 characters.',
      consentimiento: 'You must accept the use of your data to send the inquiry.',
      enviando: 'Sending...',
      errorGuardar: 'Error saving your data.',
      conexion: 'The barn is closed for a moment. Please try again in a few minutes.'
    }
  };

  const t = (clave) => {
    const lang = localStorage.getItem('app_lang') === 'en' ? 'en' : 'es';
    return MENSAJES[lang][clave];
  };

  const avisar = (tipo, mensaje) => {
    if (typeof window.cowToast === 'function') {
      window.cowToast(tipo, mensaje);
    } else {
      alert(mensaje || 'Revisa los datos del formulario.');
    }
  };

  // El campo de teléfono solo acepta números (se registra una sola vez)
  const inputTelefono = document.getElementById('telefono');
  if (inputTelefono) {
    inputTelefono.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

  // Si llegas desde "Cotizar" en Inicio, el producto ya viene seleccionado
  const selectProducto = document.getElementById('producto');
  const productoParam = new URLSearchParams(window.location.search).get('producto');
  if (selectProducto && productoParam) {
    const existe = Array.from(selectProducto.options).some((o) => o.value === productoParam);
    if (existe) selectProducto.value = productoParam;
  }

  // Contador de caracteres del mensaje
  const campoMensaje = document.getElementById('mensaje');
  const contador = document.getElementById('mensaje-contador');
  const actualizarContador = () => {
    if (campoMensaje && contador) {
      contador.textContent = `${campoMensaje.value.length} / 500`;
    }
  };
  if (campoMensaje) {
    campoMensaje.addEventListener('input', actualizarContador);
    actualizarContador();
  }

  // El error de un campo desaparece apenas la persona empieza a corregirlo
  contactForm.querySelectorAll('input, textarea').forEach((campo) => {
    const evento = campo.type === 'checkbox' ? 'change' : 'input';
    campo.addEventListener(evento, () => limpiarCampo(campo));
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    limpiarErrores();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const consentimiento = document.getElementById('consentimiento').checked;
    const honeypot = document.getElementById('web') ? document.getElementById('web').value : '';

    let esValido = true;

    // Acepta letras, números y signos de empresa (S.A.C., Agro & Co., etc.)
    const regexNombre = /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ])[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,&'’\-]{3,100}$/;
    if (!regexNombre.test(nombre)) {
      mostrarError('nombre', t('nombre'));
      esValido = false;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      mostrarError('correo', t('correo'));
      esValido = false;
    }

    const telefonoLimpio = telefono.replace(/[\s-]/g, '');
    const regexEstructuraPeru = /^9\d{8}$/;
    const esNumeroRepetido = /^(\d)\1{8}$/.test(telefonoLimpio);
    const secuenciasInvalidas = ['912345678', '987654321', '900000000'];
    const esSecuenciaInvalida = secuenciasInvalidas.includes(telefonoLimpio);
    const tieneDemasiadosCeros = (telefonoLimpio.match(/0/g) || []).length >= 4;

    if (!regexEstructuraPeru.test(telefonoLimpio) || esNumeroRepetido || esSecuenciaInvalida || tieneDemasiadosCeros) {
      mostrarError('telefono', t('telefono'));
      esValido = false;
    }

    if (mensaje.length < 10) {
      mostrarError('mensaje', t('mensajeMin'));
      esValido = false;
    } else if (mensaje.length > 500) {
      mostrarError('mensaje', t('mensajeMax'));
      esValido = false;
    }

    if (!consentimiento) {
      mostrarError('consentimiento', t('consentimiento'));
      esValido = false;
    }

    if (esValido) {
      const producto = document.getElementById('producto').value;
      const comprador = document.getElementById('comprador').value;

      const data = {
        nombre,
        correo,
        telefono: telefonoLimpio,
        producto,
        comprador,
        mensaje,
        consentimiento,
        web: honeypot
      };

      const boton = document.getElementById('btn-enviar');
      const textoOriginal = boton ? boton.innerHTML : '';
      if (boton) {
        boton.disabled = true;          // evita envíos duplicados
        boton.textContent = t('enviando');
      }

      try {
        const response = await fetch('/contacto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          avisar('success');      // vaquita feliz, mensaje al azar
          contactForm.reset();
          actualizarContador();
        } else {
          avisar('error', result.message || t('errorGuardar'));
        }
      } catch (error) {
        console.error('Error de conexión:', error);
        avisar('error', t('conexion'));
      } finally {
        if (boton) {
          boton.disabled = false;
          boton.innerHTML = textoOriginal;
        }
      }
    } else {
      avisar('error');            // vaquita triste, mensaje al azar
      const primerError = contactForm.querySelector('[aria-invalid="true"]');
      if (primerError) primerError.focus();
    }
  });

  function mostrarError(elementId, mensaje) {
    const campo = document.getElementById(elementId);
    campo.classList.add('border-red-500', 'focus:ring-red-500');

    const errorText = document.createElement('p');
    errorText.id = `error-${elementId}`;
    errorText.className = 'error-msg mt-1 text-xs font-medium text-red-500 dark:text-red-400';
    errorText.setAttribute('role', 'alert');
    errorText.innerText = mensaje;

    campo.setAttribute('aria-invalid', 'true');
    campo.setAttribute('aria-describedby', errorText.id);
    campo.parentNode.appendChild(errorText);
  }

  function limpiarCampo(campo) {
    campo.classList.remove('border-red-500', 'focus:ring-red-500');
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
    const error = document.getElementById(`error-${campo.id}`);
    if (error) error.remove();
  }

  function limpiarErrores() {
    document.querySelectorAll('.error-msg').forEach((el) => el.remove());
    document.querySelectorAll('#contact-form input, #contact-form textarea').forEach((campo) => {
      campo.classList.remove('border-red-500', 'focus:ring-red-500');
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
    });
    if (responseDiv) {
      responseDiv.classList.add('hidden');
    }
  }
});
