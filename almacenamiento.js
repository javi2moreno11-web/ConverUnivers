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

    const favoritos = JSON.parse(localStorage.getItem("favoritosAlmacenamiento") || "[]");
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
    const favoritos = JSON.parse(localStorage.getItem("favoritosAlmacenamiento") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosAlmacenamiento", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialAlmacenamiento") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialAlmacenamiento", JSON.stringify(historial));

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
        localStorage.removeItem("historialAlmacenamiento");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    });
}

function convertir(guardarHistorial = true) {

    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

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