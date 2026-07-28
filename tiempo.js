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

const simbolosTiempo = {
    "Segundos": "s",
    "Minutos": "min",
    "Horas": "h",
    "Días": "d",
    "Semanas": "sem",
    "Meses": "mes",
    "Años": "año"
};

function simbolo(nombre) {
    return simbolosTiempo[nombre] || nombre;
}

function convertir(guardarHistorial = true) {

    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    let segundos;

    if (origen === "Segundos") {
        segundos = cantidad;
    }

    if (origen === "Minutos") {
        segundos = cantidad * 60;
    }

    if (origen === "Horas") {
        segundos = cantidad * 3600;
    }

    if (origen === "Días") {
        segundos = cantidad * 86400;
    }

    if (origen === "Semanas") {
        segundos = cantidad * 604800;
    }

    if (origen === "Meses") {
        segundos = cantidad * 2592000;
    }

    if (origen === "Años") {
        segundos = cantidad * 31536000;
    }

    let resultado;

    if (destino === "Segundos") {
        resultado = segundos;
    }

    if (destino === "Minutos") {
        resultado = segundos / 60;
    }

    if (destino === "Horas") {
        resultado = segundos / 3600;
    }

    if (destino === "Días") {
        resultado = segundos / 86400;
    }

    if (destino === "Semanas") {
        resultado = segundos / 604800;
    }

    if (destino === "Meses") {
        resultado = segundos / 2592000;
    }

    if (destino === "Años") {
        resultado = segundos / 31536000;
    }

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
