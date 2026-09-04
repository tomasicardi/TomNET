//Guardar y lee datos de localStorage

export function guardarEnStorage(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        console.error(`No se pudo guardar "${clave}" en localStorage:`, error);
        return false;
    }
}

export function leerDeStorage(clave, valorPorDefecto) {
    const texto = localStorage.getItem(clave);
    if (!texto) {
        return valorPorDefecto;
    }

    try {
        return JSON.parse(texto);
    } catch (error) {
        console.error(`El valor guardado en "${clave}" esta corrupto, se descarta.`, error);
        return valorPorDefecto;
    }
}

export function eliminarDeStorage(clave) {
    localStorage.removeItem(clave);
}

export function generarNuevoId(lista) {
    if (!lista || lista.length === 0) {
        return 1;
    }
    const maximo = Math.max(...lista.map((elemento) => elemento.id || 0));
    return maximo + 1;
}
