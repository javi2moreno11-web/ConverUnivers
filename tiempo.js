const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialTiempo",
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

const conversoresApi = window.ConverUniversConversores;
const configTiempo = conversoresApi ? conversoresApi.registro.tiempo : null;
const simbolosTiempo = configTiempo ? configTiempo.simbolos : {};

function simbolo(nombre) {
    return simbolosTiempo[nombre] || nombre;
}

const panelDetalle = window.ConverUniversDetalle ? window.ConverUniversDetalle.crearPanelDetalle({
    explicacion: document.getElementById("detalle-explicacion"),
    formula: document.getElementById("detalle-formula"),
    factor: document.getElementById("detalle-factor"),
    lista: document.getElementById("detalle-lista")
}) : null;

function convertir(guardarHistorial = true) {

    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    const factores = configTiempo.factores;
    const resultado = conversoresApi.convertirPorFactor(cantidad, origen, destino, factores);

    const texto = formatearNumero(cantidad) + " " + simbolo(origen) + " = " + formatearNumero(resultado) + " " + simbolo(destino);
    document.getElementById("resultado").textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }

    if (panelDetalle) {
        panelDetalle.actualizar({
            explicacion: conversoresApi.generarExplicacionFactor(cantidad, origen, destino, resultado, configTiempo.nombre, simbolosTiempo, formatearNumero),
            formula: conversoresApi.generarFormulaFactor(origen, destino, factores),
            factor: conversoresApi.generarFactorConversion(origen, destino, factores, simbolosTiempo, formatearNumero),
            filas: conversoresApi.construirEquivalencias(cantidad * factores[origen], factores, simbolosTiempo, formatearNumero)
        });
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);
if (window.ConverUniversConversores) {
    window.ConverUniversConversores.aplicarPrefillURL();
}
convertir(false);
