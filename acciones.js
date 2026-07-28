(function () {
    const timers = new Map();

    function readArray(storageKey) {
        return JSON.parse(localStorage.getItem(storageKey) || "[]");
    }

    function writeArray(storageKey, values) {
        localStorage.setItem(storageKey, JSON.stringify(values));
    }

    function renderList({
        listElement,
        items,
        emptyText = "Sin registros aún",
        withCopyButton = false
    }) {
        if (!listElement) {
            return;
        }

        listElement.innerHTML = "";

        if (items.length === 0) {
            listElement.innerHTML = `<li class="historial-vacio">${emptyText}</li>`;
            return;
        }

        items.forEach((item) => {
            const li = document.createElement("li");
            const textSpan = document.createElement("span");
            textSpan.textContent = item;
            li.appendChild(textSpan);

            if (withCopyButton) {
                const copyButton = document.createElement("button");
                copyButton.type = "button";
                copyButton.className = "boton-copiar";
                copyButton.setAttribute("aria-label", "Copiar resultado");
                copyButton.textContent = "📋";
                copyButton.dataset.texto = item;
                li.appendChild(copyButton);
            }

            listElement.appendChild(li);
        });
    }

    function createHistoryManager({
        storageKey,
        listId = "historial-lista",
        clearButtonId = "limpiar-historial",
        maxItems = 5,
        debounceMs = 400
    }) {
        const listElement = document.getElementById(listId);
        const clearButton = document.getElementById(clearButtonId);
        const timerKey = `history:${storageKey}`;

        function render() {
            renderList({
                listElement,
                items: readArray(storageKey),
                emptyText: "Sin registros aún",
                withCopyButton: true
            });
        }

        function add(text) {
            const history = readArray(storageKey);
            history.unshift(text);
            writeArray(storageKey, history.slice(0, maxItems));
            render();
        }

        function schedule(text) {
            clearTimeout(timers.get(timerKey));
            timers.set(timerKey, setTimeout(() => add(text), debounceMs));
        }

        if (clearButton) {
            clearButton.onclick = () => {
                localStorage.removeItem(storageKey);
                render();
            };
        }

        return { render, add, schedule };
    }

    function createFavoritesManager({
        storageKey,
        listId = "favoritos-lista",
        maxItems = 5
    }) {
        const listElement = document.getElementById(listId);

        function render() {
            renderList({
                listElement,
                items: readArray(storageKey),
                emptyText: "No hay favoritos aún"
            });
        }

        function add(text) {
            const favorites = readArray(storageKey);
            if (!favorites.includes(text)) {
                favorites.unshift(text);
                writeArray(storageKey, favorites.slice(0, maxItems));
            }
            render();
        }

        return { render, add };
    }

    function markActiveNavLink() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".main-nav a").forEach((link) => {
            const href = link.getAttribute("href");
            if (href === currentPage) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function injectSkipLink() {
        const main = document.querySelector("main");
        if (!main) {
            return;
        }

        if (!main.id) {
            main.id = "contenido-principal";
        }

        const existingSkipLink = document.querySelector(".skip-link");
        if (existingSkipLink) {
            return;
        }

        const skipLink = document.createElement("a");
        skipLink.className = "skip-link";
        skipLink.href = `#${main.id}`;
        skipLink.textContent = "Saltar al contenido principal";
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    function enhanceMobileNav() {
        const navToggleInput = document.querySelector(".nav-toggle-input");
        const mainNav = document.querySelector(".main-nav");
        if (!navToggleInput || !mainNav) {
            return;
        }

        function syncExpandedState() {
            navToggleInput.setAttribute("aria-expanded", navToggleInput.checked ? "true" : "false");
        }

        syncExpandedState();
        navToggleInput.addEventListener("change", syncExpandedState);

        mainNav.addEventListener("click", (event) => {
            if (!event.target.closest("a")) {
                return;
            }
            navToggleInput.checked = false;
            syncExpandedState();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && navToggleInput.checked) {
                navToggleInput.checked = false;
                syncExpandedState();
            }
        });
    }

    async function fetchJson(url, options) {
        const timeoutMs = options && Number.isFinite(options.timeoutMs) ? options.timeoutMs : 8000;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, {
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            return await response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    window.ConverUnivers = {
        createHistoryManager,
        createFavoritesManager,
        fetchJson
    };

    markActiveNavLink();
    injectSkipLink();
    enhanceMobileNav();
})();

const invertirBtn = document.getElementById("invertir-unidades");

if (invertirBtn) {
    invertirBtn.addEventListener("click", () => {
        const origen = document.getElementById("origen");
        const destino = document.getElementById("destino");
        if (!origen || !destino) return;

        const valorOrigen = origen.value;
        origen.value = destino.value;
        destino.value = valorOrigen;

        if (typeof convertir === "function") {
            convertir();
        } else {
            origen.dispatchEvent(new Event("change"));
        }
    });
}

document.addEventListener("click", async (event) => {
    const boton = event.target.closest(".boton-copiar");
    if (!boton) return;

    const texto = boton.dataset.texto;
    if (!texto) return;

    try {
        await navigator.clipboard.writeText(texto);
        const iconoOriginal = boton.textContent;
        boton.textContent = "✅";
        boton.disabled = true;
        setTimeout(() => {
            boton.textContent = iconoOriginal;
            boton.disabled = false;
        }, 1200);
    } catch (error) {
        window.prompt("Copia el resultado:", texto);
    }
});
