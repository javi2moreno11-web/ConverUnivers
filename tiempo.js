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

    const favoritos = JSON.parse(localStorage.getItem("favoritosTiempo") || "[]");
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
    const favoritos = JSON.parse(localStorage.getItem("favoritosTiempo") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosTiempo", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialTiempo") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialTiempo", JSON.stringify(historial));

    historialLista.innerHTML = "";

    if (historial.length === 0) {
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
        return;
    }

    historial.forEach(item => {
        const li = document.createElement("li");
        const textoSpan = document.createElement("span");
        textoSpan.textContent = item;
        const botonCopiar = document.createElement("button");
        botonCopiar.type = "button";
        botonCopiar.className = "boton-copiar";
        botonCopiar.setAttribute("aria-label", "Copiar resultado");
        botonCopiar.textContent = "📋";
        botonCopiar.dataset.texto = item;
        li.appendChild(textoSpan);
        li.appendChild(botonCopiar);
        historialLista.appendChild(li);
    });

    limpiarBtn.addEventListener("click", () => {
        localStorage.removeItem("historialTiempo");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    });
}

function convertir(guardarHistorial = true) {

    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    let segundos;

    if (origen === "Segundos") {
        segundos = cantidad;
    }

    if (origen === "Minutos") {
        segundos = cantidad * 60;
    }

    if (origen === "Horas") {
        segundos = cantidad * 3600;
    }

    if (origen === "Días") {
        segundos = cantidad * 86400;
    }

    if (origen === "Semanas") {
        segundos = cantidad * 604800;
    }

    if (origen === "Meses") {
        segundos = cantidad * 2592000;
    }

    if (origen === "Años") {
        segundos = cantidad * 31536000;
    }

    let resultado;

    if (destino === "Segundos") {
        resultado = segundos;
    }

    if (destino === "Minutos") {
        resultado = segundos / 60;
    }

    if (destino === "Horas") {
        resultado = segundos / 3600;
    }

    if (destino === "Días") {
        resultado = segundos / 86400;
    }

    if (destino === "Semanas") {
        resultado = segundos / 604800;
    }

    if (destino === "Meses") {
        resultado = segundos / 2592000;
    }

    if (destino === "Años") {
        resultado = segundos / 31536000;
    }

    const texto = cantidad + " " + origen + " = " + resultado + " " + destino;
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