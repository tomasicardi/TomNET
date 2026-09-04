import { protegerPaginaAdmin, mostrarUsuarioActual, configurarCierreSesion } from "./comun.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!protegerPaginaAdmin()) return;
    mostrarUsuarioActual();
    configurarCierreSesion();
});
