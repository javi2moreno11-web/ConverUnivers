const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialAlmacenamiento",
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

    let bytes;

    if (origen === "Bytes") {
        bytes = cantidad;
    }

    if (origen === "KB") {
        bytes = cantidad * 1024;
    }

    if (origen === "MB") {
        bytes = cantidad * 1024 * 1024;
    }

    if (origen === "GB") {
        bytes = cantidad * 1024 * 1024 * 1024;
    }

    if (origen === "TB") {
        bytes = cantidad * 1024 * 1024 * 1024 * 1024;
    }

    let resultado;

    if (destino === "Bytes") {
        resultado = bytes;
    }

    if (destino === "KB") {
        resultado = bytes / 1024;
    }

    if (destino === "MB") {
        resultado = bytes / (1024 * 1024);
    }

    if (destino === "GB") {
        resultado = bytes / (1024 * 1024 * 1024);
    }

    if (destino === "TB") {
        resultado = bytes / (1024 * 1024 * 1024 * 1024);
    }

    const texto = cantidad + " " + origen + " = " + resultado + " " + destino;
    document.getElementById("resultado").textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);
convertir(false);
