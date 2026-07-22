const monedasPopulares = [
  { codigo: "EUR", nombre: "Euro", bandera: "🇪🇺" },
  { codigo: "USD", nombre: "US Dollar", bandera: "🇺🇸" },
  { codigo: "GBP", nombre: "Pound Sterling", bandera: "🇬🇧" },
  { codigo: "JPY", nombre: "Japanese Yen", bandera: "🇯🇵" },
  { codigo: "CAD", nombre: "Canadian Dollar", bandera: "🇨🇦" },
  { codigo: "AUD", nombre: "Australian Dollar", bandera: "🇦🇺" },
  { codigo: "CHF", nombre: "Swiss Franc", bandera: "🇨🇭" },
  { codigo: "CNY", nombre: "Chinese Yuan", bandera: "🇨🇳" }
];

const todasLasMonedas = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "MXN",
  "BRL",
  "ARS",
  "CLP",
  "COP",
  "PEN",
  "UYU",
  "PYG",
  "BOB",
  "CRC",
  "GTQ",
  "HNL",
  "NIO",
  "DOP",
  "AED",
  "SAR",
  "TRY",
  "RUB",
  "INR",
  "KRW",
  "SGD",
  "HKD",
  "NZD",
  "ZAR"
];

const infoMonedas = {
    EUR: "🇪🇺 Euro (EUR)",
    USD: "🇺🇸 US Dollar (USD)",
    GBP: "🇬🇧 Pound Sterling (GBP)",
    JPY: "🇯🇵 Japanese Yen (JPY)",
    CAD: "🇨🇦 Canadian Dollar (CAD)",
    AUD: "🇦🇺 Australian Dollar (AUD)",
    CHF: "🇨🇭 Swiss Franc (CHF)",
    CNY: "🇨🇳 Chinese Yuan (CNY)",
    MXN: "🇲🇽 Mexican Peso (MXN)",
    BRL: "🇧🇷 Brazilian Real (BRL)"
};

function cargarMonedas() {

    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");

    todasLasMonedas.forEach(moneda => {

        const opcionOrigen = document.createElement("option");
        opcionOrigen.value = moneda;
        opcionOrigen.textContent = infoMonedas[moneda] || moneda;

        const opcionDestino = document.createElement("option");
        opcionDestino.value = moneda;
        opcionDestino.textContent = infoMonedas[moneda] || moneda;

        origen.appendChild(opcionOrigen);
        destino.appendChild(opcionDestino);

    });

    origen.value = "EUR";
    destino.value = "USD";
}

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

    const favoritos = JSON.parse(localStorage.getItem("favoritosMonedas") || "[]");
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
    const favoritos = JSON.parse(localStorage.getItem("favoritosMonedas") || "[]");
    if (!favoritos.includes(texto)) {
        favoritos.unshift(texto);
        localStorage.setItem("favoritosMonedas", JSON.stringify(favoritos.slice(0, 5)));
    }
    mostrarFavoritos();
}

function actualizarHistorial(texto) {
    const historialLista = document.getElementById("historial-lista");
    const limpiarBtn = document.getElementById("limpiar-historial");

    if (!historialLista) return;

    let historial = JSON.parse(localStorage.getItem("historialMonedas") || "[]");
    historial.unshift(texto);
    historial = historial.slice(0, 5);
    localStorage.setItem("historialMonedas", JSON.stringify(historial));

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
        localStorage.removeItem("historialMonedas");
        historialLista.innerHTML = '<li class="historial-vacio">Sin registros aún</li>';
    });
}

async function convertir(guardarHistorial = true) {

    const cantidad = document.getElementById("cantidad").value;
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    const respuesta = await fetch(
        `https://open.er-api.com/v6/latest/${origen}`
    );

    const datos = await respuesta.json();

    const tasa = datos.rates[destino];

    const resultado = (cantidad * tasa).toFixed(2);

    const texto = `${cantidad} ${origen} = ${resultado} ${destino}`;
    document.getElementById("resultado").innerText = texto;
    if (guardarHistorial) {
        programarHistorial(texto);
    }
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

cargarMonedas();
document.getElementById("guardar-favorito").addEventListener("click", () => {
    const texto = document.getElementById("resultado").textContent;
    if (texto) {
        guardarFavorito(texto);
    }
});

mostrarFavoritos();
convertir(false);