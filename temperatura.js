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

function convertir(guardarHistorial = true) {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    if (isNaN(cantidad)) {
        document.getElementById("resultado").textContent = "";
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

    const texto = `${resultado.toFixed(2)} ${destino}`;
    document.getElementById("resultado").textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

const cantidadEl = document.getElementById("cantidad");
const origenEl = document.getElementById("origen");
const destinoEl = document.getElementById("destino");

cantidadEl.addEventListener("input", convertir);
origenEl.addEventListener("change", convertir);
destinoEl.addEventListener("change", convertir);
convertir(false);
