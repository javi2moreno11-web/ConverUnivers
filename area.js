const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialArea",
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

    let metros2;

    if (origen === "Metros cuadrados") {
        metros2 = cantidad;
    }

    if (origen === "KilÃ³metros cuadrados") {
        metros2 = cantidad * 1000000;
    }

    if (origen === "CentÃ­metros cuadrados") {
        metros2 = cantidad / 10000;
    }

    if (origen === "HectÃ¡reas") {
        metros2 = cantidad * 10000;
    }

    if (origen === "Acres") {
        metros2 = cantidad * 4046.8564224;
    }

    let resultado;

    if (destino === "Metros cuadrados") {
        resultado = metros2;
    }

    if (destino === "KilÃ³metros cuadrados") {
        resultado = metros2 / 1000000;
    }

    if (destino === "CentÃ­metros cuadrados") {
        resultado = metros2 * 10000;
    }

    if (destino === "HectÃ¡reas") {
        resultado = metros2 / 10000;
    }

    if (destino === "Acres") {
        resultado = metros2 / 4046.8564224;
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
