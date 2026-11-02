(function () {
  "use strict";

  function initChatbot() {
    const toggleBtn = document.getElementById("chatbot-toggle-btn");
    const closeBtn = document.getElementById("chatbot-close-btn");
    const windowChat = document.getElementById("chatbot-window");
    const form = document.getElementById("chatbot-form");
    const input = document.getElementById("chatbot-input");
    const messagesContainer = document.getElementById("chatbot-messages");

    if (!toggleBtn || !windowChat) return;

    // Abrir/Cerrar al hacer clic en el botón flotante
    toggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      windowChat.classList.toggle("hidden");
      if (!windowChat.classList.contains("hidden") && input) {
        input.focus();
      }
    });

    // Cerrar con la X
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        windowChat.classList.add("hidden");
      });
    }

    // Robot vaquero: al hacer clic abre el chat (si está cerrado)
    const cowBot = document.getElementById("cow-bot");
    if (cowBot) {
      cowBot.addEventListener("click", function () {
        if (windowChat.classList.contains("hidden")) {
          toggleBtn.click();
        }
      });
    }

    // Enviar mensajes
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const message = input.value.trim();
        if (!message) return;

        appendMessage(message, "user");
        input.value = "";

        showTyping();
        setTimeout(function () {
          hideTyping();
          const reply = getBotReply(message);
          appendMessage(reply, "bot");
        }, 1000);
      });
    }

    function showTyping() {
      if (!messagesContainer) return;
      const typing = document.createElement("div");
      typing.id = "chatbot-typing";
      typing.className = "flex items-start gap-2 justify-start";
      typing.innerHTML =
        '<div class="typing-dots bg-white dark:bg-[#1a232e] border border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">' +
        "<span></span><span></span><span></span></div>";
      messagesContainer.appendChild(typing);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTyping() {
      const typing = document.getElementById("chatbot-typing");
      if (typing) typing.remove();
    }

    function appendMessage(text, sender) {
      if (!messagesContainer) return;
      const msgDiv = document.createElement("div");
      msgDiv.className = `flex items-start gap-2 ${sender === "user" ? "justify-end" : "justify-start"
        }`;

      const contentDiv = document.createElement("div");
      if (sender === "user") {
        contentDiv.className =
          "bg-[#002B3A] text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm";
      } else {
        contentDiv.className =
          "bg-white dark:bg-[#1a232e] text-gray-800 dark:text-gray-200 p-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-800 max-w-[85%] shadow-sm";
      }

      contentDiv.textContent = text;
      msgDiv.appendChild(contentDiv);
      messagesContainer.appendChild(msgDiv);

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getBotReply(userMsg) {
      const text = userMsg.toLowerCase();

      if (
        text.includes("precio") ||
        text.includes("cotiz") ||
        text.includes("comprar") ||
        text.includes("cuanto")
      ) {
        return "Para cotizaciones al por mayor o catálogo de precios actualizado, te invitamos a dejarnos un mensaje desde la página de Contacto.";
      }
      if (
        text.includes("queso") ||
        text.includes("paria") ||
        text.includes("andino") ||
        text.includes("gouda") ||
        text.includes("producto")
      ) {
        return "Ofrecemos Queso Paria, Queso Andino, Queso Gouda, Mantequilla Artesanal, Yogurt Frutado y Crema de Leche directamente producidos en Samán, Puno.";
      }
      if (
        text.includes("envio") ||
        text.includes("despacho") ||
        text.includes("donde") ||
        text.includes("lugar")
      ) {
        return "Contamos con despacho logístico para Juliaca, Puno, Cusco y Arequipa.";
      }
      if (
        text.includes("hola") ||
        text.includes("buenas") ||
        text.includes("saludos")
      ) {
        return "¡Hola! ¿En qué podemos ayudarte el día de hoy?";
      }

      return "Gracias por tu mensaje. Para recibir atención personalizada con uno de nuestros asesores, por favor contáctanos mediante el formulario de Contacto.";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();