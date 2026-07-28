const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialVolumen"
});

function programarHistorial(texto) {
    historyManager.schedule(texto);
}

function convertir(guardarHistorial = true) {

    const cantidad = Number(document.getElementById("cantidad").value);

    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
    const origen = origenSelect.value;
    const destino = destinoSelect.value;

    if (Number.isNaN(cantidad)) {
        document.getElementById("resultado").textContent = "";
        return;
    }

    let litros;

    if (origen === "litro") litros = cantidad;
    if (origen === "mililitro") litros = cantidad / 1000;
    if (origen === "centimetro-cubico") litros = cantidad / 1000;
    if (origen === "metro-cubico") litros = cantidad * 1000;
    if (origen === "galon-us") litros = cantidad * 3.78541;

    let resultado;

    if (destino === "litro") resultado = litros;
    if (destino === "mililitro") resultado = litros * 1000;
    if (destino === "centimetro-cubico") resultado = litros * 1000;
    if (destino === "metro-cubico") resultado = litros / 1000;
    if (destino === "galon-us") resultado = litros / 3.78541;

    resultado = Number(resultado.toFixed(6));

    const origenEtiqueta = origenSelect.selectedOptions[0]?.textContent || origen;
    const destinoEtiqueta = destinoSelect.selectedOptions[0]?.textContent || destino;
    const texto = `${cantidad} ${origenEtiqueta} = ${resultado} ${destinoEtiqueta}`;
    document.getElementById("resultado").textContent = texto;

    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

convertir(false);