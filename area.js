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

    const favoritos = JSON.parse(localStorage.getItem("favoritosArea") || "[]");
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
    const favoritos = JSON.parse(localStorage.getItem("favoritosArea") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosArea", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialArea") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialArea", JSON.stringify(historial));

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
        localStorage.removeItem("historialArea");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    });
}

function convertir(guardarHistorial = true) {

    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

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