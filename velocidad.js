const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialVelocidad"
});
const favoritesManager = window.ConverUnivers.createFavoritesManager({
    storageKey: "favoritosVelocidad"
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
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    let ms;

    if (origen === "Metros por segundo") {
        ms = cantidad;
    }

    if (origen === "Kilómetros por hora") {
        ms = cantidad / 3.6;
    }

    if (origen === "Millas por hora") {
        ms = cantidad * 0.44704;
    }

    if (origen === "Nudos") {
        ms = cantidad * 0.514444;
    }

    let resultado;

    if (destino === "Metros por segundo") {
        resultado = ms;
    }

    if (destino === "Kilómetros por hora") {
        resultado = ms * 3.6;
    }

    if (destino === "Millas por hora") {
        resultado = ms / 0.44704;
    }

    if (destino === "Nudos") {
        resultado = ms / 0.514444;
    }

    const texto = cantidad + " " + origen + " = " + resultado.toFixed(4) + " " + destino;
    document.getElementById("resultado").textContent = texto;
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