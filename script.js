const todasLasMonedas = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "MXN",
  "BRL",
  "ARS",
  "CLP",
  "COP",
  "PEN",
  "UYU",
  "PYG",
  "BOB",
  "CRC",
  "GTQ",
  "HNL",
  "NIO",
  "DOP",
  "AED",
  "SAR",
  "TRY",
  "RUB",
  "INR",
  "KRW",
  "SGD",
  "HKD",
  "NZD",
  "ZAR"
];

const infoMonedas = {
    EUR: "🇪🇺 Euro (EUR)",
    USD: "🇺🇸 US Dollar (USD)",
    GBP: "🇬🇧 Pound Sterling (GBP)",
    JPY: "🇯🇵 Japanese Yen (JPY)",
    CAD: "🇨🇦 Canadian Dollar (CAD)",
    AUD: "🇦🇺 Australian Dollar (AUD)",
    CHF: "🇨🇭 Swiss Franc (CHF)",
    CNY: "🇨🇳 Chinese Yuan (CNY)",
    MXN: "🇲🇽 Mexican Peso (MXN)",
    BRL: "🇧🇷 Brazilian Real (BRL)",
    ARS: "🇦🇷 Argentine Peso (ARS)",
    CLP: "🇨🇱 Chilean Peso (CLP)",
    COP: "🇨🇴 Colombian Peso (COP)",
    PEN: "🇵🇪 Peruvian Sol (PEN)",
    UYU: "🇺🇾 Uruguayan Peso (UYU)",
    PYG: "🇵🇾 Paraguayan Guaraní (PYG)",
    BOB: "🇧🇴 Bolivian Boliviano (BOB)",
    CRC: "🇨🇷 Costa Rican Colón (CRC)",
    GTQ: "🇬🇹 Guatemalan Quetzal (GTQ)",
    HNL: "🇭🇳 Honduran Lempira (HNL)",
    NIO: "🇳🇮 Nicaraguan Córdoba (NIO)",
    DOP: "🇩🇴 Dominican Peso (DOP)",
    AED: "🇦🇪 UAE Dirham (AED)",
    SAR: "🇸🇦 Saudi Riyal (SAR)",
    TRY: "🇹🇷 Turkish Lira (TRY)",
    RUB: "🇷🇺 Russian Ruble (RUB)",
    INR: "🇮🇳 Indian Rupee (INR)",
    KRW: "🇰🇷 South Korean Won (KRW)",
    SGD: "🇸🇬 Singapore Dollar (SGD)",
    HKD: "🇭🇰 Hong Kong Dollar (HKD)",
    NZD: "🇳🇿 New Zealand Dollar (NZD)",
    ZAR: "🇿🇦 South African Rand (ZAR)"
};

function cargarMonedas() {

    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");

    todasLasMonedas.forEach(moneda => {

        const opcionOrigen = document.createElement("option");
        opcionOrigen.value = moneda;
        opcionOrigen.textContent = infoMonedas[moneda] || moneda;

        const opcionDestino = document.createElement("option");
        opcionDestino.value = moneda;
        opcionDestino.textContent = infoMonedas[moneda] || moneda;

        origen.appendChild(opcionOrigen);
        destino.appendChild(opcionDestino);

    });

    origen.value = "EUR";
    destino.value = "USD";
}

let conversionTimeout;
let conversionRequestSeq = 0;
const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialMonedas"
});
const favoritesManager = window.ConverUnivers.createFavoritesManager({
    storageKey: "favoritosMonedas"
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
            `https://open.er-api.com/v6/latest/${origen}`,
            { timeoutMs: 8000 }
        );
        if (requestSeq !== conversionRequestSeq) {
            return;
        }
        const tasa = datos?.rates?.[destino];
        if (!Number.isFinite(tasa)) {
            resultadoEl.textContent = "No se pudo obtener la cotización";
            return;
        }

        const resultado = (cantidad * tasa).toFixed(2);
        const texto = `${cantidad} ${origen} = ${resultado} ${destino}`;
        resultadoEl.textContent = texto;
        if (guardarHistorial) {
            programarHistorial(texto);
        }
    } catch (error) {
        if (requestSeq !== conversionRequestSeq) {
            return;
        }
        resultadoEl.textContent = "No se pudo actualizar la cotización. Inténtalo de nuevo.";
        console.error("Error al convertir monedas:", error);
    }
}

function programarConversion() {
    clearTimeout(conversionTimeout);
    conversionTimeout = setTimeout(() => convertir(), 220);
}

document.getElementById("cantidad").addEventListener("input", programarConversion);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

cargarMonedas();
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