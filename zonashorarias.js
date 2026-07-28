const historyManager = window.ConverUnivers.createHistoryManager({
    storageKey: "historialZonas"
});
const favoritesManager = window.ConverUnivers.createFavoritesManager({
    storageKey: "favoritosZonas"
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

    const hora = document.getElementById("cantidad").value;
    const resultadoEl = document.getElementById("resultado");
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    if (!/^\d{2}:\d{2}$/.test(hora)) {
        resultadoEl.textContent = "Introduce una hora válida";
        return;
    }

    const zonas = {
        "UTC": 0,
        "Londres": 0,
        "Madrid": 1,
        "Nueva York": -5,
        "Los Ángeles": -8,
        "Tokio": 9
    };

    let [horas, minutos] = hora.split(":").map(Number);

    let utc = horas - zonas[origen];
    let resultadoHora = utc + zonas[destino];

    while (resultadoHora < 0) {
        resultadoHora += 24;
    }

    while (resultadoHora >= 24) {
        resultadoHora -= 24;
    }

    let textoHora = resultadoHora.toString().padStart(2, "0");
    let textoMinutos = minutos.toString().padStart(2, "0");

    const texto = hora + " (" + origen + ") = " + textoHora + ":" + textoMinutos + " (" + destino + ")";
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