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

const formatearNumero = window.ConverUniversFormato
    ? window.ConverUniversFormato.formatearNumero
    : (numero) => String(numero);

const simbolosArea = {
    "Metros cuadrados": "m²",
    "Kilómetros cuadrados": "km²",
    "Centímetros cuadrados": "cm²",
    "Hectáreas": "ha",
    "Acres": "ac"
};

function simbolo(nombre) {
    return simbolosArea[nombre] || nombre;
}

function convertir(guardarHistorial = true) {

    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    let metros2;

    if (origen === "Metros cuadrados") {
        metros2 = cantidad;
    }

    if (origen === "Kilómetros cuadrados") {
        metros2 = cantidad * 1000000;
    }

    if (origen === "Centímetros cuadrados") {
        metros2 = cantidad / 10000;
    }

    if (origen === "Hectáreas") {
        metros2 = cantidad * 10000;
    }

    if (origen === "Acres") {
        metros2 = cantidad * 4046.8564224;
    }

    let resultado;

    if (destino === "Metros cuadrados") {
        resultado = metros2;
    }

    if (destino === "Kilómetros cuadrados") {
        resultado = metros2 / 1000000;
    }

    if (destino === "Centímetros cuadrados") {
        resultado = metros2 * 10000;
    }

    if (destino === "Hectáreas") {
        resultado = metros2 / 10000;
    }

    if (destino === "Acres") {
        resultado = metros2 / 4046.8564224;
    }

    const texto = formatearNumero(cantidad) + " " + simbolo(origen) + " = " + formatearNumero(resultado) + " " + simbolo(destino);
    document.getElementById("resultado").textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);
convertir(false);
