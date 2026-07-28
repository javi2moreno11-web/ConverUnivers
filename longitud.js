const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialLongitud",
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

const simbolosLongitud = {
    "Metros": "m",
    "Kilómetros": "km",
    "Centímetros": "cm",
    "Milímetros": "mm",
    "Millas": "mi",
    "Yardas": "yd",
    "Pies": "ft",
    "Pulgadas": "in"
};

function simbolo(nombre) {
    return simbolosLongitud[nombre] || nombre;
}

function convertir(guardarHistorial = true) {

    let cantidad = Number(document.getElementById("cantidad").value);

    let origen = document.getElementById("origen").value;
    let destino = document.getElementById("destino").value;

    let metros;

    if (origen === "Metros") {
        metros = cantidad;
    }

    if (origen === "Kilómetros") {
        metros = cantidad * 1000;
    }

    if (origen === "Centímetros") {
        metros = cantidad / 100;
    }

    if (origen === "Milímetros") {
        metros = cantidad / 1000;
    }

    if (origen === "Millas") {
        metros = cantidad * 1609.344;
    }

    if (origen === "Yardas") {
        metros = cantidad * 0.9144;
    }

    if (origen === "Pies") {
        metros = cantidad * 0.3048;
    }

    if (origen === "Pulgadas") {
        metros = cantidad * 0.0254;
    }
    let resultado;

    if (destino === "Metros") {
        resultado = metros;
    }

    if (destino === "Kilómetros") {
        resultado = metros / 1000;
    }

    if (destino === "Centímetros") {
        resultado = metros * 100;
    }

    if (destino === "Milímetros") {
        resultado = metros * 1000;
    }
     if (destino === "Millas") {
    resultado = metros / 1609.344;
}

if (destino === "Yardas") {
    resultado = metros / 0.9144;
}

if (destino === "Pies") {
    resultado = metros / 0.3048;
}

if (destino === "Pulgadas") {
    resultado = metros / 0.0254;
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
