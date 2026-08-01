const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialZonasHorarias",
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

const conversoresApi = window.ConverUniversConversores;
const zonasHorarias = conversoresApi ? conversoresApi.registro.zonashorarias.zonas : [];

const offsetPorZona = Object.fromEntries(
    zonasHorarias.map((zona) => [zona.value, zona.offset])
);


const zonaPorValor = Object.fromEntries(
    zonasHorarias.map((zona) => [zona.value, zona])
);

function etiquetaZona(zona) {
    return `${zona.city} (${zona.utcLabel})`;
}

function formatearHora(horas, minutos) {
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function formatearDiferencia(diferencia) {
    const signo = diferencia > 0 ? "+" : diferencia < 0 ? "-" : "±";
    const valor = Math.abs(diferencia);
    const unidad = valor === 1 ? "hora" : "horas";

    if (diferencia === 0) {
        return `0 ${unidad}`;
    }

    return `${signo}${valor} ${unidad}`;
}

function obtenerCambioDeDia(horaBase, horaConvertida) {
    if (horaConvertida < 0) {
        return "Día anterior";
    }

    if (horaConvertida >= 24) {
        return "Día siguiente";
    }

    return "Mismo día";
}

function poblarSelector(idSelector, valorInicial) {
    const selector = document.getElementById(idSelector);

    selector.innerHTML = "";

    zonasHorarias.forEach((zona) => {
        const opcion = document.createElement("option");
        opcion.value = zona.value;
        opcion.textContent = etiquetaZona(zona);

        if (zona.value === valorInicial) {
            opcion.selected = true;
        }

        selector.appendChild(opcion);
    });
}

poblarSelector("origen", "UTC+1");
poblarSelector("destino", "UTC+0");

const panelDetalle = window.ConverUniversDetalle ? window.ConverUniversDetalle.crearPanelDetalle({
    explicacion: document.getElementById("detalle-explicacion"),
    formula: document.getElementById("detalle-formula"),
    factor: document.getElementById("detalle-factor"),
    lista: document.getElementById("detalle-lista")
}) : null;

function convertir(guardarHistorial = true) {

    const hora = document.getElementById("cantidad").value;
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    let [horas, minutos] = hora.split(":").map(Number);

    const zonaOrigen = zonaPorValor[origen];
    const zonaDestino = zonaPorValor[destino];
    const diferenciaHoraria = offsetPorZona[destino] - offsetPorZona[origen];

    let utc = horas - offsetPorZona[origen];
    let resultadoHora = utc + offsetPorZona[destino];
    const cambioDeDia = obtenerCambioDeDia(horas, resultadoHora);

    while (resultadoHora < 0) {
        resultadoHora += 24;
    }

    while (resultadoHora >= 24) {
        resultadoHora -= 24;
    }

    const horaOrigen = formatearHora(horas, minutos);
    const horaDestino = formatearHora(resultadoHora, minutos);

    const texto = `${horaOrigen} — ${etiquetaZona(zonaOrigen)} → ${horaDestino} — ${etiquetaZona(zonaDestino)} | ${formatearDiferencia(diferenciaHoraria)} | ${cambioDeDia}`;
    document.getElementById("resultado").innerHTML = `
        <div class="resultado-zona-card">
            <div class="resultado-zona-bloque">
                <p class="resultado-zona-etiqueta">Hora de origen</p>
                <p class="resultado-zona-hora">${horaOrigen}</p>
                <p class="resultado-zona-ciudad">${etiquetaZona(zonaOrigen)}</p>
            </div>

            <p class="resultado-zona-flecha" aria-hidden="true">↓</p>

            <div class="resultado-zona-bloque">
                <p class="resultado-zona-etiqueta">Hora de destino</p>
                <p class="resultado-zona-hora">${horaDestino}</p>
                <p class="resultado-zona-ciudad">${etiquetaZona(zonaDestino)}</p>
            </div>

            <div class="resultado-zona-meta">
                <p><strong>Diferencia horaria:</strong> ${formatearDiferencia(diferenciaHoraria)}</p>
                <p><strong>Día:</strong> ${cambioDeDia}</p>
            </div>
        </div>
    `;
    if (guardarHistorial) {
        programarHistorial(texto);
    }

    if (panelDetalle) {
        panelDetalle.actualizar({
            explicacion: `Cuando en ${etiquetaZona(zonaOrigen)} son las ${horaOrigen}, en ${etiquetaZona(zonaDestino)} son las ${horaDestino} (${cambioDeDia.toLowerCase()}).`,
            formula: "hora_destino = hora_origen + (desfase_destino − desfase_origen)",
            factor: `Desfase entre zonas: ${formatearDiferencia(diferenciaHoraria)} respecto a ${etiquetaZona(zonaOrigen)}`,
            filas: [
                { etiqueta: "Zona de origen", valor: etiquetaZona(zonaOrigen) },
                { etiqueta: "Zona de destino", valor: etiquetaZona(zonaDestino) },
                { etiqueta: "Diferencia horaria", valor: formatearDiferencia(diferenciaHoraria) },
                { etiqueta: "Cambio de día", valor: cambioDeDia }
            ]
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
