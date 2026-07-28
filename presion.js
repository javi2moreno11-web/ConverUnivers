const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialPresion"
});

function programarHistorial(texto) {
    historyManager.schedule(texto);
}

function convertir(guardarHistorial = true) {

    const cantidad = Number(document.getElementById("cantidad").value);
    const resultadoEl = document.getElementById("resultado");

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        return;
    }

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

    resultadoEl.textContent = texto;

    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

convertir(false);