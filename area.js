const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialArea"
});
const favoritesManager = window.ConverUnivers.createFavoritesManager({
    storageKey: "favoritosArea"
});

function programarHistorial(texto) {
    historyManager.schedule(texto);
}

function mostrarFavoritos() {
    favoritesManager.render();
}

function guardarFavorito(texto) {
    favoritesManager.add(texto);
}

function convertir(guardarHistorial = true) {

    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const resultadoEl = document.getElementById("resultado");
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        return;
    }

    let metros2;

    if (origen === "Metros cuadrados") {
        metros2 = cantidad;
    }

    if (origen === "Kilómetros cuadrados") {
        metros2 = cantidad * 1000000;
    }

    if (origen === "Centímetros cuadrados") {
        metros2 = cantidad / 10000;
    }

    if (origen === "Hectáreas") {
        metros2 = cantidad * 10000;
    }

    if (origen === "Acres") {
        metros2 = cantidad * 4046.8564224;
    }

    let resultado;

    if (destino === "Metros cuadrados") {
        resultado = metros2;
    }

    if (destino === "Kilómetros cuadrados") {
        resultado = metros2 / 1000000;
    }

    if (destino === "Centímetros cuadrados") {
        resultado = metros2 * 10000;
    }

    if (destino === "Hectáreas") {
        resultado = metros2 / 10000;
    }

    if (destino === "Acres") {
        resultado = metros2 / 4046.8564224;
    }

    const texto = cantidad + " " + origen + " = " + resultado + " " + destino;
    resultadoEl.textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);
const guardarFavoritoBtn = document.getElementById("guardar-favorito");
if (guardarFavoritoBtn) {
    guardarFavoritoBtn.addEventListener("click", () => {
        const texto = document.getElementById("resultado").textContent;
        if (texto) {
            guardarFavorito(texto);
        }
    });
}

mostrarFavoritos();
convertir(false);