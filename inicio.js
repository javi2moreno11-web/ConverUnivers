function getNombrePagina(page) {
    const nombres = {
        "longitud.html": "📏 Longitud",
        "peso.html": "⚖️ Peso",
        "temperatura.html": "🌡️ Temperatura",
        "monedas.html": "💰 Monedas",
        "tiempo.html": "⏱️ Tiempo",
        "zonashorarias.html": "🌍 Zonas Horarias",
        "almacenamiento.html": "💾 Almacenamiento",
        "velocidad.html": "🚗 Velocidad",
        "area.html": "📐 Área"
    };
    return nombres[page] || page;
}

function ordenarTarjetasInicio() {
    const tarjetas = Array.from(document.querySelectorAll(".tarjeta-conversor"));
    if (tarjetas.length === 0) return;

    const favoritos = JSON.parse(localStorage.getItem("favoritosConversores") || "[]");
    const contenedor = document.querySelector("main");

    tarjetas.sort((a, b) => {
        const aFav = favoritos.includes(a.querySelector(".boton-estrella").getAttribute("data-page"));
        const bFav = favoritos.includes(b.querySelector(".boton-estrella").getAttribute("data-page"));

        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
    });

    tarjetas.forEach(tarjeta => contenedor.appendChild(tarjeta));
}

function actualizarBotonesEstrella() {
    document.querySelectorAll(".boton-estrella").forEach(btn => {
        const page = btn.getAttribute("data-page");
        const favoritos = JSON.parse(localStorage.getItem("favoritosConversores") || "[]");
        btn.classList.toggle("activo", favoritos.includes(page));
        btn.textContent = favoritos.includes(page) ? "★" : "☆";
    });
}

function alternarFavorito(page) {
    const favoritos = JSON.parse(localStorage.getItem("favoritosConversores") || "[]");
    const existe = favoritos.includes(page);

    if (existe) {
        const nuevos = favoritos.filter(item => item !== page);
        localStorage.setItem("favoritosConversores", JSON.stringify(nuevos));
    } else {
        favoritos.unshift(page);
        localStorage.setItem("favoritosConversores", JSON.stringify(favoritos.slice(0, 9)));
    }

    actualizarBotonesEstrella();
    cargarFavoritosInicio();
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("boton-estrella")) {
        event.preventDefault();
        alternarFavorito(event.target.getAttribute("data-page"));
    }
});

window.addEventListener("load", () => {
    actualizarBotonesEstrella();
    ordenarTarjetasInicio();
});
window.addEventListener("storage", () => {
    actualizarBotonesEstrella();
    ordenarTarjetasInicio();
});
