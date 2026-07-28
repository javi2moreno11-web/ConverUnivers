const historial = window.ConverUniversHistory ? window.ConverUniversHistory.createHistoryController({
    storageKey: "historialCalculadora",
    emptyText: "Sin registros a\u00fan",
    listElement: document.getElementById("historial-lista"),
    clearButtonElement: document.getElementById("limpiar-historial")
}) : null;
let historialTimeout;

function programarHistorial(texto) {
    clearTimeout(historialTimeout);
    historialTimeout = setTimeout(() => {
        if (historial) {
            historial.add(texto);
        }
    }, 400);
}

const pantallaExpresion = document.getElementById("calc-expresion");
const pantallaResultado = document.getElementById("calc-resultado");

let valorAnterior = null;
let operadorActual = null;
let entradaActual = "0";
let esperandoNuevaEntrada = false;

function formatearNumero(numero) {
    if (!Number.isFinite(numero)) return "Error";

    const texto = numero.toString();
    if (texto.length <= 14) return texto;

    return numero.toPrecision(10).replace(/\.?0+$/, "");
}

function actualizarPantalla() {
    pantallaResultado.textContent = entradaActual;
    pantallaExpresion.textContent = valorAnterior !== null && operadorActual
        ? `${formatearNumero(valorAnterior)} ${operadorActual}`
        : "";
}

function calcular(a, operador, b) {
    switch (operador) {
        case "+": return a + b;
        case "−": return a - b;
        case "×": return a * b;
        case "÷": return b === 0 ? NaN : a / b;
        default: return b;
    }
}

function introducirNumero(numero) {
    if (esperandoNuevaEntrada) {
        entradaActual = numero === "." ? "0." : numero;
        esperandoNuevaEntrada = false;
        actualizarPantalla();
        return;
    }

    if (numero === "." && entradaActual.includes(".")) return;
    if (entradaActual.replace("-", "").length >= 14) return;

    entradaActual = entradaActual === "0" && numero !== "."
        ? numero
        : entradaActual + numero;

    actualizarPantalla();
}

function elegirOperador(operador) {
    const entradaNumerica = parseFloat(entradaActual);

    if (valorAnterior !== null && operadorActual && !esperandoNuevaEntrada) {
        valorAnterior = calcular(valorAnterior, operadorActual, entradaNumerica);
    } else {
        valorAnterior = entradaNumerica;
    }

    operadorActual = operador;
    esperandoNuevaEntrada = true;
    actualizarPantalla();
}

function calcularIgual() {
    if (operadorActual === null) return;

    const entradaNumerica = parseFloat(entradaActual);
    const resultado = calcular(valorAnterior, operadorActual, entradaNumerica);
    const textoOperacion = `${formatearNumero(valorAnterior)} ${operadorActual} ${formatearNumero(entradaNumerica)} = ${formatearNumero(resultado)}`;

    entradaActual = formatearNumero(resultado);
    valorAnterior = null;
    operadorActual = null;
    esperandoNuevaEntrada = true;

    actualizarPantalla();
    programarHistorial(textoOperacion);
}

function limpiarTodo() {
    entradaActual = "0";
    valorAnterior = null;
    operadorActual = null;
    esperandoNuevaEntrada = false;
    actualizarPantalla();
}

function borrarUltimo() {
    if (esperandoNuevaEntrada) return;

    entradaActual = entradaActual.length > 1
        ? entradaActual.slice(0, -1)
        : "0";

    actualizarPantalla();
}

function aplicarPorcentaje() {
    entradaActual = formatearNumero(parseFloat(entradaActual) / 100);
    actualizarPantalla();
}

function cambiarSigno() {
    if (entradaActual === "0") return;

    entradaActual = entradaActual.startsWith("-")
        ? entradaActual.slice(1)
        : `-${entradaActual}`;

    actualizarPantalla();
}

function moverCursorAlFinal(elemento) {
    const rango = document.createRange();
    rango.selectNodeContents(elemento);
    rango.collapse(false);
    const seleccion = window.getSelection();
    seleccion.removeAllRanges();
    seleccion.addRange(rango);
}

function evaluarTexto(texto) {
    const conPorcentajes = texto.replace(/(\d+\.?\d*)%/g, (_, n) => (parseFloat(n) / 100).toString());
    const tokens = conPorcentajes.match(/(\d+\.?\d*|\.\d+|[+−×÷])/g);

    if (!tokens || tokens.length === 0) return null;

    let resultado = parseFloat(tokens[0]);
    if (Number.isNaN(resultado)) return null;

    let i = 1;
    while (i < tokens.length - 1) {
        const operador = tokens[i];
        const siguiente = parseFloat(tokens[i + 1]);

        if (!"+−×÷".includes(operador) || Number.isNaN(siguiente)) return null;

        resultado = calcular(resultado, operador, siguiente);
        i += 2;
    }

    return { resultado, expresion: tokens.join(" ") };
}

function calcularDesdeTexto() {
    const texto = pantallaResultado.textContent.trim();
    if (!texto) return;

    const evaluado = evaluarTexto(texto);
    if (!evaluado) return;

    const textoOperacion = `${evaluado.expresion} = ${formatearNumero(evaluado.resultado)}`;

    entradaActual = formatearNumero(evaluado.resultado);
    valorAnterior = null;
    operadorActual = null;
    esperandoNuevaEntrada = true;

    actualizarPantalla();
    programarHistorial(textoOperacion);
}

pantallaResultado.addEventListener("focus", () => {
    pantallaExpresion.textContent = "";
    valorAnterior = null;
    operadorActual = null;
});

pantallaResultado.addEventListener("input", () => {
    const original = pantallaResultado.textContent;
    const limpio = original
        .replace(/\r?\n/g, "")
        .replace(/[xX*]/g, "×")
        .replace(/\//g, "÷")
        .replace(/-/g, "−")
        .replace(/[^0-9+−×÷.%\s]/g, "");

    if (limpio !== original) {
        pantallaResultado.textContent = limpio;
        moverCursorAlFinal(pantallaResultado);
    }

    entradaActual = limpio.replace(/\s/g, "") || "0";
    esperandoNuevaEntrada = false;
});

pantallaResultado.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === "=") {
        evento.preventDefault();
        calcularDesdeTexto();
    } else if (evento.key === "Escape") {
        evento.preventDefault();
        limpiarTodo();
        pantallaResultado.blur();
    }
});

pantallaResultado.addEventListener("paste", (evento) => {
    evento.preventDefault();
    const texto = (evento.clipboardData || window.clipboardData).getData("text");
    document.execCommand("insertText", false, texto.replace(/[^0-9+\-×÷x*/.%\s]/gi, ""));
});

pantallaResultado.addEventListener("blur", () => {
    const texto = pantallaResultado.textContent.trim();

    if (/[+−×÷]/.test(texto)) {
        calcularDesdeTexto();
    } else if (texto === "" || Number.isNaN(parseFloat(texto))) {
        entradaActual = "0";
        actualizarPantalla();
    }
});

document.querySelectorAll(".tecla-calc").forEach(boton => {
    boton.addEventListener("click", () => {
        const numero = boton.dataset.numero;
        const operador = boton.dataset.operador;
        const accion = boton.dataset.accion;

        if (numero !== undefined) {
            introducirNumero(numero);
        } else if (operador !== undefined) {
            elegirOperador(operador);
        } else if (accion === "igual") {
            calcularIgual();
        } else if (accion === "limpiar") {
            limpiarTodo();
        } else if (accion === "borrar") {
            borrarUltimo();
        } else if (accion === "porcentaje") {
            aplicarPorcentaje();
        } else if (accion === "signo") {
            cambiarSigno();
        }
    });
});

document.addEventListener("keydown", (evento) => {
    if (document.activeElement === pantallaResultado) {
        return;
    }

    if (evento.key >= "0" && evento.key <= "9") {
        introducirNumero(evento.key);
    } else if (evento.key === ".") {
        introducirNumero(".");
    } else if (evento.key === "+") {
        elegirOperador("+");
    } else if (evento.key === "-") {
        elegirOperador("−");
    } else if (evento.key === "*") {
        elegirOperador("×");
    } else if (evento.key === "/") {
        evento.preventDefault();
        elegirOperador("÷");
    } else if (evento.key === "Enter" || evento.key === "=") {
        evento.preventDefault();
        calcularIgual();
    } else if (evento.key === "Backspace") {
        borrarUltimo();
    } else if (evento.key === "Escape") {
        limpiarTodo();
    } else if (evento.key === "%") {
        aplicarPorcentaje();
    }
});

actualizarPantalla();
