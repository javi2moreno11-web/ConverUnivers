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

let historialTimeout;

function programarHistorial(texto) {
    clearTimeout(historialTimeout);
    historialTimeout = setTimeout(() => {
        actualizarHistorial(texto);
    }, 400);
}

function mostrarFavoritos() {
    const favoritosLista = document.getElementById("favoritos-lista");
    if (!favoritosLista) return;

    const favoritos = JSON.parse(localStorage.getItem("favoritosCriptomonedas") || "[]");
    favoritosLista.innerHTML = "";

    if (favoritos.length === 0) {
        favoritosLista.innerHTML = '<li class="historial-vacio">No hay favoritos aún</li>';
        return;
    }

    favoritos.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        favoritosLista.appendChild(li);
    });
}

function guardarFavorito(texto) {
    const favoritos = JSON.parse(localStorage.getItem("favoritosCriptomonedas") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosCriptomonedas", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialCriptomonedas") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialCriptomonedas", JSON.stringify(historial));

    historialLista.innerHTML = "";

    if (historial.length === 0) {
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
        return;
    }

    historial.forEach(item => {
        const li = document.createElement("li");
        const textoSpan = document.createElement("span");
        textoSpan.textContent = item;
        const botonCopiar = document.createElement("button");
        botonCopiar.type = "button";
        botonCopiar.className = "boton-copiar";
        botonCopiar.setAttribute("aria-label", "Copiar resultado");
        botonCopiar.textContent = "📋";
        botonCopiar.dataset.texto = item;
        li.appendChild(textoSpan);
        li.appendChild(botonCopiar);
        historialLista.appendChild(li);
    });

    if (!limpiarBtn.dataset.bind) {
        limpiarBtn.dataset.bind = "true";
        limpiarBtn.addEventListener("click", () => {
            localStorage.removeItem("historialCriptomonedas");
            historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
        });
    }
}

async function convertir(guardarHistorial = true) {

    const cantidad = document.getElementById("cantidad").value;
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    const respuesta = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${origen},${destino}&vs_currencies=usd`
    );

    const datos = await respuesta.json();

    const precioOrigen = datos[origen]?.usd;
    const precioDestino = datos[destino]?.usd;

    if (!precioOrigen || !precioDestino) {
        document.getElementById("resultado").innerText = "No se pudo obtener la cotización";
        return;
    }

    const tasa = precioOrigen / precioDestino;
    const resultado = (cantidad * tasa).toFixed(8);

    const codigoOrigen = (infoCriptos[origen] || origen).match(/\(([^)]+)\)/)?.[1] || origen;
    const codigoDestino = (infoCriptos[destino] || destino).match(/\(([^)]+)\)/)?.[1] || destino;

    const texto = `${cantidad} ${codigoOrigen} = ${resultado} ${codigoDestino}`;
    document.getElementById("resultado").innerText = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
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
