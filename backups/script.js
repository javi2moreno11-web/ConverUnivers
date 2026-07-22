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

async function convertir() {

    const cantidad = document.getElementById("cantidad").value;
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    const respuesta = await fetch(
        `https://open.er-api.com/v6/latest/${origen}`
    );

    const datos = await respuesta.json();

    const tasa = datos.rates[destino];

    const resultado = (cantidad * tasa).toFixed(2);

    document.getElementById("resultado").innerText =
        `${cantidad} ${origen} = ${resultado} ${destino}`;
}

document.getElementById("cantidad").addEventListener("input", convertir);
document.getElementById("origen").addEventListener("change", convertir);
document.getElementById("destino").addEventListener("change", convertir);

cargarMonedas();
convertir();