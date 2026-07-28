const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialAlmacenamiento"
});
const favoritesManager = window.ConverUnivers.createFavoritesManager({
    storageKey: "favoritosAlmacenamiento"
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

    let bytes;

    if (origen === "Bytes") {
        bytes = cantidad;
    }

    if (origen === "KB") {
        bytes = cantidad * 1024;
    }

    if (origen === "MB") {
        bytes = cantidad * 1024 * 1024;
    }

    if (origen === "GB") {
        bytes = cantidad * 1024 * 1024 * 1024;
    }

    if (origen === "TB") {
        bytes = cantidad * 1024 * 1024 * 1024 * 1024;
    }

    let resultado;

    if (destino === "Bytes") {
        resultado = bytes;
    }

    if (destino === "KB") {
        resultado = bytes / 1024;
    }

    if (destino === "MB") {
        resultado = bytes / (1024 * 1024);
    }

    if (destino === "GB") {
        resultado = bytes / (1024 * 1024 * 1024);
    }

    if (destino === "TB") {
        resultado = bytes / (1024 * 1024 * 1024 * 1024);
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