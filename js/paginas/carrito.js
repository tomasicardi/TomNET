import { protegerPagina, mostrarUsuarioActual, configurarCierreSesion } from "./comun.js";
import GestorProductos from "../servicios/GestorProductos.js";
import GestorCarrito from "../servicios/GestorCarrito.js";
import GestorUsuarios from "../servicios/GestorUsuarios.js";
import { escaparHTML } from "../servicios/Seguridad.js";
import { notificar } from "../ui/Notificador.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!protegerPagina()) return;
    mostrarUsuarioActual();
    configurarCierreSesion();

    const contenedorLista = document.getElementById("lista-carrito");
    const contenedorTotales = document.getElementById("totales-carrito");
    const botonConfirmar = document.getElementById("btn-confirmar");

    function plantillaItem(producto, cantidad) {
        return `
            <div class="card mb-3" data-id="${producto.id}">
                <div class="row g-0">
                <div class="col-auto">
                    <img
                        src="${escaparHTML(producto.imagenMostrar)}"
                        alt="Foto de ${escaparHTML(producto.nombre)}"
                        class="imagen-producto-admin m-3"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='img/placeholder.svg';">
                </div>
                <div class="col">
                <div class="card-body">
                    <h3 class="h5 card-title">${escaparHTML(producto.nombre)}</h3>
                    <p class="mb-1 small">Precio unitario (con IVA): $${producto.precioFinal.toFixed(2)}</p>
                    <p class="mb-3 fw-semibold">Subtotal: $${(producto.precioFinal * cantidad).toFixed(2)}</p>
                    <div class="row g-2 align-items-end">
                        <div class="col-auto">
                            <label class="form-label small" for="cant-${producto.id}">Cantidad</label>
                            <input id="cant-${producto.id}" type="number" min="1" max="${producto.stock}" value="${cantidad}" class="form-control">
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-secondary btn-sm" data-accion="actualizar">Actualizar cantidad</button>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-outline-danger btn-sm" data-accion="eliminar">Eliminar</button>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>
        `;
    }

    function renderizarTotales() {
        const totales = GestorCarrito.calcularTotales();
        contenedorTotales.innerHTML = `
            <div class="card-body">
                <p class="mb-1">Subtotal sin IVA: $${totales.subtotal.toFixed(2)}</p>
                <p class="mb-1">IVA: $${totales.iva.toFixed(2)}</p>
                <p class="mb-0 fs-5"><strong>Total a pagar: $${totales.total.toFixed(2)}</strong></p>
            </div>
        `;
    }

    function renderizarCarrito() {
        const items = GestorCarrito.obtenerItems();

        if (items.length === 0) {
            contenedorLista.innerHTML = `<p class="text-body-secondary">El carrito esta vacio.</p>`;
        } else {
            contenedorLista.innerHTML = items
                .map((item) => {
                    const producto = GestorProductos.obtenerPorId(item.productoId);
                    return producto ? plantillaItem(producto, item.cantidad) : "";
                })
                .join("");
        }

        renderizarTotales();
    }

    contenedorLista.addEventListener("click", (evento) => {
        const tarjeta = evento.target.closest("[data-id]");
        if (!tarjeta) return;

        const id = Number(tarjeta.dataset.id);

        if (evento.target.closest("[data-accion='actualizar']")) {
            const inputCantidad = tarjeta.querySelector(`#cant-${id}`);
            const resultado = GestorCarrito.modificarCantidad(id, inputCantidad.value);
            notificar(resultado.mensaje, resultado.exito ? "exito" : "error");
            renderizarCarrito();
        }

        if (evento.target.closest("[data-accion='eliminar']")) {
            GestorCarrito.eliminar(id);
            notificar("Producto eliminado del carrito", "exito");
            renderizarCarrito();
        }
    });

    botonConfirmar.addEventListener("click", () => {
        const sesion = GestorUsuarios.obtenerSesion();
        const resultado = GestorCarrito.confirmarCompra(sesion);

        notificar(resultado.mensaje, resultado.exito ? "exito" : "error");

        if (resultado.exito) {
            window.setTimeout(() => { window.location.href = "productos.html"; }, 800);
        } else {
            renderizarCarrito();
        }
    });

    renderizarCarrito();
});
