const monedasPopulares = [
  { codigo: "EUR", nombre: "Euro", bandera: "ðŸ‡ªðŸ‡º" },
  { codigo: "USD", nombre: "US Dollar", bandera: "ðŸ‡ºðŸ‡¸" },
  { codigo: "GBP", nombre: "Pound Sterling", bandera: "ðŸ‡¬ðŸ‡§" },
  { codigo: "JPY", nombre: "Japanese Yen", bandera: "ðŸ‡¯ðŸ‡µ" },
  { codigo: "CAD", nombre: "Canadian Dollar", bandera: "ðŸ‡¨ðŸ‡¦" },
  { codigo: "AUD", nombre: "Australian Dollar", bandera: "ðŸ‡¦ðŸ‡º" },
  { codigo: "CHF", nombre: "Swiss Franc", bandera: "ðŸ‡¨ðŸ‡­" },
  { codigo: "CNY", nombre: "Chinese Yuan", bandera: "ðŸ‡¨ðŸ‡³" }
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
    EUR: "ðŸ‡ªðŸ‡º Euro (EUR)",
    USD: "ðŸ‡ºðŸ‡¸ US Dollar (USD)",
    GBP: "ðŸ‡¬ðŸ‡§ Pound Sterling (GBP)",
    JPY: "ðŸ‡¯ðŸ‡µ Japanese Yen (JPY)",
    CAD: "ðŸ‡¨ðŸ‡¦ Canadian Dollar (CAD)",
    AUD: "ðŸ‡¦ðŸ‡º Australian Dollar (AUD)",
    CHF: "ðŸ‡¨ðŸ‡­ Swiss Franc (CHF)",
    CNY: "ðŸ‡¨ðŸ‡³ Chinese Yuan (CNY)",
    MXN: "ðŸ‡²ðŸ‡½ Mexican Peso (MXN)",
    BRL: "ðŸ‡§ðŸ‡· Brazilian Real (BRL)",
    ARS: "ðŸ‡¦ðŸ‡· Argentine Peso (ARS)",
    CLP: "ðŸ‡¨ðŸ‡± Chilean Peso (CLP)",
    COP: "ðŸ‡¨ðŸ‡´ Colombian Peso (COP)",
    PEN: "ðŸ‡µðŸ‡ª Peruvian Sol (PEN)",
    UYU: "ðŸ‡ºðŸ‡¾ Uruguayan Peso (UYU)",
    PYG: "ðŸ‡µðŸ‡¾ Paraguayan GuaranÃ­ (PYG)",
    BOB: "ðŸ‡§ðŸ‡´ Bolivian Boliviano (BOB)",
    CRC: "ðŸ‡¨ðŸ‡· Costa Rican ColÃ³n (CRC)",
    GTQ: "ðŸ‡¬ðŸ‡¹ Guatemalan Quetzal (GTQ)",
    HNL: "ðŸ‡­ðŸ‡³ Honduran Lempira (HNL)",
    NIO: "ðŸ‡³ðŸ‡® Nicaraguan CÃ³rdoba (NIO)",
    DOP: "ðŸ‡©ðŸ‡´ Dominican Peso (DOP)",
    AED: "ðŸ‡¦ðŸ‡ª UAE Dirham (AED)",
    SAR: "ðŸ‡¸ðŸ‡¦ Saudi Riyal (SAR)",
    TRY: "ðŸ‡¹ðŸ‡· Turkish Lira (TRY)",
    RUB: "ðŸ‡·ðŸ‡º Russian Ruble (RUB)",
    INR: "ðŸ‡®ðŸ‡³ Indian Rupee (INR)",
    KRW: "ðŸ‡°ðŸ‡· South Korean Won (KRW)",
    SGD: "ðŸ‡¸ðŸ‡¬ Singapore Dollar (SGD)",
    HKD: "ðŸ‡­ðŸ‡° Hong Kong Dollar (HKD)",
    NZD: "ðŸ‡³ðŸ‡¿ New Zealand Dollar (NZD)",
    ZAR: "ðŸ‡¿ðŸ‡¦ South African Rand (ZAR)"
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

        const resultado = (cantidad * tasa).toFixed(2);
        const texto = `${cantidad} ${origen} = ${resultado} ${destino}`;
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
