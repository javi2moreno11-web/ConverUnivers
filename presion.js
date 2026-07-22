let historialTimeout;

function programarHistorial(texto) {
    clearTimeout(historialTimeout);
    historialTimeout = setTimeout(() => actualizarHistorial(texto), 400);
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialPresion") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);

    localStorage.setItem("historialPresion", JSON.stringify(historial));

    historialLista.innerHTML = "";

    historial.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historialLista.appendChild(li);
    });

    if (historial.length === 0) {
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    }

    limpiarBtn.onclick = () => {
        localStorage.removeItem("historialPresion");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    };
}

function convertir(guardarHistorial = true) {

    const cantidad = Number(document.getElementById("cantidad").value);

    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    let pascales;

    if (origen === "Bar") pascales = cantidad * 100000;
    if (origen === "Pascal") pascales = cantidad;
    if (origen === "Kilopascal") pascales = cantidad * 1000;
    if (origen === "PSI") pascales = cantidad * 6894.76;
    if (origen === "Atmósfera") pascales = cantidad * 101325;

    let resultado;

    if (destino === "Bar") resultado = pascales / 100000;
    if (destino === "Pascal") resultado = pascales;
    if (destino === "Kilopascal") resultado = pascales / 1000;
    if (destino === "PSI") resultado = pascales / 6894.76;
    if (destino === "Atmósfera") resultado = pascales / 101325;

    resultado = Number(resultado.toFixed(6));

    const texto = `${cantidad} ${origen} = ${resultado} ${destino}`;

    document.getElementById("resultado").textContent = texto;

    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

convertir(false);