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

let conversionTimeout;
let conversionRequestSeq = 0;
const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialCriptomonedas"
});
const favoritesManager = window.ConverUnivers.createFavoritesManager({
    storageKey: "favoritosCriptomonedas"
});

function programarHistorial(texto) {
    historyManager.schedule(texto);
}

function mostrarFavoritos() {
    favoritesManager.render();
}

function guardarFavorito(texto) {
    favoritesManager.add(texto);
}

async function convertir(guardarHistorial = true) {
    const requestSeq = ++conversionRequestSeq;

    const cantidad = Number(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const resultadoEl = document.getElementById("resultado");

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        return;
    }

    resultadoEl.textContent = "Actualizando cotización...";

    try {
        const datos = await window.ConverUnivers.fetchJson(
            `https://api.coingecko.com/api/v3/simple/price?ids=${origen},${destino}&vs_currencies=usd`,
            { timeoutMs: 9000 }
        );
        if (requestSeq !== conversionRequestSeq) {
            return;
        }
        const precioOrigen = datos?.[origen]?.usd;
        const precioDestino = datos?.[destino]?.usd;

        if (!Number.isFinite(precioOrigen) || !Number.isFinite(precioDestino) || precioDestino === 0) {
            resultadoEl.textContent = "No se pudo obtener la cotización";
            return;
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
        if (requestSeq !== conversionRequestSeq) {
            return;
        }
        resultadoEl.textContent = "No se pudo actualizar la cotización. Inténtalo de nuevo.";
        console.error("Error al convertir criptomonedas:", error);
    }
}

function programarConversion() {
    clearTimeout(conversionTimeout);
    conversionTimeout = setTimeout(() => convertir(), 220);
}

document.getElementById("cantidad").addEventListener("input", programarConversion);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

cargarCriptos();
const guardarFavoritoBtn = document.getElementById("guardar-favorito");
if (guardarFavoritoBtn) {
    guardarFavoritoBtn.addEventListener("click", () => {
        const texto = document.getElementById("resultado").textContent;
        if (texto) {
            guardarFavorito(texto);
        }
    });
}

mostrarFavoritos();
convertir(false);
