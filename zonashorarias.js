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

function convertir(guardarHistorial = true) {

    const hora = document.getElementById("cantidad").value;
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    const zonas = {
        "UTC": 0,
        "Londres": 0,
        "Madrid": 1,
        "Nueva York": -5,
        "Los Ãngeles": -8,
        "Tokio": 9
    };

    let [horas, minutos] = hora.split(":").map(Number);

    let utc = horas - zonas[origen];
    let resultadoHora = utc + zonas[destino];

    while (resultadoHora < 0) {
        resultadoHora += 24;
    }

    while (resultadoHora >= 24) {
        resultadoHora -= 24;
    }

    let textoHora = resultadoHora.toString().padStart(2, "0");
    let textoMinutos = minutos.toString().padStart(2, "0");

    const texto = hora + " (" + origen + ") = " + textoHora + ":" + textoMinutos + " (" + destino + ")";
    document.getElementById("resultado").textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);
convertir(false);
