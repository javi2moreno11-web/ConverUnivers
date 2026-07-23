const invertirBtn = document.getElementById("invertir-unidades");

if (invertirBtn) {
    invertirBtn.addEventListener("click", () => {
        const origen = document.getElementById("origen");
        const destino = document.getElementById("destino");
        if (!origen || !destino) return;

        const valorOrigen = origen.value;
        origen.value = destino.value;
        destino.value = valorOrigen;

        if (typeof convertir === "function") {
            convertir();
        } else {
            origen.dispatchEvent(new Event("change"));
        }
    });
}

document.addEventListener("click", async (event) => {
    const boton = event.target.closest(".boton-copiar");
    if (!boton) return;

    const texto = boton.dataset.texto;
    if (!texto) return;

    try {
        await navigator.clipboard.writeText(texto);
        const iconoOriginal = boton.textContent;
        boton.textContent = "✅";
        boton.disabled = true;
        setTimeout(() => {
            boton.textContent = iconoOriginal;
            boton.disabled = false;
        }, 1200);
    } catch (error) {
        window.prompt("Copia el resultado:", texto);
    }
});
