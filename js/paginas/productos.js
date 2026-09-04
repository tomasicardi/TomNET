import { protegerPagina, mostrarUsuarioActual, configurarCierreSesion } from "./comun.js";
import GestorProductos from "../servicios/GestorProductos.js";
import GestorCarrito from "../servicios/GestorCarrito.js";
import { obtenerCotizacionUsd } from "../servicios/ApiCotizacion.js";
import { escaparHTML } from "../servicios/Seguridad.js";
import { notificar } from "../ui/Notificador.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!protegerPagina()) return;
    mostrarUsuarioActual();
    configurarCierreSesion();

    const contenedor = document.getElementById("lista-productos");
    const inputBuscar = document.getElementById("buscar-producto");
    const selectFiltro = document.getElementById("filtro-categoria");
    const zonaCotizacion = document.getElementById("cotizacion-dolar");

    function plantillaProducto(producto) {
        const sinStock = !producto.hayStock;

        return `
            <div class="col-12 col-sm-6 col-lg-4">
                <article class="card h-100 tarjeta-producto" data-id="${producto.id}">
                    <img
                        src="${escaparHTML(producto.imagenMostrar)}"
                        alt="Foto de ${escaparHTML(producto.nombre)}"
                        class="card-img-top imagen-producto"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='img/placeholder.svg';">
                    <div class="card-body d-flex flex-column">
                        <h3 class="h5 card-title">${escaparHTML(producto.nombre)}</h3>
                        <p class="card-text text-body-secondary small">${escaparHTML(producto.descripcion) || "Sin descripcion."}</p>
                        <p class="mb-1"><span class="badge text-bg-secondary">${producto.textoCategoria}</span></p>
                        <p class="mb-1 fw-semibold">Precio final: $${producto.precioFinal.toFixed(2)}</p>
                        <p class="mb-3 small text-body-secondary">Stock disponible: ${producto.stock}</p>
                        <div class="mt-auto">
                            <label class="form-label visually-hidden" for="cantidad-${producto.id}">
                                Cantidad de ${escaparHTML(producto.nombre)}
                            </label>
                            <div class="input-group mb-2">
                                <input
                                    id="cantidad-${producto.id}"
                                    type="number"
                                    class="form-control"
                                    min="1"
                                    max="${producto.stock}"
                                    value="1"
                                    ${sinStock ? "disabled" : ""}
                                    aria-describedby="ayuda-cantidad-${producto.id}">
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    data-accion="agregar-carrito"
                                    ${sinStock ? "disabled" : ""}>
                                    Agregar al carrito
                                </button>
                            </div>
                            <span id="ayuda-cantidad-${producto.id}" class="visually-hidden">
                                ${sinStock ? "Sin stock disponible" : `Maximo disponible: ${producto.stock}`}
                            </span>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    function renderizarProductos(productos) {
        if (productos.length === 0) {
            contenedor.innerHTML = `<p class="text-body-secondary">No se encontraron productos.</p>`;
            return;
        }
        contenedor.innerHTML = productos.map(plantillaProducto).join("");
    }

    function aplicarFiltros() {
        const texto = inputBuscar.value.trim();
        const categoria = selectFiltro.value;

        let productos = texto ? GestorProductos.buscar(texto) : GestorProductos.obtenerTodos();
        productos = GestorProductos.filtrarPorCategoria(productos, categoria);
        renderizarProductos(productos);
    }

    contenedor.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-accion='agregar-carrito']");
        if (!boton) return;

        const tarjeta = boton.closest("[data-id]");
        const id = Number(tarjeta.dataset.id);
        const inputCantidad = tarjeta.querySelector("input[type='number']");

        const resultado = GestorCarrito.agregar(id, inputCantidad.value);
        notificar(resultado.mensaje, resultado.exito ? "exito" : "error");

        if (resultado.exito) {
            aplicarFiltros();
        }
    });

    inputBuscar.addEventListener("input", aplicarFiltros);
    selectFiltro.addEventListener("change", aplicarFiltros);

    async function mostrarCotizacion() {
        if (!zonaCotizacion) return;
        try {
            const cotizacion = await obtenerCotizacionUsd();
            const nota = cotizacion.deCache ? " (valor guardado)" : "";
            zonaCotizacion.textContent = `1 USD ≈ $${cotizacion.venta} UYU${nota}`;
        } catch {
            zonaCotizacion.textContent = "No se pudo obtener la cotizacion del dolar en este momento.";
        }
    }

    aplicarFiltros();
    mostrarCotizacion();
});
