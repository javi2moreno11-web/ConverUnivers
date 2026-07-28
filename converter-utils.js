(function (global) {
    function readArray(storageKey) {
        try {
            const rawValue = localStorage.getItem(storageKey);
            return rawValue ? JSON.parse(rawValue) : [];
        } catch (error) {
            return [];
        }
    }

    function saveArray(storageKey, value) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(value));
        } catch (error) {
            // Ignore storage failures to preserve the current experience.
        }
    }

    function createHistoryController(options) {
        const {
            storageKey,
            emptyText,
            listElement,
            clearButtonElement,
            maxEntries = 5
        } = options;

        function render() {
            if (!listElement) return;

            const entries = readArray(storageKey);
            listElement.innerHTML = "";

            if (entries.length === 0) {
                listElement.innerHTML = `<li class="historial-vacio">${emptyText}</li>`;
                return;
            }

            const fragment = document.createDocumentFragment();

            entries.forEach((item) => {
                const listItem = document.createElement("li");
                const textSpan = document.createElement("span");
                textSpan.textContent = item;

                const copyButton = document.createElement("button");
                copyButton.type = "button";
                copyButton.className = "boton-copiar";
                copyButton.setAttribute("aria-label", "Copiar resultado");
                copyButton.textContent = "📋";
                copyButton.dataset.texto = item;

                listItem.appendChild(textSpan);
                listItem.appendChild(copyButton);
                fragment.appendChild(listItem);
            });

            listElement.appendChild(fragment);
        }

        function add(text) {
            const entries = readArray(storageKey);
            entries.unshift(text);
            const nextEntries = entries.slice(0, maxEntries);
            saveArray(storageKey, nextEntries);
            render();
            return nextEntries;
        }

        function clear() {
            saveArray(storageKey, []);
            render();
        }

        if (clearButtonElement && !clearButtonElement.dataset.bound) {
            clearButtonElement.dataset.bound = "true";
            clearButtonElement.addEventListener("click", clear);
        }

        render();

        return {
            add,
            clear,
            render
        };
    }

    global.ConverUniversHistory = {
        createHistoryController
    };

    function formatearNumero(numero, maximoDecimales = 10) {
        if (typeof numero !== "number" || !Number.isFinite(numero)) {
            return "—";
        }

        return new Intl.NumberFormat("es-ES", {
            minimumFractionDigits: 0,
            maximumFractionDigits: maximoDecimales,
            useGrouping: false
        }).format(numero);
    }

    global.ConverUniversFormato = {
        formatearNumero
    };
})(window);
