// Funciones de seguridad basica: hash de contrasenas
// y un control de intentos fallidos de login.


export async function hashTexto(texto) {
    const datosCodificados = new TextEncoder().encode(texto);
    const bufferHash = await crypto.subtle.digest("SHA-256", datosCodificados);
    return Array.from(new Uint8Array(bufferHash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

const MAPA_ESCAPE = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
};


export function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (caracter) => MAPA_ESCAPE[caracter]);
}

const CLAVE_INTENTOS = "intentosLoginFallidos";
const MAX_INTENTOS = 5;
const BLOQUEO_MS = 30_000;

// Bloquea el login 30 segundos despues de 5 intentos fallidos
export const ControlDeIntentos = {
    _leer() {
        try {
            return JSON.parse(sessionStorage.getItem(CLAVE_INTENTOS)) || { fallos: 0, bloqueadoHasta: 0 };
        } catch {
            return { fallos: 0, bloqueadoHasta: 0 };
        }
    },
    _guardar(estado) {
        sessionStorage.setItem(CLAVE_INTENTOS, JSON.stringify(estado));
    },
    estaBloqueado() {
        const { bloqueadoHasta } = this._leer();
        return Date.now() < bloqueadoHasta;
    },
    segundosRestantes() {
        const { bloqueadoHasta } = this._leer();
        return Math.max(0, Math.ceil((bloqueadoHasta - Date.now()) / 1000));
    },
    registrarFallo() {
        const estado = this._leer();
        estado.fallos += 1;
        if (estado.fallos >= MAX_INTENTOS) {
            estado.bloqueadoHasta = Date.now() + BLOQUEO_MS;
            estado.fallos = 0;
        }
        this._guardar(estado);
    },
    reiniciar() {
        this._guardar({ fallos: 0, bloqueadoHasta: 0 });
    }
};
