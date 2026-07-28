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

const formatearNumero = window.ConverUniversFormato
    ? window.ConverUniversFormato.formatearNumero
    : (numero) => String(numero);

const simbolosVolumen = {
    "Litro": "L",
    "Mililitro": "mL",
    "Centímetro cúbico": "cm³",
    "Metro cúbico": "m³",
    "Galón (US)": "gal"
};

function simbolo(nombre) {
    return simbolosVolumen[nombre] || nombre;
}

function convertir(guardarHistorial = true) {

    let cantidad = Number(document.getElementById("cantidad").value);

    let origen = document.getElementById("origen").value;
    let destino = document.getElementById("destino").value;

    let litros;

    if (origen === "Litro") litros = cantidad;
    if (origen === "Mililitro") litros = cantidad / 1000;
    if (origen === "Centímetro cúbico") litros = cantidad / 1000;
    if (origen === "Metro cúbico") litros = cantidad * 1000;
    if (origen === "Galón (US)") litros = cantidad * 3.78541;

    let resultado;

    if (destino === "Litro") resultado = litros;
    if (destino === "Mililitro") resultado = litros * 1000;
    if (destino === "Centímetro cúbico") resultado = litros * 1000;
    if (destino === "Metro cúbico") resultado = litros / 1000;
    if (destino === "Galón (US)") resultado = litros / 3.78541;

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
