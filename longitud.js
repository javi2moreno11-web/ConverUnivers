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

    const favoritos = JSON.parse(localStorage.getItem("favoritosLongitud") || "[]");
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
    const favoritos = JSON.parse(localStorage.getItem("favoritosLongitud") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosLongitud", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialLongitud") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialLongitud", JSON.stringify(historial));

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
        localStorage.removeItem("historialLongitud");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    });
}

function convertir(guardarHistorial = true) {

    let cantidad = Number(document.getElementById("cantidad").value);

    let origen = document.getElementById("origen").value;
    let destino = document.getElementById("destino").value;

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