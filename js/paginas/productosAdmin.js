import { protegerPaginaAdmin, mostrarUsuarioActual, configurarCierreSesion } from "./comun.js";
import GestorProductos from "../servicios/GestorProductos.js";
import { escaparHTML } from "../servicios/Seguridad.js";
import { notificar, confirmarAccion } from "../ui/Notificador.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!protegerPaginaAdmin()) return;
    mostrarUsuarioActual();
    configurarCierreSesion();

    const contenedor = document.getElementById("lista-productos-admin");

    function plantillaFila(producto) {
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
                    <p class="card-text text-body-secondary small">${escaparHTML(producto.descripcion) || "Sin descripcion."}</p>
                    <p class="mb-1 small">
                        ${producto.textoCategoria} — Precio de venta: $${producto.precio.toFixed(2)} · ${producto.textoIva}
                    </p>
                    <p class="mb-3 fw-semibold">Precio final: $${producto.precioFinal.toFixed(2)}</p>
                    <div class="row g-2 align-items-end">
                        <div class="col-auto">
                            <label class="form-label small" for="stock-${producto.id}">Stock actual</label>
                            <input id="stock-${producto.id}" type="number" min="0" class="form-control" value="${producto.stock}">
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-secondary btn-sm" data-accion="actualizar-stock">Actualizar stock</button>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-outline-danger btn-sm" data-accion="eliminar">Eliminar producto</button>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>
        `;
    }

    function renderizarLista() {
        const productos = GestorProductos.obtenerTodos();

        if (productos.length === 0) {
            contenedor.innerHTML = `<p class="text-body-secondary">No hay productos registrados.</p>`;
            return;
        }

        contenedor.innerHTML = productos.map(plantillaFila).join("");
    }

    contenedor.addEventListener("click", async (evento) => {
        const tarjeta = evento.target.closest("[data-id]");
        if (!tarjeta) return;

        const id = Number(tarjeta.dataset.id);
        const producto = GestorProductos.obtenerPorId(id);

        if (evento.target.closest("[data-accion='actualizar-stock']")) {
            const inputStock = tarjeta.querySelector(`#stock-${id}`);
            const resultado = GestorProductos.modificarStock(id, inputStock.value);
            notificar(resultado.mensaje, resultado.exito ? "exito" : "error");
            if (resultado.exito) renderizarLista();
        }

        if (evento.target.closest("[data-accion='eliminar']")) {
            const confirmado = await confirmarAccion(`¿Eliminar el producto "${producto?.nombre ?? ""}"?`);
            if (!confirmado) return;

            GestorProductos.eliminar(id);
            notificar("Producto eliminado", "exito");
            renderizarLista();
        }
    });

    renderizarLista();
});
