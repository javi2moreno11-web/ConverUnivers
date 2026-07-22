let historialTimeout;

function programarHistorial(texto) {
    clearTimeout(historialTimeout);
    historialTimeout = setTimeout(() => {
        actualizarHistorial(texto);
    }, 400);
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialVolumen") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialVolumen", JSON.stringify(historial));

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
        localStorage.removeItem("historialVolumen");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    });
}

function convertir(guardarHistorial = true) {

    let cantidad = Number(document.getElementById("cantidad").value);

    let origen = document.getElementById("origen").value;
    let destino = document.getElementById("destino").value;

    let litros;

    if (origen === "Litros") litros = cantidad;
    if (origen === "Mililitros") litros = cantidad / 1000;
    if (origen === "Centímetros cúbicos") litros = cantidad / 1000;
    if (origen === "Metros cúbicos") litros = cantidad * 1000;
    if (origen === "Galones (US)") litros = cantidad * 3.78541;

    let resultado;

    if (destino === "Litros") resultado = litros;
    if (destino === "Mililitros") resultado = litros * 1000;
    if (destino === "Centímetros cúbicos") resultado = litros * 1000;
    if (destino === "Metros cúbicos") resultado = litros / 1000;
    if (destino === "Galones (US)") resultado = litros / 3.78541;

    resultado = Number(resultado.toFixed(6));

    const texto = cantidad + " " + origen + " = " + resultado + " " + destino;
    document.getElementById("resultado").textContent = texto;

    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

convertir(false);