import { guardarEnStorage, leerDeStorage } from "./Storage.js";
import Venta from "../modelos/Venta.js";

const CLAVE_VENTAS = "ventas";

export default class GestorVentas {
    static obtenerTodas() {
        return leerDeStorage(CLAVE_VENTAS, []).map(Venta.desdeObjeto);
    }

    static guardarTodas(ventas) {
        guardarEnStorage(CLAVE_VENTAS, ventas);
    }

    static agregar(venta) {
        const ventas = this.obtenerTodas();
        ventas.push(venta);
        this.guardarTodas(ventas);
    }
}
