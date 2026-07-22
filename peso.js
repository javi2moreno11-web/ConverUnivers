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

    const favoritos = JSON.parse(localStorage.getItem("favoritosPeso") || "[]");
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
    const favoritos = JSON.parse(localStorage.getItem("favoritosPeso") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosPeso", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialPeso") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialPeso", JSON.stringify(historial));

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
        localStorage.removeItem("historialPeso");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    });
}

function convertir(guardarHistorial = true) {

    let cantidad = Number(document.getElementById("cantidad").value);

    let origen = document.getElementById("origen").value;
    let destino = document.getElementById("destino").value;

    let kilos;

    if (origen === "Kilogramos") {
        kilos = cantidad;
    }

    if (origen === "Gramos") {
        kilos = cantidad / 1000;
    }

    if (origen === "Miligramos") {
        kilos = cantidad / 1000000;
    }

    if (origen === "Hectogramos") {
        kilos = cantidad / 10;
    }

    if (origen === "Decagramos") {
        kilos = cantidad / 100;
    }

    if (origen === "Toneladas") {
        kilos = cantidad * 1000;
    }

    if (origen === "Libras") {
        kilos = cantidad * 0.453592;
    }

    if (origen === "Onzas") {
        kilos = cantidad * 0.0283495;
    }

    let resultado;

    if (destino === "Kilogramos") {
        resultado = kilos;
    }

    if (destino === "Gramos") {
        resultado = kilos * 1000;
    }

    if (destino === "Miligramos") {
        resultado = kilos * 1000000;
    }

    if (destino === "Hectogramos") {
        resultado = kilos * 10;
    }

    if (destino === "Decagramos") {
        resultado = kilos * 100;
    }

    if (destino === "Toneladas") {
        resultado = kilos / 1000;
    }

    if (destino === "Libras") {
        resultado = kilos / 0.453592;
    }

    if (destino === "Onzas") {
        resultado = kilos / 0.0283495;
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
document.getElementById("guardar-favorito").addEventListener("click", () => {
    const texto = document.getElementById("resultado").textContent;
    if (texto) {
        guardarFavorito(texto);
    }
});

mostrarFavoritos();
convertir(false);