const monedasPopulares = [
  { codigo: "EUR", nombre: "Euro", bandera: "🇪🇺" },
  { codigo: "USD", nombre: "US Dollar", bandera: "🇺🇸" },
  { codigo: "GBP", nombre: "Pound Sterling", bandera: "🇬🇧" },
  { codigo: "JPY", nombre: "Japanese Yen", bandera: "🇯🇵" },
  { codigo: "CAD", nombre: "Canadian Dollar", bandera: "🇨🇦" },
  { codigo: "AUD", nombre: "Australian Dollar", bandera: "🇦🇺" },
  { codigo: "CHF", nombre: "Swiss Franc", bandera: "🇨🇭" },
  { codigo: "CNY", nombre: "Chinese Yuan", bandera: "🇨🇳" }
];

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

const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialMonedas",
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
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const resultadoEl = document.getElementById("resultado");

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        return;
    }

    try {
        const respuesta = await fetch(`https://open.er-api.com/v6/latest/${origen}`);
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el tipo de cambio");
        }

        const datos = await respuesta.json();
        const tasa = datos.rates ? datos.rates[destino] : undefined;

        if (typeof tasa !== "number") {
            throw new Error("No hay cotización disponible para esa moneda");
        }

        const resultado = formatearNumero(cantidad * tasa, 2);
        const texto = `${formatearNumero(cantidad, 2)} ${origen} = ${resultado} ${destino}`;
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

cargarMonedas();
convertir(false);
