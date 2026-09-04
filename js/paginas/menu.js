import { protegerPagina, mostrarUsuarioActual, configurarCierreSesion } from "./comun.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!protegerPagina()) return;
    mostrarUsuarioActual();
    configurarCierreSesion();
});
