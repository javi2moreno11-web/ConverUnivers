const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialVelocidad",
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

    let ms;

    if (origen === "Metros por segundo") {
        ms = cantidad;
    }

    if (origen === "KilÃ³metros por hora") {
        ms = cantidad / 3.6;
    }

    if (origen === "Millas por hora") {
        ms = cantidad * 0.44704;
    }

    if (origen === "Nudos") {
        ms = cantidad * 0.514444;
    }

    let resultado;

    if (destino === "Metros por segundo") {
        resultado = ms;
    }

    if (destino === "KilÃ³metros por hora") {
        resultado = ms * 3.6;
    }

    if (destino === "Millas por hora") {
        resultado = ms / 0.44704;
    }

    if (destino === "Nudos") {
        resultado = ms / 0.514444;
    }

    const texto = cantidad + " " + origen + " = " + resultado.toFixed(4) + " " + destino;
    document.getElementById("resultado").textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);
convertir(false);
