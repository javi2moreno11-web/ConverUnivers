const conversoresApi = window.ConverUniversConversores;
const configCriptomonedas = conversoresApi ? conversoresApi.registro.criptomonedas : null;

const todasLasCriptos = configCriptomonedas ? configCriptomonedas.criptos : [];

const infoCriptos = configCriptomonedas ? configCriptomonedas.infoCriptos : {};

const todasLasMonedasFiat = configCriptomonedas ? configCriptomonedas.fiats : [];

const infoMonedasFiat = configCriptomonedas ? configCriptomonedas.infoFiat : {};


function esCripto(valor) {
    return todasLasCriptos.includes(valor);
}

function obtenerCodigo(valor) {
    if (esCripto(valor)) {
        return (infoCriptos[valor] || valor).match(/\(([^)]+)\)/)?.[1] || valor;
    }
    return valor;
}

function crearOptgroup(select, etiqueta, valores, info) {
    const grupo = document.createElement("optgroup");
    grupo.label = etiqueta;

    valores.forEach(valor => {
        const opcion = document.createElement("option");
        opcion.value = valor;
        opcion.textContent = info[valor] || valor;
        grupo.appendChild(opcion);
    });

    select.appendChild(grupo);
}

function cargarOpciones() {

    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");

    [origen, destino].forEach(select => {
        crearOptgroup(select, "Criptomonedas", todasLasCriptos, infoCriptos);
        crearOptgroup(select, "Monedas tradicionales", todasLasMonedasFiat, infoMonedasFiat);
    });

    origen.value = "bitcoin";
    destino.value = "USD";
}

function corregirSeleccion(select, valorSeleccionado, defectoSiCripto, defectoSiFiat) {
    if (esCripto(valorSeleccionado)) {
        if (esCripto(select.value)) {
            select.value = defectoSiCripto;
        }
    } else {
        if (!esCripto(select.value)) {
            select.value = defectoSiFiat;
        }
    }
}

const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialCriptomonedas",
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

function formatearCapitalizacion(numero) {
    if (numero >= 1e12) return `${formatearNumero(numero / 1e12, 2)} billones`;
    if (numero >= 1e9) return `${formatearNumero(numero / 1e9, 2)} mil millones`;
    if (numero >= 1e6) return `${formatearNumero(numero / 1e6, 2)} millones`;
    return formatearNumero(numero, 2);
}

async function convertir(guardarHistorial = true) {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
    const origen = origenSelect.value;
    const destino = destinoSelect.value;
    const resultadoEl = document.getElementById("resultado");

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        if (panelDetalle) {
            panelDetalle.actualizar({});
        }
        return;
    }

    const origenEsCripto = esCripto(origen);
    const destinoEsCripto = esCripto(destino);

    if (origenEsCripto === destinoEsCripto) {
        resultadoEl.textContent = "Selecciona una criptomoneda y una moneda tradicional";
        if (panelDetalle) {
            panelDetalle.actualizar({});
        }
        return;
    }

    const criptoId = origenEsCripto ? origen : destino;
    const monedaFiat = (origenEsCripto ? destino : origen).toLowerCase();

    try {
        const respuesta = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${criptoId}&vs_currencies=${monedaFiat}&include_24hr_change=true&include_market_cap=true`
        );
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la cotización");
        }

        const datos = await respuesta.json();
        const precio = datos[criptoId] ? datos[criptoId][monedaFiat] : undefined;

        if (typeof precio !== "number") {
            throw new Error("No se pudo obtener la cotización");
        }

        const resultado = origenEsCripto
            ? formatearNumero(cantidad * precio, 2)
            : formatearNumero(cantidad / precio, 8);

        const codigoOrigen = obtenerCodigo(origen);
        const codigoDestino = obtenerCodigo(destino);

        const texto = `${formatearNumero(cantidad, 8)} ${codigoOrigen} = ${resultado} ${codigoDestino}`;
        resultadoEl.textContent = texto;
        if (guardarHistorial) {
            programarHistorial(texto);
        }

        if (panelDetalle) {
            const cambio24h = datos[criptoId][`${monedaFiat}_24h_change`];
            const capitalizacion = datos[criptoId][`${monedaFiat}_market_cap`];
            const filas = [
                { etiqueta: `1 ${obtenerCodigo(criptoId)}`, valor: `${formatearNumero(precio, 2)} ${monedaFiat.toUpperCase()}` },
                { etiqueta: `10 ${obtenerCodigo(criptoId)}`, valor: `${formatearNumero(precio * 10, 2)} ${monedaFiat.toUpperCase()}` },
                { etiqueta: `100 ${obtenerCodigo(criptoId)}`, valor: `${formatearNumero(precio * 100, 2)} ${monedaFiat.toUpperCase()}` }
            ];

            if (typeof cambio24h === "number") {
                filas.push({ etiqueta: "Variación 24 h", valor: `${cambio24h >= 0 ? "+" : ""}${formatearNumero(cambio24h, 2)} %` });
            }
            if (typeof capitalizacion === "number" && capitalizacion > 0) {
                filas.push({ etiqueta: "Capitalización de mercado", valor: `${formatearCapitalizacion(capitalizacion)} ${monedaFiat.toUpperCase()}` });
            }

            panelDetalle.actualizar({
                explicacion: `${formatearNumero(cantidad, 8)} ${codigoOrigen} equivalen a ${resultado} ${codigoDestino} según la cotización actual. Las criptomonedas son muy volátiles y este precio puede cambiar en segundos.`,
                formula: origenEsCripto ? "resultado = cantidad × precio" : "resultado = cantidad ÷ precio",
                factor: `1 ${obtenerCodigo(criptoId)} = ${formatearNumero(precio, 2)} ${monedaFiat.toUpperCase()}`,
                filas
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
document.getElementById("origen").addEventListener("change", () => {
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
    corregirSeleccion(destinoSelect, origenSelect.value, "USD", "bitcoin");
    convertir();
});
document.getElementById("destino").addEventListener("change", () => {
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
    corregirSeleccion(origenSelect, destinoSelect.value, "USD", "bitcoin");
    convertir();
});

cargarOpciones();
if (window.ConverUniversConversores) {
    window.ConverUniversConversores.aplicarPrefillURL();
}
convertir(false);
