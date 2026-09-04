import { protegerPaginaAdmin, mostrarUsuarioActual, configurarCierreSesion } from "./comun.js";
import GestorVentas from "../servicios/GestorVentas.js";
import { escaparHTML } from "../servicios/Seguridad.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!protegerPaginaAdmin()) return;
    mostrarUsuarioActual();
    configurarCierreSesion();

    const contenedor = document.getElementById("lista-ventas");
    const ventas = GestorVentas.obtenerTodas();

    function plantillaItems(items) {
        return `
            <ul class="list-group list-group-flush mb-3">
                ${items.map((item) => `
                    <li class="list-group-item">
                        ${escaparHTML(item.nombre)} — Cantidad: ${item.cantidad}
                        — Precio unitario: $${item.precioUnitario.toFixed(2)}
                        — Subtotal: $${(item.precioUnitario * item.cantidad).toFixed(2)}
                    </li>
                `).join("")}
            </ul>
        `;
    }

    function plantillaVenta(venta) {
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <h3 class="h5 card-title">Venta #${venta.id}</h3>
                    <p class="mb-1 small">Fecha: ${escaparHTML(venta.fechaLegible)}</p>
                    <p class="mb-1 small">Cliente: ${escaparHTML(venta.usuarioNombre)}</p>
                    <p class="mb-3 small">Cantidad total de productos: ${venta.cantidadTotal}</p>
                    <h4 class="h6">Productos comprados</h4>
                    ${plantillaItems(venta.items)}
                    <p class="mb-1">Subtotal sin IVA: $${venta.subtotal.toFixed(2)}</p>
                    <p class="mb-1">IVA: $${venta.iva.toFixed(2)}</p>
                    <p class="mb-0 fs-5"><strong>Total: $${venta.total.toFixed(2)}</strong></p>
                </div>
            </div>
        `;
    }

    contenedor.innerHTML = ventas.length === 0
        ? `<p class="text-body-secondary">Aun no se registraron ventas.</p>`
        : ventas.map(plantillaVenta).join("");
});
