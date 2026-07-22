let historialTimeout;

function programarHistorial(texto) {
    clearTimeout(historialTimeout);
    historialTimeout = setTimeout(() => {
        actualizarHistorial(texto);
    }, 400);
}

function mostrarFavoritos() {
    const favoritosLista = document.getElementById("favoritos-lista");
    if (!favoritosLista) return;

    const favoritos = JSON.parse(localStorage.getItem("favoritosTemperatura") || "[]");
    favoritosLista.innerHTML = "";

    if (favoritos.length === 0) {
        favoritosLista.innerHTML = '<li class="historial-vacio">No hay favoritos aún</li>';
        return;
    }

    favoritos.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        favoritosLista.appendChild(li);
    });
}

function guardarFavorito(texto) {
    const favoritos = JSON.parse(localStorage.getItem("favoritosTemperatura") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosTemperatura", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialTemperatura") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialTemperatura", JSON.stringify(historial));

    historialLista.innerHTML = "";

    if (historial.length === 0) {
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
        return;
    }

    historial.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historialLista.appendChild(li);
    });

    if (!limpiarBtn.dataset.bind) {
        limpiarBtn.dataset.bind = "true";
        limpiarBtn.addEventListener("click", () => {
            localStorage.removeItem("historialTemperatura");
            historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
        });
    }
}

function convertir(guardarHistorial = true) {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    if (isNaN(cantidad)) {
        document.getElementById("resultado").textContent = "";
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
    document.getElementById("resultado").textContent = texto;
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
document.getElementById("guardar-favorito").addEventListener("click", () => {
    const texto = document.getElementById("resultado").textContent;
    if (texto) {
        guardarFavorito(texto);
    }
});

mostrarFavoritos();
convertir(false);
