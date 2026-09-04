import GestorUsuarios from "../servicios/GestorUsuarios.js";
import { notificar } from "../ui/Notificador.js";

export function mostrarUsuarioActual() {
    const zona = document.getElementById("usuario-actual");
    if (!zona) return;

    const sesion = GestorUsuarios.obtenerSesion();
    zona.textContent = sesion
        ? `Sesion: ${sesion.nombre} (${sesion.correo})`
        : "No hay sesion iniciada";
}

export function protegerPagina() {
    const sesion = GestorUsuarios.obtenerSesion();

    if (!sesion) {
        window.location.href = "index.html";
        return false;
    }

    if (sesion.esAdmin) {
        window.location.href = "menu-admin.html";
        return false;
    }

    return true;
}

export function protegerPaginaAdmin() {
    const sesion = GestorUsuarios.obtenerSesion();

    if (!sesion || !sesion.esAdmin) {
        notificar("Debes iniciar sesion como administrador", "error");
        window.location.href = "login.html";
        return false;
    }

    return true;
}

export function configurarCierreSesion() {
    const botonSalir = document.getElementById("btn-salir");
    if (!botonSalir) return;

    botonSalir.addEventListener("click", () => {
        GestorUsuarios.cerrarSesion();
        window.location.href = "index.html";
    });
}

export function marcarNavActiva() {
    const pagina = window.location.pathname.split("/").pop();
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
        if (link.getAttribute("href") === pagina) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

document.addEventListener("DOMContentLoaded", marcarNavActiva);
