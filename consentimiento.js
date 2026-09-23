/*
 * Sistema de consentimiento de cookies para ConverUnivers.
 *
 * Gestiona el banner inicial y el panel de preferencias, y sincroniza la
 * decisión del usuario con Google Consent Mode v2 mediante gtag('consent', ...).
 * El estado por defecto (denegado para usuarios del EEE) se declara en el
 * <head> de cada página, antes de que se cargue este script.
 */
(function () {
    "use strict";

    const STORAGE_KEY = "consentimientoCookies";
    const CONSENT_VERSION = 1;

    // Aseguramos dataLayer/gtag de forma defensiva, por si este script se
    // ejecutara antes de que exista la declaración de Consent Mode del <head>.
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };
    }

    let elementoBanner = null;
    let elementoModal = null;
    let elementoConFocoPrevio = null;

    function leerPreferenciasGuardadas() {
        try {
            const datos = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (datos && datos.version === CONSENT_VERSION && datos.analytics_storage) {
                return datos;
            }
        } catch (error) {
            // Valor corrupto o inexistente: se pedirá consentimiento de nuevo.
        }
        return null;
    }

    function guardarPreferencias(analyticsConcedido, decision) {
        const registro = {
            version: CONSENT_VERSION,
            decision: decision,
            analytics_storage: analyticsConcedido ? "granted" : "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            fecha: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registro));
        return registro;
    }

    function aplicarConsentimiento(registro) {
        window.gtag("consent", "update", {
            ad_storage: registro.ad_storage,
            ad_user_data: registro.ad_user_data,
            ad_personalization: registro.ad_personalization,
            analytics_storage: registro.analytics_storage
        });
    }

    function ocultarBanner() {
        if (elementoBanner) {
            elementoBanner.remove();
            elementoBanner = null;
        }
    }

    function crearBanner() {
        const banner = document.createElement("div");
        banner.id = "banner-cookies";
        banner.className = "banner-cookies";
        banner.setAttribute("role", "region");
        banner.setAttribute("aria-label", "Aviso de cookies");

        banner.innerHTML =
            '<p class="banner-cookies__texto">' +
            "Usamos cookies propias necesarias para el funcionamiento del sitio y, solo si lo aceptas, " +
            "cookies analíticas para entender cómo se usa ConverUnivers. Puedes leer más en nuestra " +
            '<a href="privacidad.html">Política de privacidad</a>.' +
            "</p>" +
            '<div class="banner-cookies__acciones">' +
            '<button type="button" class="banner-cookies__boton banner-cookies__boton--secundario" id="cookies-configurar">Configurar preferencias</button>' +
            '<button type="button" class="banner-cookies__boton banner-cookies__boton--rechazar" id="cookies-rechazar">Rechazar</button>' +
            '<button type="button" class="banner-cookies__boton banner-cookies__boton--aceptar" id="cookies-aceptar">Aceptar</button>' +
            "</div>";

        document.body.appendChild(banner);

        banner.querySelector("#cookies-aceptar").addEventListener("click", function () {
            aplicarConsentimiento(guardarPreferencias(true, "aceptado_todo"));
            ocultarBanner();
        });

        banner.querySelector("#cookies-rechazar").addEventListener("click", function () {
            aplicarConsentimiento(guardarPreferencias(false, "rechazado_todo"));
            ocultarBanner();
        });

        banner.querySelector("#cookies-configurar").addEventListener("click", abrirPreferencias);

        return banner;
    }

    function mostrarBanner() {
        if (!elementoBanner) {
            elementoBanner = crearBanner();
        }
    }

    function escucharTeclaEscape(evento) {
        if (evento.key === "Escape") {
            cerrarModal();
        }
    }

    function cerrarModal() {
        if (elementoModal) {
            elementoModal.remove();
            elementoModal = null;
        }
        document.removeEventListener("keydown", escucharTeclaEscape);
        if (elementoConFocoPrevio) {
            elementoConFocoPrevio.focus();
            elementoConFocoPrevio = null;
        }
    }

    function crearModalPreferencias(preferenciasActuales) {
        const analyticsConcedido = Boolean(preferenciasActuales) && preferenciasActuales.analytics_storage === "granted";

        const fondo = document.createElement("div");
        fondo.id = "modal-cookies";
        fondo.className = "modal-cookies";

        fondo.innerHTML =
            '<div class="modal-cookies__panel" role="dialog" aria-modal="true" aria-labelledby="modal-cookies-titulo">' +
            '<h2 id="modal-cookies-titulo">Preferencias de cookies</h2>' +
            "<p>Elige qué categorías de cookies quieres permitir. Puedes cambiar esta decisión cuando quieras " +
            'desde el enlace "Configurar cookies" del pie de página.</p>' +
            '<div class="modal-cookies__categoria">' +
            '<div class="modal-cookies__categoria-cabecera">' +
            '<label for="cookies-necesarias">Necesarias</label>' +
            '<input type="checkbox" id="cookies-necesarias" checked disabled>' +
            "</div>" +
            "<p>Imprescindibles para que ConverUnivers funcione: preferencia de tema, historial local y " +
            "favoritos. No se pueden desactivar.</p>" +
            "</div>" +
            '<div class="modal-cookies__categoria">' +
            '<div class="modal-cookies__categoria-cabecera">' +
            '<label for="cookies-analiticas">Analíticas</label>' +
            '<input type="checkbox" id="cookies-analiticas"' + (analyticsConcedido ? " checked" : "") + ">" +
            "</div>" +
            "<p>Nos ayudan a entender el uso del sitio (por ejemplo, con Google Analytics). Solo se activan " +
            "si las permites.</p>" +
            "</div>" +
            '<div class="modal-cookies__acciones">' +
            '<button type="button" class="banner-cookies__boton banner-cookies__boton--secundario" id="cookies-cancelar">Cancelar</button>' +
            '<button type="button" class="banner-cookies__boton banner-cookies__boton--aceptar" id="cookies-guardar">Guardar preferencias</button>' +
            "</div>" +
            "</div>";

        document.body.appendChild(fondo);

        fondo.querySelector("#cookies-cancelar").addEventListener("click", cerrarModal);
        fondo.addEventListener("click", function (evento) {
            if (evento.target === fondo) {
                cerrarModal();
            }
        });
        document.addEventListener("keydown", escucharTeclaEscape);

        fondo.querySelector("#cookies-guardar").addEventListener("click", function () {
            const analyticsMarcado = fondo.querySelector("#cookies-analiticas").checked;
            aplicarConsentimiento(guardarPreferencias(analyticsMarcado, "personalizado"));
            cerrarModal();
            ocultarBanner();
        });

        return fondo;
    }

    function abrirPreferencias() {
        if (elementoModal) {
            return;
        }
        elementoConFocoPrevio = document.activeElement;
        elementoModal = crearModalPreferencias(leerPreferenciasGuardadas());
        const botonCancelar = elementoModal.querySelector("#cookies-cancelar");
        if (botonCancelar) {
            botonCancelar.focus();
        }
    }

    function inicializar() {
        const preferenciasGuardadas = leerPreferenciasGuardadas();

        if (preferenciasGuardadas) {
            aplicarConsentimiento(preferenciasGuardadas);
        } else {
            mostrarBanner();
        }

        const botonFooter = document.getElementById("abrir-preferencias-cookies");
        if (botonFooter) {
            botonFooter.addEventListener("click", abrirPreferencias);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializar);
    } else {
        inicializar();
    }
})();
