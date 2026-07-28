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

const zonasHorarias = [
    { value: "UTC-12", city: "Baker / Howland", utcLabel: "UTC-12", offset: -12 },
    { value: "UTC-11", city: "Samoa Americana", utcLabel: "UTC-11", offset: -11 },
    { value: "UTC-10", city: "Hawái", utcLabel: "UTC-10", offset: -10 },
    { value: "UTC-9", city: "Alaska", utcLabel: "UTC-9", offset: -9 },
    { value: "UTC-8", city: "Los Ángeles", utcLabel: "UTC-8", offset: -8 },
    { value: "UTC-7", city: "Denver", utcLabel: "UTC-7", offset: -7 },
    { value: "UTC-6", city: "Ciudad de México", utcLabel: "UTC-6", offset: -6 },
    { value: "UTC-5", city: "Nueva York", utcLabel: "UTC-5", offset: -5 },
    { value: "UTC-4", city: "Caracas", utcLabel: "UTC-4", offset: -4 },
    { value: "UTC-3", city: "Buenos Aires", utcLabel: "UTC-3", offset: -3 },
    { value: "UTC-2", city: "Georgia del Sur", utcLabel: "UTC-2", offset: -2 },
    { value: "UTC-1", city: "Azores", utcLabel: "UTC-1", offset: -1 },
    { value: "UTC+0", city: "Londres / UTC", utcLabel: "UTC+0", offset: 0 },
    { value: "UTC+1", city: "Madrid", utcLabel: "UTC+1", offset: 1 },
    { value: "UTC+2", city: "El Cairo", utcLabel: "UTC+2", offset: 2 },
    { value: "UTC+3", city: "Moscú", utcLabel: "UTC+3", offset: 3 },
    { value: "UTC+4", city: "Dubái", utcLabel: "UTC+4", offset: 4 },
    { value: "UTC+5", city: "Karachi", utcLabel: "UTC+5", offset: 5 },
    { value: "UTC+6", city: "Daca", utcLabel: "UTC+6", offset: 6 },
    { value: "UTC+7", city: "Bangkok", utcLabel: "UTC+7", offset: 7 },
    { value: "UTC+8", city: "Pekín", utcLabel: "UTC+8", offset: 8 },
    { value: "UTC+9", city: "Tokio", utcLabel: "UTC+9", offset: 9 },
    { value: "UTC+10", city: "Sídney", utcLabel: "UTC+10", offset: 10 },
    { value: "UTC+11", city: "Numea", utcLabel: "UTC+11", offset: 11 }
];

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
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);
convertir(false);
