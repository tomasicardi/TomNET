// Consume la API publica de DolarApi para mostrar la cotizacion del dolar

import { guardarEnStorage, leerDeStorage } from "./Storage.js";

const ENDPOINT_COTIZACION = "https://uy.dolarapi.com/v1/cotizaciones/usd";
const CLAVE_CACHE = "cotizacionUsdCache";
const DURACION_CACHE_MS = 30 * 60 * 1000; 


export async function obtenerCotizacionUsd() {
    const cache = leerDeStorage(CLAVE_CACHE, null);
    const cacheVigente = cache && (Date.now() - cache.guardadoEn) < DURACION_CACHE_MS;

    if (cacheVigente) {
        return { ...cache.datos, deCache: true };
    }

    try {
        const respuesta = await fetch(ENDPOINT_COTIZACION);

        if (!respuesta.ok) {
            throw new Error(`El servicio de cotizacion respondio con estado ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        guardarEnStorage(CLAVE_CACHE, { guardadoEn: Date.now(), datos });

        return { ...datos, deCache: false };
    } catch (error) {
        console.error("No se pudo obtener la cotizacion actualizada:", error);

        if (cache) {
            return { ...cache.datos, deCache: true, expirada: true };
        }

        throw error;
    }
}


export function convertirAPesos(montoEnPesos, cotizacionVenta) {
    return montoEnPesos / cotizacionVenta;
}
