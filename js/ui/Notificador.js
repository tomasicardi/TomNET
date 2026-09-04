// Sirve para mostrar notificaciones en vez de usar alert()

import { escaparHTML } from "../servicios/Seguridad.js";

function obtenerContenedor() {
    let contenedor = document.getElementById("zona-notificaciones");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "zona-notificaciones";
        contenedor.className = "zona-notificaciones";
        contenedor.setAttribute("aria-live", "polite");
        contenedor.setAttribute("aria-atomic", "true");
        document.body.appendChild(contenedor);
    }

    return contenedor;
}

/**
 * Muestra una notificacion tipo toast, accesible para lectores de pantalla.
 * @param {string} mensaje
 * @param {"exito"|"error"|"info"} tipo
 */
export function notificar(mensaje, tipo = "info") {
    const contenedor = obtenerContenedor();
    const toast = document.createElement("div");

    const clasesPorTipo = {
        exito: "alert-success",
        error: "alert-danger",
        info: "alert-info"
    };

    toast.className = `alert ${clasesPorTipo[tipo] || clasesPorTipo.info} notificacion-toast`;
    toast.setAttribute("role", tipo === "error" ? "alert" : "status");
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    window.setTimeout(() => {
        toast.classList.add("notificacion-toast--saliendo");
        window.setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Reemplazo accesible de confirm(), implementado con un <dialog> nativo.
 * @param {string} mensaje
 * @returns {Promise<boolean>}
 */
export function confirmarAccion(mensaje) {
    return new Promise((resolve) => {
        const dialogo = document.createElement("dialog");
        dialogo.className = "dialogo-confirmacion";
        dialogo.innerHTML = `
            <form method="dialog">
                <p>${escaparHTML(mensaje)}</p>
                <div class="d-flex gap-2 justify-content-end">
                    <button type="button" class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
                    <button type="button" class="btn btn-danger" data-accion="confirmar">Confirmar</button>
                </div>
            </form>
        `;

        document.body.appendChild(dialogo);

        dialogo.addEventListener("click", (evento) => {
            const boton = evento.target.closest("[data-accion]");
            if (!boton) return;

            const confirmado = boton.dataset.accion === "confirmar";
            dialogo.close();
            dialogo.remove();
            resolve(confirmado);
        });

        dialogo.showModal();
    });
}
