import { protegerPaginaAdmin, mostrarUsuarioActual, configurarCierreSesion } from "./comun.js";
import GestorProductos from "../servicios/GestorProductos.js";
import { notificar } from "../ui/Notificador.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!protegerPaginaAdmin()) return;
    mostrarUsuarioActual();
    configurarCierreSesion();

    const form = document.getElementById("form-crear-producto");
    const inputImagen = document.getElementById("producto-imagen");
    const vistaPrevia = document.getElementById("vista-previa-imagen");
    const IMAGEN_POR_DEFECTO = "img/placeholder.svg";

    inputImagen.addEventListener("input", () => {
        vistaPrevia.src = inputImagen.value.trim() || IMAGEN_POR_DEFECTO;
    });

    vistaPrevia.addEventListener("error", () => {
        vistaPrevia.src = IMAGEN_POR_DEFECTO;
    });

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const resultado = GestorProductos.agregar({
            nombre: document.getElementById("producto-nombre").value,
            descripcion: document.getElementById("producto-descripcion").value,
            precio: document.getElementById("producto-precio").value,
            tipoIva: document.getElementById("producto-iva").value,
            stock: document.getElementById("producto-stock").value,
            categoria: document.getElementById("producto-categoria").value,
            imagenUrl: inputImagen.value
        });

        notificar(resultado.mensaje, resultado.exito ? "exito" : "error");

        if (resultado.exito) {
            form.reset();
            vistaPrevia.src = IMAGEN_POR_DEFECTO;
            document.getElementById("producto-nombre").focus();
        }
    });
});
