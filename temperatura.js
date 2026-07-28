const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialTemperatura"
});
const favoritesManager = window.ConverUnivers.createFavoritesManager({
    storageKey: "favoritosTemperatura"
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

    if (isNaN(cantidad)) {
        resultadoEl.textContent = "Introduce una cantidad válida";
        return;
    }

    let celsius;

    switch (origen) {
        case "Fahrenheit":
            celsius = (cantidad - 32) * 5 / 9;
            break;
        case "Kelvin":
            celsius = cantidad - 273.15;
            break;
        default:
            celsius = cantidad;
    }

    let resultado;

    switch (destino) {
        case "Fahrenheit":
            resultado = celsius * 9 / 5 + 32;
            break;
        case "Kelvin":
            resultado = celsius + 273.15;
            break;
        default:
            resultado = celsius;
    }

    const texto = `${resultado.toFixed(2)} ${destino}`;
    resultadoEl.textContent = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

const cantidadEl = document.getElementById("cantidad");
const origenEl = document.getElementById("origen");
const destinoEl = document.getElementById("destino");

cantidadEl.addEventListener("input", convertir);
origenEl.addEventListener("change", convertir);
destinoEl.addEventListener("change", convertir);
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
