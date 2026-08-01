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
    const contenedor = document.querySelector(".conversores-grid") || document.querySelector("main");

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
    ordenarTarjetasInicio();
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
    iniciarMiniConversores();
});
window.addEventListener("storage", () => {
    actualizarBotonesEstrella();
    ordenarTarjetasInicio();
});

// ------------------------------------------------------------------
// Mini conversores rápidos de la portada: reutilizan el registro y las
// funciones de cálculo de converter-utils.js para no duplicar la
// lógica de conversión. Cada tarjeta ofrece una conversión inmediata
// y un enlace directo a la página completa con la conversión detallada.
// ------------------------------------------------------------------
function iniciarMiniConversores() {
    const api = window.ConverUniversConversores;
    const formato = window.ConverUniversFormato;
    if (!api) return;

    function formatearNumero(numero, decimales) {
        return formato ? formato.formatearNumero(numero, decimales) : String(numero);
    }

    function poblarSelect(select, opciones, valorSeleccionado) {
        if (!select) return;
        select.innerHTML = "";
        opciones.forEach(({ valor, etiqueta }) => {
            const opcion = document.createElement("option");
            opcion.value = valor;
            opcion.textContent = etiqueta;
            select.appendChild(opcion);
        });
        select.value = valorSeleccionado;
    }

    function actualizarEnlace(cta, pagina, cantidad, origen, destino) {
        if (!cta) return;
        const parametros = new URLSearchParams({ cantidad: String(cantidad), origen, destino });
        cta.href = `${pagina}?${parametros.toString()}`;
    }

    function referenciasTarjeta(tarjeta) {
        return {
            cantidadEl: tarjeta.querySelector('[data-mini="cantidad"]'),
            origenEl: tarjeta.querySelector('[data-mini="origen"]'),
            destinoEl: tarjeta.querySelector('[data-mini="destino"]'),
            resultadoEl: tarjeta.querySelector('[data-mini="resultado"]'),
            invertirEl: tarjeta.querySelector('[data-mini="invertir"]'),
            ctaEl: tarjeta.querySelector('[data-mini="cta"]')
        };
    }

    function conectarInvertir(invertirEl, origenEl, destinoEl, calcular, limpiarCache) {
        if (!invertirEl) return;
        invertirEl.addEventListener("click", () => {
            const temporal = origenEl.value;
            origenEl.value = destinoEl.value;
            destinoEl.value = temporal;
            if (limpiarCache) limpiarCache();
            calcular();
        });
    }

    function iniciarFactor(tarjeta, config) {
        const { cantidadEl, origenEl, destinoEl, resultadoEl, invertirEl, ctaEl } = referenciasTarjeta(tarjeta);
        const opciones = Object.keys(config.factores).map((unidad) => ({ valor: unidad, etiqueta: unidad }));
        poblarSelect(origenEl, opciones, config.origenPorDefecto);
        poblarSelect(destinoEl, opciones, config.destinoPorDefecto);

        function calcular() {
            const cantidad = parseFloat(cantidadEl.value);
            actualizarEnlace(ctaEl, config.pagina, cantidadEl.value, origenEl.value, destinoEl.value);
            if (Number.isNaN(cantidad)) {
                resultadoEl.textContent = "";
                return;
            }
            const resultado = api.convertirPorFactor(cantidad, origenEl.value, destinoEl.value, config.factores);
            const simboloOrigen = config.simbolos[origenEl.value] || origenEl.value;
            const simboloDestino = config.simbolos[destinoEl.value] || destinoEl.value;
            resultadoEl.textContent = `${formatearNumero(cantidad, 2)} ${simboloOrigen} = ${formatearNumero(resultado, 4)} ${simboloDestino}`;
        }

        cantidadEl.addEventListener("input", calcular);
        origenEl.addEventListener("change", calcular);
        destinoEl.addEventListener("change", calcular);
        conectarInvertir(invertirEl, origenEl, destinoEl, calcular);
        calcular();
    }

    function iniciarTemperatura(tarjeta, config) {
        const { cantidadEl, origenEl, destinoEl, resultadoEl, invertirEl, ctaEl } = referenciasTarjeta(tarjeta);
        const opciones = config.unidades.map((unidad) => ({ valor: unidad, etiqueta: unidad }));
        poblarSelect(origenEl, opciones, config.origenPorDefecto);
        poblarSelect(destinoEl, opciones, config.destinoPorDefecto);

        function calcular() {
            const cantidad = parseFloat(cantidadEl.value);
            actualizarEnlace(ctaEl, config.pagina, cantidadEl.value, origenEl.value, destinoEl.value);
            if (Number.isNaN(cantidad)) {
                resultadoEl.textContent = "";
                return;
            }
            const resultado = api.convertirTemperaturaValor(cantidad, origenEl.value, destinoEl.value);
            const simboloOrigen = config.simbolos[origenEl.value] || origenEl.value;
            const simboloDestino = config.simbolos[destinoEl.value] || destinoEl.value;
            resultadoEl.textContent = `${formatearNumero(cantidad, 2)} ${simboloOrigen} = ${formatearNumero(resultado, 2)} ${simboloDestino}`;
        }

        cantidadEl.addEventListener("input", calcular);
        origenEl.addEventListener("change", calcular);
        destinoEl.addEventListener("change", calcular);
        conectarInvertir(invertirEl, origenEl, destinoEl, calcular);
        calcular();
    }

    function iniciarZonasHorarias(tarjeta, config) {
        const { cantidadEl, origenEl, destinoEl, resultadoEl, invertirEl, ctaEl } = referenciasTarjeta(tarjeta);
        const opciones = config.zonas.map((zona) => ({ valor: zona.value, etiqueta: `${zona.city} (${zona.utcLabel})` }));
        const offsetPorZona = Object.fromEntries(config.zonas.map((zona) => [zona.value, zona.offset]));
        poblarSelect(origenEl, opciones, config.origenPorDefecto);
        poblarSelect(destinoEl, opciones, config.destinoPorDefecto);

        function calcular() {
            const valor = cantidadEl.value;
            actualizarEnlace(ctaEl, config.pagina, valor, origenEl.value, destinoEl.value);
            if (!valor) {
                resultadoEl.textContent = "";
                return;
            }
            const [horas, minutos] = valor.split(":").map(Number);
            const diferencia = offsetPorZona[destinoEl.value] - offsetPorZona[origenEl.value];
            let resultadoHoras = horas + diferencia;
            let diaTexto = "mismo día";
            if (resultadoHoras < 0) {
                resultadoHoras += 24;
                diaTexto = "día anterior";
            } else if (resultadoHoras >= 24) {
                resultadoHoras -= 24;
                diaTexto = "día siguiente";
            }
            const horaTexto = `${String(resultadoHoras).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
            resultadoEl.textContent = `${valor} → ${horaTexto} (${diaTexto})`;
        }

        cantidadEl.addEventListener("input", calcular);
        origenEl.addEventListener("change", calcular);
        destinoEl.addEventListener("change", calcular);
        conectarInvertir(invertirEl, origenEl, destinoEl, calcular);
        calcular();
    }

    function iniciarMonedas(tarjeta, config) {
        const { cantidadEl, origenEl, destinoEl, resultadoEl, invertirEl, ctaEl } = referenciasTarjeta(tarjeta);
        const opciones = config.codigos.map((codigo) => ({ valor: codigo, etiqueta: config.info[codigo] || codigo }));
        poblarSelect(origenEl, opciones, config.origenPorDefecto);
        poblarSelect(destinoEl, opciones, config.destinoPorDefecto);

        let tasasCache = null;
        let origenCache = null;

        async function calcular() {
            const cantidad = parseFloat(cantidadEl.value);
            const origen = origenEl.value;
            const destino = destinoEl.value;
            actualizarEnlace(ctaEl, config.pagina, cantidadEl.value, origen, destino);

            if (Number.isNaN(cantidad)) {
                resultadoEl.textContent = "";
                return;
            }

            try {
                if (!tasasCache || origenCache !== origen) {
                    resultadoEl.textContent = "Consultando cotización…";
                    tasasCache = await api.obtenerTasasMoneda(origen);
                    origenCache = origen;
                }
                const tasa = tasasCache.rates ? tasasCache.rates[destino] : undefined;
                if (typeof tasa !== "number") {
                    resultadoEl.textContent = "Cotización no disponible";
                    return;
                }
                resultadoEl.textContent = `${formatearNumero(cantidad, 2)} ${origen} = ${formatearNumero(cantidad * tasa, 2)} ${destino}`;
            } catch (error) {
                resultadoEl.textContent = "No se pudo cargar la cotización";
            }
        }

        cantidadEl.addEventListener("input", calcular);
        origenEl.addEventListener("change", () => { tasasCache = null; calcular(); });
        destinoEl.addEventListener("change", calcular);
        conectarInvertir(invertirEl, origenEl, destinoEl, calcular, () => { tasasCache = null; });
        calcular();
    }

    function obtenerSimboloCripto(config, criptoId) {
        const etiqueta = config.infoCriptos[criptoId] || criptoId;
        const coincidencia = etiqueta.match(/\(([^)]+)\)$/);
        return coincidencia ? coincidencia[1] : criptoId;
    }

    function iniciarCriptomonedas(tarjeta, config) {
        const { cantidadEl, origenEl, destinoEl, resultadoEl, ctaEl } = referenciasTarjeta(tarjeta);
        const opcionesCripto = config.criptos.map((id) => ({ valor: id, etiqueta: config.infoCriptos[id] || id }));
        const opcionesFiat = config.fiats.map((codigo) => ({ valor: codigo, etiqueta: config.infoFiat[codigo] || codigo }));

        poblarSelect(origenEl, opcionesCripto, config.origenPorDefecto);
        poblarSelect(destinoEl, opcionesFiat, config.destinoPorDefecto);

        let precioCache = null;
        let claveCache = null;

        async function calcular() {
            const cantidad = parseFloat(cantidadEl.value);
            const criptoId = origenEl.value;
            const monedaFiat = destinoEl.value.toLowerCase();
            actualizarEnlace(ctaEl, config.pagina, cantidadEl.value, criptoId, destinoEl.value);

            if (Number.isNaN(cantidad)) {
                resultadoEl.textContent = "";
                return;
            }

            const clave = `${criptoId}-${monedaFiat}`;

            try {
                if (!precioCache || claveCache !== clave) {
                    resultadoEl.textContent = "Consultando cotización…";
                    const datos = await api.obtenerPrecioCripto(criptoId, monedaFiat);
                    precioCache = datos[criptoId] ? datos[criptoId][monedaFiat] : undefined;
                    claveCache = clave;
                }
                if (typeof precioCache !== "number") {
                    resultadoEl.textContent = "Cotización no disponible";
                    return;
                }
                resultadoEl.textContent = `${formatearNumero(cantidad, 4)} ${obtenerSimboloCripto(config, criptoId)} = ${formatearNumero(cantidad * precioCache, 2)} ${destinoEl.value.toUpperCase()}`;
            } catch (error) {
                resultadoEl.textContent = "No se pudo cargar la cotización";
            }
        }

        cantidadEl.addEventListener("input", calcular);
        origenEl.addEventListener("change", () => { precioCache = null; calcular(); });
        destinoEl.addEventListener("change", () => { precioCache = null; calcular(); });
        calcular();
    }

    document.querySelectorAll(".mini-conversor[data-tipo]").forEach((tarjeta) => {
        const tipo = tarjeta.getAttribute("data-tipo");
        const config = api.registro[tipo];
        if (!config) return;

        if (tipo === "temperatura") {
            iniciarTemperatura(tarjeta, config);
        } else if (tipo === "zonashorarias") {
            iniciarZonasHorarias(tarjeta, config);
        } else if (tipo === "monedas") {
            iniciarMonedas(tarjeta, config);
        } else if (tipo === "criptomonedas") {
            iniciarCriptomonedas(tarjeta, config);
        } else if (config.factores) {
            iniciarFactor(tarjeta, config);
        }
    });
}
