// Venta

export default class Venta {
    constructor({ id, usuarioId, usuarioNombre, fecha, items, cantidadTotal, subtotal, iva, total }) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.fecha = fecha || new Date().toISOString();
        this.items = items;
        this.cantidadTotal = cantidadTotal;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
    }

    static desdeObjeto(obj) {
        return new Venta(obj);
    }

    get fechaLegible() {
        return new Date(this.fecha).toLocaleString("es-UY");
    }
}
