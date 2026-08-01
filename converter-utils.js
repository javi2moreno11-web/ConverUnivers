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

    // ------------------------------------------------------------------
    // Registro central de conversores: una única fuente de verdad para
    // factores, símbolos y listas de unidades. Lo usan tanto los mini
    // conversores rápidos de la portada como las páginas individuales,
    // para no duplicar la lógica de conversión en varios sitios.
    // ------------------------------------------------------------------
    const registroConversores = {
        longitud: {
            pagina: "longitud.html",
            nombre: "Longitud",
            icono: "📏",
            unidadBase: "Metros",
            factores: {
                "Metros": 1,
                "Kilómetros": 1000,
                "Centímetros": 0.01,
                "Milímetros": 0.001,
                "Millas": 1609.344,
                "Yardas": 0.9144,
                "Pies": 0.3048,
                "Pulgadas": 0.0254
            },
            simbolos: {
                "Metros": "m", "Kilómetros": "km", "Centímetros": "cm", "Milímetros": "mm",
                "Millas": "mi", "Yardas": "yd", "Pies": "ft", "Pulgadas": "in"
            },
            origenPorDefecto: "Metros",
            destinoPorDefecto: "Pies"
        },
        peso: {
            pagina: "peso.html",
            nombre: "Peso",
            icono: "⚖️",
            unidadBase: "Kilogramos",
            factores: {
                "Kilogramos": 1, "Gramos": 0.001, "Miligramos": 0.000001,
                "Hectogramos": 0.1, "Decagramos": 0.01, "Toneladas": 1000,
                "Libras": 0.453592, "Onzas": 0.0283495
            },
            simbolos: {
                "Kilogramos": "kg", "Gramos": "g", "Miligramos": "mg", "Hectogramos": "hg",
                "Decagramos": "dag", "Toneladas": "t", "Libras": "lb", "Onzas": "oz"
            },
            origenPorDefecto: "Kilogramos",
            destinoPorDefecto: "Libras"
        },
        tiempo: {
            pagina: "tiempo.html",
            nombre: "Tiempo",
            icono: "⏱️",
            unidadBase: "Segundos",
            factores: {
                "Segundos": 1, "Minutos": 60, "Horas": 3600, "Días": 86400,
                "Semanas": 604800, "Meses": 2592000, "Años": 31536000
            },
            simbolos: {
                "Segundos": "s", "Minutos": "min", "Horas": "h", "Días": "d",
                "Semanas": "sem", "Meses": "mes", "Años": "año"
            },
            origenPorDefecto: "Horas",
            destinoPorDefecto: "Minutos"
        },
        almacenamiento: {
            pagina: "almacenamiento.html",
            nombre: "Almacenamiento",
            icono: "💾",
            unidadBase: "Bytes",
            factores: {
                "Bytes": 1, "KB": 1024, "MB": 1024 * 1024,
                "GB": 1024 * 1024 * 1024, "TB": 1024 * 1024 * 1024 * 1024
            },
            simbolos: { "Bytes": "B", "KB": "KB", "MB": "MB", "GB": "GB", "TB": "TB" },
            origenPorDefecto: "GB",
            destinoPorDefecto: "MB"
        },
        velocidad: {
            pagina: "velocidad.html",
            nombre: "Velocidad",
            icono: "🚗",
            unidadBase: "Metros por segundo",
            factores: {
                "Metros por segundo": 1,
                "Kilómetros por hora": 1 / 3.6,
                "Millas por hora": 0.44704,
                "Nudos": 0.514444
            },
            simbolos: {
                "Metros por segundo": "m/s", "Kilómetros por hora": "km/h",
                "Millas por hora": "mph", "Nudos": "kn"
            },
            origenPorDefecto: "Kilómetros por hora",
            destinoPorDefecto: "Millas por hora"
        },
        area: {
            pagina: "area.html",
            nombre: "Área",
            icono: "📐",
            unidadBase: "Metros cuadrados",
            factores: {
                "Metros cuadrados": 1, "Kilómetros cuadrados": 1000000,
                "Centímetros cuadrados": 0.0001, "Hectáreas": 10000, "Acres": 4046.8564224
            },
            simbolos: {
                "Metros cuadrados": "m²", "Kilómetros cuadrados": "km²",
                "Centímetros cuadrados": "cm²", "Hectáreas": "ha", "Acres": "ac"
            },
            origenPorDefecto: "Metros cuadrados",
            destinoPorDefecto: "Hectáreas"
        },
        volumen: {
            pagina: "volumen.html",
            nombre: "Volumen",
            icono: "🧪",
            unidadBase: "Litro",
            factores: {
                "Litro": 1, "Mililitro": 0.001, "Centímetro cúbico": 0.001,
                "Metro cúbico": 1000, "Galón (US)": 3.78541
            },
            simbolos: {
                "Litro": "L", "Mililitro": "mL", "Centímetro cúbico": "cm³",
                "Metro cúbico": "m³", "Galón (US)": "gal"
            },
            origenPorDefecto: "Litro",
            destinoPorDefecto: "Mililitro"
        },
        presion: {
            pagina: "presion.html",
            nombre: "Presión",
            icono: "🎈",
            unidadBase: "Pascal (Pa)",
            factores: {
                "Pascal (Pa)": 1, "Kilopascal (kPa)": 1000, "Megapascal (MPa)": 1000000,
                "Bar": 100000, "Milibar (mbar)": 100, "Atmósfera (atm)": 101325,
                "PSI (lb/in²)": 6894.757293168, "Torr": 101325 / 760,
                "mmHg (milímetros de mercurio)": 133.322387415, "kgf/cm²": 98066.5
            },
            simbolos: {
                "Pascal (Pa)": "Pa", "Kilopascal (kPa)": "kPa", "Megapascal (MPa)": "MPa",
                "Bar": "bar", "Milibar (mbar)": "mbar", "Atmósfera (atm)": "atm",
                "PSI (lb/in²)": "psi", "Torr": "Torr",
                "mmHg (milímetros de mercurio)": "mmHg", "kgf/cm²": "kgf/cm²"
            },
            origenPorDefecto: "Bar",
            destinoPorDefecto: "Atmósfera (atm)"
        },
        energia: {
            pagina: "energia.html",
            nombre: "Energía",
            icono: "⚡",
            unidadBase: "Julio",
            factores: {
                "Julio": 1, "Kilojulio": 1000, "Caloría": 4.184,
                "Kilocaloría": 4184, "Vatio-hora": 3600
            },
            simbolos: {
                "Julio": "J", "Kilojulio": "kJ", "Caloría": "cal",
                "Kilocaloría": "kcal", "Vatio-hora": "Wh"
            },
            origenPorDefecto: "Kilojulio",
            destinoPorDefecto: "Kilocaloría"
        },
        temperatura: {
            pagina: "temperatura.html",
            nombre: "Temperatura",
            icono: "🌡️",
            unidades: ["Celsius", "Fahrenheit", "Kelvin"],
            simbolos: { "Celsius": "°C", "Fahrenheit": "°F", "Kelvin": "K" },
            origenPorDefecto: "Celsius",
            destinoPorDefecto: "Fahrenheit"
        },
        zonashorarias: {
            pagina: "zonashorarias.html",
            nombre: "Zonas horarias",
            icono: "🌍",
            zonas: [
                { value: "UTC-12", city: "Baker / Howland", utcLabel: "UTC-12", offset: -12 },
                { value: "UTC-11", city: "Samoa Americana", utcLabel: "UTC-11", offset: -11 },
                { value: "UTC-10", city: "Hawái", utcLabel: "UTC-10", offset: -10 },
                { value: "UTC-9", city: "Alaska", utcLabel: "UTC-9", offset: -9 },
                { value: "UTC-8", city: "Los Ángeles", utcLabel: "UTC-8", offset: -8 },
                { value: "UTC-7", city: "Denver", utcLabel: "UTC-7", offset: -7 },
                { value: "UTC-6", city: "Ciudad de México", utcLabel: "UTC-6", offset: -6 },
                { value: "UTC-5", city: "Nueva York", utcLabel: "UTC-5", offset: -5 },
                { value: "UTC-4", city: "Caracas", utcLabel: "UTC-4", offset: -4 },
                { value: "UTC-3", city: "Buenos Aires", utcLabel: "UTC-3", offset: -3 },
                { value: "UTC-2", city: "Georgia del Sur", utcLabel: "UTC-2", offset: -2 },
                { value: "UTC-1", city: "Azores", utcLabel: "UTC-1", offset: -1 },
                { value: "UTC+0", city: "Londres / UTC", utcLabel: "UTC+0", offset: 0 },
                { value: "UTC+1", city: "Madrid", utcLabel: "UTC+1", offset: 1 },
                { value: "UTC+2", city: "El Cairo", utcLabel: "UTC+2", offset: 2 },
                { value: "UTC+3", city: "Moscú", utcLabel: "UTC+3", offset: 3 },
                { value: "UTC+4", city: "Dubái", utcLabel: "UTC+4", offset: 4 },
                { value: "UTC+5", city: "Karachi", utcLabel: "UTC+5", offset: 5 },
                { value: "UTC+6", city: "Daca", utcLabel: "UTC+6", offset: 6 },
                { value: "UTC+7", city: "Bangkok", utcLabel: "UTC+7", offset: 7 },
                { value: "UTC+8", city: "Pekín", utcLabel: "UTC+8", offset: 8 },
                { value: "UTC+9", city: "Tokio", utcLabel: "UTC+9", offset: 9 },
                { value: "UTC+10", city: "Sídney", utcLabel: "UTC+10", offset: 10 },
                { value: "UTC+11", city: "Numea", utcLabel: "UTC+11", offset: 11 }
            ],
            origenPorDefecto: "UTC+1",
            destinoPorDefecto: "UTC+0"
        },
        monedas: {
            pagina: "monedas.html",
            nombre: "Monedas",
            icono: "💰",
            codigos: [
                "EUR", "USD", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "MXN", "BRL",
                "ARS", "CLP", "COP", "PEN", "UYU", "PYG", "BOB", "CRC", "GTQ", "HNL",
                "NIO", "DOP", "AED", "SAR", "TRY", "RUB", "INR", "KRW", "SGD", "HKD",
                "NZD", "ZAR"
            ],
            info: {
                EUR: "🇪🇺 Euro (EUR)", USD: "🇺🇸 US Dollar (USD)", GBP: "🇬🇧 Pound Sterling (GBP)",
                JPY: "🇯🇵 Japanese Yen (JPY)", CAD: "🇨🇦 Canadian Dollar (CAD)", AUD: "🇦🇺 Australian Dollar (AUD)",
                CHF: "🇨🇭 Swiss Franc (CHF)", CNY: "🇨🇳 Chinese Yuan (CNY)", MXN: "🇲🇽 Mexican Peso (MXN)",
                BRL: "🇧🇷 Brazilian Real (BRL)", ARS: "🇦🇷 Argentine Peso (ARS)", CLP: "🇨🇱 Chilean Peso (CLP)",
                COP: "🇨🇴 Colombian Peso (COP)", PEN: "🇵🇪 Peruvian Sol (PEN)", UYU: "🇺🇾 Uruguayan Peso (UYU)",
                PYG: "🇵🇾 Paraguayan Guaraní (PYG)", BOB: "🇧🇴 Bolivian Boliviano (BOB)", CRC: "🇨🇷 Costa Rican Colón (CRC)",
                GTQ: "🇬🇹 Guatemalan Quetzal (GTQ)", HNL: "🇭🇳 Honduran Lempira (HNL)", NIO: "🇳🇮 Nicaraguan Córdoba (NIO)",
                DOP: "🇩🇴 Dominican Peso (DOP)", AED: "🇦🇪 UAE Dirham (AED)", SAR: "🇸🇦 Saudi Riyal (SAR)",
                TRY: "🇹🇷 Turkish Lira (TRY)", RUB: "🇷🇺 Russian Ruble (RUB)", INR: "🇮🇳 Indian Rupee (INR)",
                KRW: "🇰🇷 South Korean Won (KRW)", SGD: "🇸🇬 Singapore Dollar (SGD)", HKD: "🇭🇰 Hong Kong Dollar (HKD)",
                NZD: "🇳🇿 New Zealand Dollar (NZD)", ZAR: "🇿🇦 South African Rand (ZAR)"
            },
            origenPorDefecto: "EUR",
            destinoPorDefecto: "USD"
        },
        criptomonedas: {
            pagina: "criptomonedas.html",
            nombre: "Criptomonedas",
            icono: "₿",
            criptos: [
                "bitcoin", "ethereum", "binancecoin", "solana", "ripple", "cardano",
                "dogecoin", "tron", "polkadot", "litecoin", "shiba-inu", "avalanche-2",
                "chainlink", "uniswap", "tether", "usd-coin", "bitcoin-cash", "stellar", "monero"
            ],
            infoCriptos: {
                bitcoin: "₿ Bitcoin (BTC)", ethereum: "Ξ Ethereum (ETH)", binancecoin: "BNB Chain (BNB)",
                solana: "Solana (SOL)", ripple: "XRP (XRP)", cardano: "Cardano (ADA)",
                dogecoin: "Dogecoin (DOGE)", tron: "TRON (TRX)", polkadot: "Polkadot (DOT)",
                litecoin: "Litecoin (LTC)", "shiba-inu": "Shiba Inu (SHIB)", "avalanche-2": "Avalanche (AVAX)",
                chainlink: "Chainlink (LINK)", uniswap: "Uniswap (UNI)", tether: "Tether (USDT)",
                "usd-coin": "USD Coin (USDC)", "bitcoin-cash": "Bitcoin Cash (BCH)",
                stellar: "Stellar (XLM)", monero: "Monero (XMR)"
            },
            fiats: ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "MXN", "BRL", "ARS", "INR"],
            infoFiat: {
                USD: "🇺🇸 US Dollar (USD)", EUR: "🇪🇺 Euro (EUR)", GBP: "🇬🇧 Pound Sterling (GBP)",
                JPY: "🇯🇵 Japanese Yen (JPY)", CHF: "🇨🇭 Swiss Franc (CHF)", CAD: "🇨🇦 Canadian Dollar (CAD)",
                AUD: "🇦🇺 Australian Dollar (AUD)", CNY: "🇨🇳 Chinese Yuan (CNY)", MXN: "🇲🇽 Mexican Peso (MXN)",
                BRL: "🇧🇷 Brazilian Real (BRL)", ARS: "🇦🇷 Argentine Peso (ARS)", INR: "🇮🇳 Indian Rupee (INR)"
            },
            origenPorDefecto: "bitcoin",
            destinoPorDefecto: "USD"
        }
    };

    function convertirPorFactor(cantidad, origen, destino, factores) {
        return (cantidad * factores[origen]) / factores[destino];
    }

    function convertirTemperaturaValor(cantidad, origen, destino) {
        let celsius;
        switch (origen) {
            case "Fahrenheit": celsius = (cantidad - 32) * 5 / 9; break;
            case "Kelvin": celsius = cantidad - 273.15; break;
            default: celsius = cantidad;
        }

        switch (destino) {
            case "Fahrenheit": return celsius * 9 / 5 + 32;
            case "Kelvin": return celsius + 273.15;
            default: return celsius;
        }
    }

    async function obtenerTasasMoneda(origen) {
        const respuesta = await fetch(`https://open.er-api.com/v6/latest/${origen}`);
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el tipo de cambio");
        }
        return respuesta.json();
    }

    async function obtenerPrecioCripto(criptoId, monedaFiat, parametrosExtra = "") {
        const respuesta = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${criptoId}&vs_currencies=${monedaFiat}${parametrosExtra}`
        );
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la cotización");
        }
        return respuesta.json();
    }

    // Genera la fila de equivalencias (cantidad expresada en todas las
    // unidades de un mismo conversor de factores), útil para las vistas
    // detalladas de cada página individual.
    function construirEquivalencias(cantidadBase, factores, simbolos, formatearNumeroFn) {
        return Object.keys(factores).map((unidad) => ({
            etiqueta: unidad,
            valor: `${formatearNumeroFn(cantidadBase / factores[unidad])} ${simbolos[unidad] || ""}`.trim()
        }));
    }

    function generarExplicacionFactor(cantidad, origen, destino, resultado, nombre, simbolos, formatearNumeroFn) {
        const simboloOrigen = simbolos[origen] || origen;
        const simboloDestino = simbolos[destino] || destino;
        return `${formatearNumeroFn(cantidad)} ${simboloOrigen} de ${nombre.toLowerCase()} equivalen a ${formatearNumeroFn(resultado)} ${simboloDestino}.`;
    }

    function generarFormulaFactor(origen, destino, factores) {
        const factorOrigen = factores[origen];
        const factorDestino = factores[destino];
        return `resultado = cantidad × (${factorOrigen} ÷ ${factorDestino})`;
    }

    function generarFactorConversion(origen, destino, factores, simbolos, formatearNumeroFn) {
        const factor = factores[origen] / factores[destino];
        const simboloOrigen = simbolos[origen] || origen;
        const simboloDestino = simbolos[destino] || destino;
        return `1 ${simboloOrigen} = ${formatearNumeroFn(factor, 8)} ${simboloDestino}`;
    }

    // Permite precargar una página individual con los valores usados en el
    // mini conversor de la portada (a través de parámetros en la URL:
    // ?cantidad=...&origen=...&destino=...), evitando que el usuario tenga
    // que repetir la conversión al abrir el conversor completo.
    function aplicarPrefillURL(idsCampos) {
        const { cantidad: idCantidad = "cantidad", origen: idOrigen = "origen", destino: idDestino = "destino" } = idsCampos || {};
        const parametros = new URLSearchParams(window.location.search);
        const cantidad = parametros.get("cantidad");
        const origen = parametros.get("origen");
        const destino = parametros.get("destino");

        const cantidadEl = document.getElementById(idCantidad);
        const origenEl = document.getElementById(idOrigen);
        const destinoEl = document.getElementById(idDestino);

        if (cantidad !== null && cantidadEl) {
            cantidadEl.value = cantidad;
        }
        if (origen !== null && origenEl && Array.from(origenEl.options).some((opcion) => opcion.value === origen)) {
            origenEl.value = origen;
        }
        if (destino !== null && destinoEl && Array.from(destinoEl.options).some((opcion) => opcion.value === destino)) {
            destinoEl.value = destino;
        }
    }

    global.ConverUniversConversores = {
        registro: registroConversores,
        convertirPorFactor,
        convertirTemperaturaValor,
        obtenerTasasMoneda,
        obtenerPrecioCripto,
        construirEquivalencias,
        generarExplicacionFactor,
        generarFormulaFactor,
        generarFactorConversion,
        aplicarPrefillURL
    };

    // ------------------------------------------------------------------
    // Panel de "conversión detallada": rellena de forma genérica los
    // campos de explicación, fórmula, factor y tabla de equivalencias
    // que aparecen en cada página individual (siempre visible, ya que
    // la vista rápida ahora vive en la portada).
    // ------------------------------------------------------------------
    function crearPanelDetalle(elementos) {
        const { explicacion, formula, factor, lista } = elementos || {};

        function actualizar(datos = {}) {
            if (explicacion) explicacion.textContent = datos.explicacion || "";
            if (formula) formula.textContent = datos.formula || "";
            if (factor) factor.textContent = datos.factor || "";

            if (lista) {
                lista.innerHTML = "";
                (datos.filas || []).forEach((fila) => {
                    const dt = document.createElement("dt");
                    dt.textContent = fila.etiqueta;
                    const dd = document.createElement("dd");
                    dd.textContent = fila.valor;
                    lista.appendChild(dt);
                    lista.appendChild(dd);
                });
            }
        }

        return { actualizar };
    }

    global.ConverUniversDetalle = {
        crearPanelDetalle
    };
})(window);
