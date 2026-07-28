const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialVolumen",
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

    let litros;

    if (origen === "Litros") litros = cantidad;
    if (origen === "Mililitros") litros = cantidad / 1000;
    if (origen === "CentÃ­metros cÃºbicos") litros = cantidad / 1000;
    if (origen === "Metros cÃºbicos") litros = cantidad * 1000;
    if (origen === "Galones (US)") litros = cantidad * 3.78541;

    let resultado;

    if (destino === "Litros") resultado = litros;
    if (destino === "Mililitros") resultado = litros * 1000;
    if (destino === "CentÃ­metros cÃºbicos") resultado = litros * 1000;
    if (destino === "Metros cÃºbicos") resultado = litros / 1000;
    if (destino === "Galones (US)") resultado = litros / 3.78541;

    resultado = Number(resultado.toFixed(6));

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
