const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialEnergia"
});

function programarHistorial(texto) {
    historyManager.schedule(texto);
}

function convertir(guardarHistorial = true) {

    const cantidad = Number(document.getElementById("cantidad").value);

    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    let julios;

    if (origen === "Julio") julios = cantidad;
    if (origen === "Kilojulio") julios = cantidad * 1000;
    if (origen === "Caloría") julios = cantidad * 4.184;
    if (origen === "Kilocaloría") julios = cantidad * 4184;
    if (origen === "Vatio-hora") julios = cantidad * 3600;

    let resultado;

    if (destino === "Julio") resultado = julios;
    if (destino === "Kilojulio") resultado = julios / 1000;
    if (destino === "Caloría") resultado = julios / 4.184;
    if (destino === "Kilocaloría") resultado = julios / 4184;
    if (destino === "Vatio-hora") resultado = julios / 3600;

    resultado = Number(resultado.toFixed(6));

    const texto = `${cantidad} ${origen} = ${resultado} ${destino}`;

    document.getElementById("resultado").textContent = texto;

    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

convertir(false);