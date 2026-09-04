import { guardarEnStorage, leerDeStorage, eliminarDeStorage, generarNuevoId } from "./Storage.js";
import { hashTexto, ControlDeIntentos } from "./Seguridad.js";
import Usuario from "../modelos/Usuario.js";

const CLAVE_USUARIOS = "usuarios";
const CLAVE_SESION = "usuarioActual";

// Se guarda el hash de la contrasena del admin, no el texto plano
const ADMIN_CORREO = "admin@tienda.com";
const ADMIN_CONTRASENA_HASH = "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270"; //("admin1234")

export default class GestorUsuarios {
    static obtenerTodos() {
        return leerDeStorage(CLAVE_USUARIOS, []).map(Usuario.desdeObjeto);
    }

    static guardarTodos(usuarios) {
        guardarEnStorage(CLAVE_USUARIOS, usuarios);
    }

    static async registrar(nombre, correo, contrasena) {
        const usuarios = this.obtenerTodos();

        if (!nombre?.trim() || !correo?.trim() || !contrasena) {
            return { exito: false, mensaje: "Completa todos los campos" };
        }

        const correoNormalizado = correo.trim().toLowerCase();
        const yaExiste = usuarios.some((usuario) => usuario.correo === correoNormalizado)
            || correoNormalizado === ADMIN_CORREO;

        if (yaExiste) {
            return { exito: false, mensaje: "Ese correo ya esta registrado" };
        }

        if (contrasena.length < 6) {
            return { exito: false, mensaje: "La contrasena debe tener al menos 6 caracteres" };
        }

        const contrasenaHash = await hashTexto(contrasena);
        const nuevo = new Usuario({
            id: generarNuevoId(usuarios),
            nombre: nombre.trim(),
            correo: correoNormalizado,
            contrasenaHash
        });

        usuarios.push(nuevo);
        this.guardarTodos(usuarios);

        return { exito: true, mensaje: "Usuario registrado con exito" };
    }

    static async iniciarSesion(correo, contrasena) {
        if (ControlDeIntentos.estaBloqueado()) {
            return {
                exito: false,
                mensaje: `Demasiados intentos fallidos. Proba de nuevo en ${ControlDeIntentos.segundosRestantes()} segundos.`
            };
        }

        const correoNormalizado = (correo || "").trim().toLowerCase();
        const contrasenaHash = await hashTexto(contrasena || "");

        if (correoNormalizado === ADMIN_CORREO && contrasenaHash === ADMIN_CONTRASENA_HASH) {
            const sesionAdmin = new Usuario({
                id: 0,
                nombre: "Administrador",
                correo: ADMIN_CORREO,
                contrasenaHash: ADMIN_CONTRASENA_HASH,
                esAdmin: true
            });
            guardarEnStorage(CLAVE_SESION, sesionAdmin.aDatosPublicos());
            ControlDeIntentos.reiniciar();
            return { exito: true, mensaje: "Sesion de administrador iniciada", usuario: sesionAdmin };
        }

        const usuarios = this.obtenerTodos();
        const usuario = usuarios.find(
            (item) => item.correo === correoNormalizado && item.contrasenaHash === contrasenaHash
        );

        if (!usuario) {
            ControlDeIntentos.registrarFallo();
            return { exito: false, mensaje: "Correo o contrasena incorrectos" };
        }

        guardarEnStorage(CLAVE_SESION, usuario.aDatosPublicos());
        ControlDeIntentos.reiniciar();
        return { exito: true, mensaje: "Sesion iniciada", usuario };
    }

    static cerrarSesion() {
        eliminarDeStorage(CLAVE_SESION);
    }

    static obtenerSesion() {
        return leerDeStorage(CLAVE_SESION, null);
    }

    static haySesion() {
        return this.obtenerSesion() !== null;
    }
}
