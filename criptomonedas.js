const criptosPopulares = [
  { id: "bitcoin", codigo: "BTC", nombre: "Bitcoin" },
  { id: "ethereum", codigo: "ETH", nombre: "Ethereum" },
  { id: "binancecoin", codigo: "BNB", nombre: "BNB" },
  { id: "solana", codigo: "SOL", nombre: "Solana" },
  { id: "ripple", codigo: "XRP", nombre: "XRP" }
];

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

function cargarCriptos() {

    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");

    todasLasCriptos.forEach(cripto => {

        const opcionOrigen = document.createElement("option");
        opcionOrigen.value = cripto;
        opcionOrigen.textContent = infoCriptos[cripto] || cripto;

        const opcionDestino = document.createElement("option");
        opcionDestino.value = cripto;
        opcionDestino.textContent = infoCriptos[cripto] || cripto;

        origen.appendChild(opcionOrigen);
        destino.appendChild(opcionDestino);

    });

    origen.value = "bitcoin";
    destino.value = "ethereum";
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

async function convertir(guardarHistorial = true) {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const resultadoEl = document.getElementById("resultado");

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        return;
    }

    try {
        const respuesta = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${origen},${destino}&vs_currencies=usd`
        );
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la cotización");
        }

        const datos = await respuesta.json();
        const precioOrigen = datos[origen] ? datos[origen].usd : undefined;
        const precioDestino = datos[destino] ? datos[destino].usd : undefined;

        if (typeof precioOrigen !== "number" || typeof precioDestino !== "number") {
            throw new Error("No se pudo obtener la cotización");
        }

        const tasa = precioOrigen / precioDestino;
        const resultado = (cantidad * tasa).toFixed(8);

        const codigoOrigen = (infoCriptos[origen] || origen).match(/\(([^)]+)\)/)?.[1] || origen;
        const codigoDestino = (infoCriptos[destino] || destino).match(/\(([^)]+)\)/)?.[1] || destino;

        const texto = `${cantidad} ${codigoOrigen} = ${resultado} ${codigoDestino}`;
        resultadoEl.textContent = texto;
        if (guardarHistorial) {
            programarHistorial(texto);
        }
    } catch (error) {
        resultadoEl.textContent = error.message;
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

cargarCriptos();
convertir(false);
