const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialPresion",
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

const factoresPresion = {
    "Pascal (Pa)": 1,
    "Kilopascal (kPa)": 1000,
    "Megapascal (MPa)": 1000000,
    "Bar": 100000,
    "Milibar (mbar)": 100,
    "Atmósfera (atm)": 101325,
    "PSI (lb/in²)": 6894.757293168,
    "Torr": 101325 / 760,
    "mmHg (milímetros de mercurio)": 133.322387415,
    "kgf/cm²": 98066.5
};

const simbolosPresion = {
    "Pascal (Pa)": "Pa",
    "Kilopascal (kPa)": "kPa",
    "Megapascal (MPa)": "MPa",
    "Bar": "bar",
    "Milibar (mbar)": "mbar",
    "Atmósfera (atm)": "atm",
    "PSI (lb/in²)": "psi",
    "Torr": "Torr",
    "mmHg (milímetros de mercurio)": "mmHg",
    "kgf/cm²": "kgf/cm²"
};

function simbolo(nombre) {
    return simbolosPresion[nombre] || nombre;
}

function convertir(guardarHistorial = true) {

    const cantidad = Number(document.getElementById("cantidad").value);

    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    const pascales = cantidad * factoresPresion[origen];
    const resultado = pascales / factoresPresion[destino];

    const texto = `${formatearNumero(cantidad)} ${simbolo(origen)} = ${formatearNumero(resultado)} ${simbolo(destino)}`;

    document.getElementById("resultado").textContent = texto;

    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

convertir(false);