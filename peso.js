const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialPeso",
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

    let cantidad = Number(document.getElementById("cantidad").value);

    let origen = document.getElementById("origen").value;
    let destino = document.getElementById("destino").value;

    let kilos;

    if (origen === "Kilogramos") {
        kilos = cantidad;
    }

    if (origen === "Gramos") {
        kilos = cantidad / 1000;
    }

    if (origen === "Miligramos") {
        kilos = cantidad / 1000000;
    }

    if (origen === "Hectogramos") {
        kilos = cantidad / 10;
    }

    if (origen === "Decagramos") {
        kilos = cantidad / 100;
    }

    if (origen === "Toneladas") {
        kilos = cantidad * 1000;
    }

    if (origen === "Libras") {
        kilos = cantidad * 0.453592;
    }

    if (origen === "Onzas") {
        kilos = cantidad * 0.0283495;
    }

    let resultado;

    if (destino === "Kilogramos") {
        resultado = kilos;
    }

    if (destino === "Gramos") {
        resultado = kilos * 1000;
    }

    if (destino === "Miligramos") {
        resultado = kilos * 1000000;
    }

    if (destino === "Hectogramos") {
        resultado = kilos * 10;
    }

    if (destino === "Decagramos") {
        resultado = kilos * 100;
    }

    if (destino === "Toneladas") {
        resultado = kilos / 1000;
    }

    if (destino === "Libras") {
        resultado = kilos / 0.453592;
    }

    if (destino === "Onzas") {
        resultado = kilos / 0.0283495;
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
