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

    const favoritos = JSON.parse(localStorage.getItem("favoritosVelocidad") || "[]");
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
    const favoritos = JSON.parse(localStorage.getItem("favoritosVelocidad") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosVelocidad", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialVelocidad") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialVelocidad", JSON.stringify(historial));

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

    limpiarBtn.addEventListener("click", () => {
        localStorage.removeItem("historialVelocidad");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    });
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
document.getElementById("guardar-favorito").addEventListener("click", () => {
    const texto = document.getElementById("resultado").textContent;
    if (texto) {
        guardarFavorito(texto);
    }
});

mostrarFavoritos();
convertir(false);