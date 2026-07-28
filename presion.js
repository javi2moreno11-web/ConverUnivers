const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialPresion",
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

    const cantidad = Number(document.getElementById("cantidad").value);

    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    let pascales;

    if (origen === "Bar") pascales = cantidad * 100000;
    if (origen === "Pascal") pascales = cantidad;
    if (origen === "Kilopascal") pascales = cantidad * 1000;
    if (origen === "PSI") pascales = cantidad * 6894.76;
    if (origen === "Atmósfera") pascales = cantidad * 101325;

    let resultado;

    if (destino === "Bar") resultado = pascales / 100000;
    if (destino === "Pascal") resultado = pascales;
    if (destino === "Kilopascal") resultado = pascales / 1000;
    if (destino === "PSI") resultado = pascales / 6894.76;
    if (destino === "Atmósfera") resultado = pascales / 101325;

    resultado = Number(resultado.toFixed(6));

    const texto = `${cantidad} ${origen} = ${resultado} ${destino}`;

    document.getElementById("resultado").textContent = texto;

    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

convertir(false);