// Clase Producto: guarda los datos de un producto y calcula el IVA/precio final

const PORCENTAJES_IVA = Object.freeze({
    basico: 22,
    minimo: 10,
    exento: 0
});

const TEXTOS_IVA = Object.freeze({
    basico: "IVA basico (22%)",
    minimo: "IVA minimo (10%)",
    exento: "Exento de IVA"
});

const TEXTOS_CATEGORIA = Object.freeze({
    celular: "Celulares",
    accesorio: "Accesorios"
});

const IMAGEN_POR_DEFECTO = "img/placeholder.svg";

export default class Producto {
    constructor({ id, nombre, descripcion = "", precio, tipoIva, stock, categoria, fechaAlta, imagenUrl = "" }) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.tipoIva = tipoIva;
        this.stock = stock;
        this.categoria = categoria;
        this.fechaAlta = fechaAlta || new Date().toISOString();
        this.imagenUrl = imagenUrl;
    }

    
    static desdeObjeto(obj) {
        return new Producto(obj);
    }

    get porcentajeIva() {
        return PORCENTAJES_IVA[this.tipoIva] ?? 0;
    }

    get montoIva() {
        return this.precio * this.porcentajeIva / 100;
    }

    get precioFinal() {
        return this.precio + this.montoIva;
    }

    get textoCategoria() {
        return TEXTOS_CATEGORIA[this.categoria] ?? "Sin categoria";
    }

    get textoIva() {
        return TEXTOS_IVA[this.tipoIva] ?? "IVA no definido";
    }

    get hayStock() {
        return this.stock > 0;
    }


    get imagenMostrar() {
        return this.imagenUrl && this.imagenUrl.trim() ? this.imagenUrl.trim() : IMAGEN_POR_DEFECTO;
    }

    descontarStock(cantidad) {
        this.stock = Math.max(0, this.stock - cantidad);
    }
}
