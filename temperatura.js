const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialTemperatura",
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

const simbolosTemperatura = {
    "Celsius": "°C",
    "Fahrenheit": "°F",
    "Kelvin": "K"
};

function simbolo(nombre) {
    return simbolosTemperatura[nombre] || nombre;
}

const panelDetalle = window.ConverUniversDetalle ? window.ConverUniversDetalle.crearPanelDetalle({
    explicacion: document.getElementById("detalle-explicacion"),
    formula: document.getElementById("detalle-formula"),
    factor: document.getElementById("detalle-factor"),
    lista: document.getElementById("detalle-lista")
}) : null;

const formulasTemperatura = {
    "Celsius->Fahrenheit": "°F = °C × 9/5 + 32",
    "Fahrenheit->Celsius": "°C = (°F − 32) × 5/9",
    "Celsius->Kelvin": "K = °C + 273.15",
    "Kelvin->Celsius": "°C = K − 273.15",
    "Fahrenheit->Kelvin": "K = (°F − 32) × 5/9 + 273.15",
    "Kelvin->Fahrenheit": "°F = (K − 273.15) × 9/5 + 32"
};

function convertir(guardarHistorial = true) {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    if (isNaN(cantidad)) {
        document.getElementById("resultado").textContent = "";
        if (panelDetalle) {
            panelDetalle.actualizar({});
        }
        return;
    }

    let celsius;

    switch (origen) {
        case "Fahrenheit":
            celsius = (cantidad - 32) * 5 / 9;
            break;
        case "Kelvin":
            celsius = cantidad - 273.15;
            break;
        default:
            celsius = cantidad;
    }

    let resultado;

    switch (destino) {
        case "Fahrenheit":
            resultado = celsius * 9 / 5 + 32;
            break;
        case "Kelvin":
            resultado = celsius + 273.15;
            break;
        default:
            resultado = celsius;
    }

    const texto = `${formatearNumero(cantidad)} ${simbolo(origen)} = ${formatearNumero(resultado, 2)} ${simbolo(destino)}`;
    document.getElementById("resultado").textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }

    if (panelDetalle) {
        const valores = {
            Celsius: celsius,
            Fahrenheit: celsius * 9 / 5 + 32,
            Kelvin: celsius + 273.15
        };

        panelDetalle.actualizar({
            explicacion: `${formatearNumero(cantidad)} ${simbolo(origen)} equivalen a ${formatearNumero(resultado, 2)} ${simbolo(destino)}.`,
            formula: origen === destino
                ? "No hace falta conversión: origen y destino son la misma escala."
                : (formulasTemperatura[`${origen}->${destino}`] || ""),
            factor: "Las escalas de temperatura no comparten un factor multiplicativo fijo porque tienen puntos cero distintos.",
            filas: Object.keys(valores).map((unidad) => ({
                etiqueta: unidad,
                valor: `${formatearNumero(valores[unidad], 2)} ${simbolo(unidad)}`
            }))
        });
    }
}

const cantidadEl = document.getElementById("cantidad");
const origenEl = document.getElementById("origen");
const destinoEl = document.getElementById("destino");

cantidadEl.addEventListener("input", convertir);
origenEl.addEventListener("change", convertir);
destinoEl.addEventListener("change", convertir);
if (window.ConverUniversConversores) {
    window.ConverUniversConversores.aplicarPrefillURL();
}
convertir(false);
