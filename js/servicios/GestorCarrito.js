import { guardarEnStorage, leerDeStorage, generarNuevoId } from "./Storage.js";
import GestorProductos from "./GestorProductos.js";
import GestorVentas from "./GestorVentas.js";
import Venta from "../modelos/Venta.js";

const CLAVE_CARRITO = "carrito";

export default class GestorCarrito {
    static obtenerItems() {
        return leerDeStorage(CLAVE_CARRITO, []);
    }

    static guardarItems(items) {
        guardarEnStorage(CLAVE_CARRITO, items);
    }

    static agregar(productoId, cantidad) {
        const items = this.obtenerItems();
        const producto = GestorProductos.obtenerPorId(productoId);
        const cantidadNumerica = parseInt(cantidad, 10);

        if (!producto) {
            return { exito: false, mensaje: "Producto no encontrado" };
        }

        if (Number.isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
            return { exito: false, mensaje: "La cantidad debe ser mayor a cero" };
        }

        if (cantidadNumerica > producto.stock) {
            return { exito: false, mensaje: "No hay suficiente stock disponible" };
        }

        const itemExistente = items.find((item) => item.productoId === productoId);

        if (itemExistente) {
            if (itemExistente.cantidad + cantidadNumerica > producto.stock) {
                return { exito: false, mensaje: "No hay suficiente stock disponible" };
            }
            itemExistente.cantidad += cantidadNumerica;
        } else {
            items.push({ productoId, cantidad: cantidadNumerica });
        }

        this.guardarItems(items);
        return { exito: true, mensaje: "Producto agregado al carrito" };
    }

    static modificarCantidad(productoId, cantidad) {
        const items = this.obtenerItems();
        const producto = GestorProductos.obtenerPorId(productoId);
        const cantidadNumerica = parseInt(cantidad, 10);

        if (Number.isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
            return this.eliminar(productoId);
        }

        if (producto && cantidadNumerica > producto.stock) {
            return { exito: false, mensaje: "No hay suficiente stock disponible" };
        }

        const item = items.find((elemento) => elemento.productoId === productoId);
        if (!item) {
            return { exito: false, mensaje: "El producto no esta en el carrito" };
        }

        item.cantidad = cantidadNumerica;
        this.guardarItems(items);
        return { exito: true, mensaje: "Cantidad actualizada" };
    }

    static eliminar(productoId) {
        const items = this.obtenerItems().filter((item) => item.productoId !== productoId);
        this.guardarItems(items);
        return { exito: true, mensaje: "Producto eliminado del carrito" };
    }

    static vaciar() {
        this.guardarItems([]);
    }

    static calcularTotales() {
        const items = this.obtenerItems();

        return items.reduce(
            (totales, item) => {
                const producto = GestorProductos.obtenerPorId(item.productoId);
                if (!producto) {
                    return totales;
                }

                return {
                    subtotal: totales.subtotal + producto.precio * item.cantidad,
                    iva: totales.iva + producto.montoIva * item.cantidad,
                    total: totales.total + producto.precioFinal * item.cantidad,
                    cantidadTotal: totales.cantidadTotal + item.cantidad
                };
            },
            { subtotal: 0, iva: 0, total: 0, cantidadTotal: 0 }
        );
    }

    static confirmarCompra(usuario) {
        const items = this.obtenerItems();

        if (items.length === 0) {
            return { exito: false, mensaje: "El carrito esta vacio" };
        }

        const totales = this.calcularTotales();
        const detalleItems = [];

        for (const item of items) {
            const producto = GestorProductos.obtenerPorId(item.productoId);
            if (!producto) {
                continue;
            }
            if (item.cantidad > producto.stock) {
                return { exito: false, mensaje: `No hay suficiente stock de "${producto.nombre}"` };
            }
        }

        for (const item of items) {
            const producto = GestorProductos.obtenerPorId(item.productoId);
            if (!producto) {
                continue;
            }

            detalleItems.push({
                productoId: producto.id,
                nombre: producto.nombre,
                cantidad: item.cantidad,
                precioUnitario: producto.precio
            });

            GestorProductos.descontarStock(producto.id, item.cantidad);
        }

        const ventas = GestorVentas.obtenerTodas();
        const nuevaVenta = new Venta({
            id: generarNuevoId(ventas),
            usuarioId: usuario.id,
            usuarioNombre: usuario.nombre,
            items: detalleItems,
            cantidadTotal: totales.cantidadTotal,
            subtotal: totales.subtotal,
            iva: totales.iva,
            total: totales.total
        });

        GestorVentas.agregar(nuevaVenta);
        this.vaciar();

        return { exito: true, mensaje: "Compra confirmada con exito", venta: nuevaVenta };
    }
}
