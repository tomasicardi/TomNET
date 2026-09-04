import { guardarEnStorage, leerDeStorage, generarNuevoId } from "./Storage.js";
import Producto from "../modelos/Producto.js";

const CLAVE_PRODUCTOS = "productos";

export default class GestorProductos {
    static obtenerTodos() {
        return leerDeStorage(CLAVE_PRODUCTOS, []).map(Producto.desdeObjeto);
    }

    static guardarTodos(productos) {
        guardarEnStorage(CLAVE_PRODUCTOS, productos);
    }

    static agregar({ nombre, descripcion, precio, tipoIva, stock, categoria, imagenUrl }) {
        const productos = this.obtenerTodos();
        const precioNumerico = parseFloat(precio);
        let stockNumerico = parseInt(stock, 10);
        const imagenUrlLimpia = (imagenUrl || "").trim();

        if (!nombre || !nombre.trim()) {
            return { exito: false, mensaje: "El nombre del producto es obligatorio" };
        }

        if (Number.isNaN(precioNumerico) || precioNumerico <= 0) {
            return { exito: false, mensaje: "Ingresa un precio valido mayor a cero" };
        }

        if (Number.isNaN(stockNumerico) || stockNumerico < 0) {
            stockNumerico = 0;
        }

        if (imagenUrlLimpia && !/^https?:\/\//i.test(imagenUrlLimpia)) {
            return { exito: false, mensaje: "La URL de la imagen debe empezar con http:// o https://" };
        }

        const nuevo = new Producto({
            id: generarNuevoId(productos),
            nombre: nombre.trim(),
            descripcion: (descripcion || "").trim(),
            precio: precioNumerico,
            tipoIva,
            stock: stockNumerico,
            categoria,
            imagenUrl: imagenUrlLimpia
        });

        productos.push(nuevo);
        this.guardarTodos(productos);

        return { exito: true, mensaje: "Producto registrado con exito", producto: nuevo };
    }

    static eliminar(id) {
        const productos = this.obtenerTodos().filter((producto) => producto.id !== id);
        this.guardarTodos(productos);
        return { exito: true, mensaje: "Producto eliminado" };
    }

    static obtenerPorId(id) {
        return this.obtenerTodos().find((producto) => producto.id === id) ?? null;
    }

    static modificarStock(id, nuevoStock) {
        const productos = this.obtenerTodos();
        const stockNumerico = parseInt(nuevoStock, 10);

        if (Number.isNaN(stockNumerico) || stockNumerico < 0) {
            return { exito: false, mensaje: "El stock debe ser un numero valido" };
        }

        const producto = productos.find((item) => item.id === id);
        if (!producto) {
            return { exito: false, mensaje: "Producto no encontrado" };
        }

        producto.stock = stockNumerico;
        this.guardarTodos(productos);
        return { exito: true, mensaje: "Stock actualizado" };
    }

    static descontarStock(id, cantidad) {
        const productos = this.obtenerTodos();
        const producto = productos.find((item) => item.id === id);

        if (!producto) {
            return;
        }

        producto.descontarStock(cantidad);
        this.guardarTodos(productos);
    }

    static buscar(texto) {
        const textoMinuscula = texto.toLowerCase();
        return this.obtenerTodos().filter((producto) =>
            producto.nombre.toLowerCase().includes(textoMinuscula)
        );
    }

    static filtrarPorCategoria(productos, categoria) {
        if (categoria === "todos") {
            return productos;
        }
        return productos.filter((producto) => producto.categoria === categoria);
    }
}
