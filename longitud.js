const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialLongitud"
});
const favoritesManager = window.ConverUnivers.createFavoritesManager({
    storageKey: "favoritosLongitud"
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

    const cantidad = Number(document.getElementById("cantidad").value);
    const resultadoEl = document.getElementById("resultado");

    if (Number.isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        return;
    }

    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

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