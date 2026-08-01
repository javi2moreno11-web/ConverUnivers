const monedasPopulares = [
  { codigo: "EUR", nombre: "Euro", bandera: "🇪🇺" },
  { codigo: "USD", nombre: "US Dollar", bandera: "🇺🇸" },
  { codigo: "GBP", nombre: "Pound Sterling", bandera: "🇬🇧" },
  { codigo: "JPY", nombre: "Japanese Yen", bandera: "🇯🇵" },
  { codigo: "CAD", nombre: "Canadian Dollar", bandera: "🇨🇦" },
  { codigo: "AUD", nombre: "Australian Dollar", bandera: "🇦🇺" },
  { codigo: "CHF", nombre: "Swiss Franc", bandera: "🇨🇭" },
  { codigo: "CNY", nombre: "Chinese Yuan", bandera: "🇨🇳" }
];

const conversoresApi = window.ConverUniversConversores;
const configMonedas = conversoresApi ? conversoresApi.registro.monedas : null;

const todasLasMonedas = configMonedas ? configMonedas.codigos : [];

const infoMonedas = configMonedas ? configMonedas.info : {};


function cargarMonedas() {

    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");

    todasLasMonedas.forEach(moneda => {

        const opcionOrigen = document.createElement("option");
        opcionOrigen.value = moneda;
        opcionOrigen.textContent = infoMonedas[moneda] || moneda;

        const opcionDestino = document.createElement("option");
        opcionDestino.value = moneda;
        opcionDestino.textContent = infoMonedas[moneda] || moneda;

        origen.appendChild(opcionOrigen);
        destino.appendChild(opcionDestino);

    });

    origen.value = "EUR";
    destino.value = "USD";
}

const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialMonedas",
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

const panelDetalle = window.ConverUniversDetalle ? window.ConverUniversDetalle.crearPanelDetalle({
    explicacion: document.getElementById("detalle-explicacion"),
    formula: document.getElementById("detalle-formula"),
    factor: document.getElementById("detalle-factor"),
    lista: document.getElementById("detalle-lista")
}) : null;

async function convertir(guardarHistorial = true) {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const resultadoEl = document.getElementById("resultado");

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        if (panelDetalle) {
            panelDetalle.actualizar({});
        }
        return;
    }

    try {
        const respuesta = await fetch(`https://open.er-api.com/v6/latest/${origen}`);
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el tipo de cambio");
        }

        const datos = await respuesta.json();
        const tasa = datos.rates ? datos.rates[destino] : undefined;

        if (typeof tasa !== "number") {
            throw new Error("No hay cotización disponible para esa moneda");
        }

        const resultado = formatearNumero(cantidad * tasa, 2);
        const texto = `${formatearNumero(cantidad, 2)} ${origen} = ${resultado} ${destino}`;
        resultadoEl.textContent = texto;

        if (guardarHistorial) {
            programarHistorial(texto);
        }

        if (panelDetalle) {
            const tasaInversa = 1 / tasa;
            panelDetalle.actualizar({
                explicacion: `${formatearNumero(cantidad, 2)} ${origen} equivalen a ${resultado} ${destino} según el tipo de cambio actual.`,
                formula: "resultado = cantidad × tasa_de_cambio",
                factor: `1 ${origen} = ${formatearNumero(tasa, 4)} ${destino}`,
                filas: [
                    { etiqueta: `1 ${origen}`, valor: `${formatearNumero(tasa, 4)} ${destino}` },
                    { etiqueta: `10 ${origen}`, valor: `${formatearNumero(tasa * 10, 2)} ${destino}` },
                    { etiqueta: `100 ${origen}`, valor: `${formatearNumero(tasa * 100, 2)} ${destino}` },
                    { etiqueta: `1 ${destino}`, valor: `${formatearNumero(tasaInversa, 4)} ${origen}` },
                    { etiqueta: "Última actualización", valor: datos.time_last_update_utc || "No disponible" }
                ]
            });
        }
    } catch (error) {
        resultadoEl.textContent = error.message;
        if (panelDetalle) {
            panelDetalle.actualizar({});
        }
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

cargarMonedas();
if (window.ConverUniversConversores) {
    window.ConverUniversConversores.aplicarPrefillURL();
}
convertir(false);
