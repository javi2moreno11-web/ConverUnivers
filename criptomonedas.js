const todasLasCriptos = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "solana",
  "ripple",
  "cardano",
  "dogecoin",
  "tron",
  "polkadot",
  "litecoin",
  "shiba-inu",
  "avalanche-2",
  "chainlink",
  "uniswap",
  "tether",
  "usd-coin",
  "bitcoin-cash",
  "stellar",
  "monero"
];

const infoCriptos = {
    bitcoin: "₿ Bitcoin (BTC)",
    ethereum: "Ξ Ethereum (ETH)",
    binancecoin: "BNB Chain (BNB)",
    solana: "Solana (SOL)",
    ripple: "XRP (XRP)",
    cardano: "Cardano (ADA)",
    dogecoin: "Dogecoin (DOGE)",
    tron: "TRON (TRX)",
    polkadot: "Polkadot (DOT)",
    litecoin: "Litecoin (LTC)",
    "shiba-inu": "Shiba Inu (SHIB)",
    "avalanche-2": "Avalanche (AVAX)",
    chainlink: "Chainlink (LINK)",
    uniswap: "Uniswap (UNI)",
    tether: "Tether (USDT)",
    "usd-coin": "USD Coin (USDC)",
    "bitcoin-cash": "Bitcoin Cash (BCH)",
    stellar: "Stellar (XLM)",
    monero: "Monero (XMR)"
};

const todasLasMonedasFiat = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "CNY",
  "MXN",
  "BRL",
  "ARS",
  "INR"
];

const infoMonedasFiat = {
    USD: "🇺🇸 US Dollar (USD)",
    EUR: "🇪🇺 Euro (EUR)",
    GBP: "🇬🇧 Pound Sterling (GBP)",
    JPY: "🇯🇵 Japanese Yen (JPY)",
    CHF: "🇨🇭 Swiss Franc (CHF)",
    CAD: "🇨🇦 Canadian Dollar (CAD)",
    AUD: "🇦🇺 Australian Dollar (AUD)",
    CNY: "🇨🇳 Chinese Yuan (CNY)",
    MXN: "🇲🇽 Mexican Peso (MXN)",
    BRL: "🇧🇷 Brazilian Real (BRL)",
    ARS: "🇦🇷 Argentine Peso (ARS)",
    INR: "🇮🇳 Indian Rupee (INR)"
};

function esCripto(valor) {
    return todasLasCriptos.includes(valor);
}

function obtenerCodigo(valor) {
    if (esCripto(valor)) {
        return (infoCriptos[valor] || valor).match(/\(([^)]+)\)/)?.[1] || valor;
    }
    return valor;
}

function crearOptgroup(select, etiqueta, valores, info) {
    const grupo = document.createElement("optgroup");
    grupo.label = etiqueta;

    valores.forEach(valor => {
        const opcion = document.createElement("option");
        opcion.value = valor;
        opcion.textContent = info[valor] || valor;
        grupo.appendChild(opcion);
    });

    select.appendChild(grupo);
}

function cargarOpciones() {

    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");

    [origen, destino].forEach(select => {
        crearOptgroup(select, "Criptomonedas", todasLasCriptos, infoCriptos);
        crearOptgroup(select, "Monedas tradicionales", todasLasMonedasFiat, infoMonedasFiat);
    });

    origen.value = "bitcoin";
    destino.value = "USD";
}

function corregirSeleccion(select, valorSeleccionado, defectoSiCripto, defectoSiFiat) {
    if (esCripto(valorSeleccionado)) {
        if (esCripto(select.value)) {
            select.value = defectoSiCripto;
        }
    } else {
        if (!esCripto(select.value)) {
            select.value = defectoSiFiat;
        }
    }
}

const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialCriptomonedas",
    emptyText: "Sin registros a\u00fan",
    listElement: document.getElementById("historial-lista"),
    clearButtonElement: document.getElementById("limpiar-historial")
}) : null;
let historialTimeout;

function programarHistorial(texto) {
    clearTimeout(historialTimeout);
    historialTimeout = setTimeout(() => {
        if (historial) {
            historial.add(texto);
        }
    }, 400);
}

const formatearNumero = window.ConverUniversFormato
    ? window.ConverUniversFormato.formatearNumero
    : (numero) => String(numero);

async function convertir(guardarHistorial = true) {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
    const origen = origenSelect.value;
    const destino = destinoSelect.value;
    const resultadoEl = document.getElementById("resultado");

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        return;
    }

    const origenEsCripto = esCripto(origen);
    const destinoEsCripto = esCripto(destino);

    if (origenEsCripto === destinoEsCripto) {
        resultadoEl.textContent = "Selecciona una criptomoneda y una moneda tradicional";
        return;
    }

    const criptoId = origenEsCripto ? origen : destino;
    const monedaFiat = (origenEsCripto ? destino : origen).toLowerCase();

    try {
        const respuesta = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${criptoId}&vs_currencies=${monedaFiat}`
        );
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la cotización");
        }

        const datos = await respuesta.json();
        const precio = datos[criptoId] ? datos[criptoId][monedaFiat] : undefined;

        if (typeof precio !== "number") {
            throw new Error("No se pudo obtener la cotización");
        }

        const resultado = origenEsCripto
            ? formatearNumero(cantidad * precio, 2)
            : formatearNumero(cantidad / precio, 8);

        const codigoOrigen = obtenerCodigo(origen);
        const codigoDestino = obtenerCodigo(destino);

        const texto = `${formatearNumero(cantidad, 8)} ${codigoOrigen} = ${resultado} ${codigoDestino}`;
        resultadoEl.textContent = texto;
        if (guardarHistorial) {
            programarHistorial(texto);
        }
    } catch (error) {
        resultadoEl.textContent = error.message;
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", () => {
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
    corregirSeleccion(destinoSelect, origenSelect.value, "USD", "bitcoin");
    convertir();
});
document.getElementById("destino").addEventListener("change", () => {
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
    corregirSeleccion(origenSelect, destinoSelect.value, "USD", "bitcoin");
    convertir();
});

cargarOpciones();
convertir(false);
