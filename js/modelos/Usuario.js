// Clase Usuario: la contrasena se guarda como hash, nunca en texto plano

export default class Usuario {
    constructor({ id, nombre, correo, contrasenaHash, fechaRegistro, esAdmin = false }) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.contrasenaHash = contrasenaHash;
        this.fechaRegistro = fechaRegistro || new Date().toISOString();
        this.esAdmin = esAdmin;
    }

    static desdeObjeto(obj) {
        return new Usuario(obj);
    }


    aDatosPublicos() {
        return {
            id: this.id,
            nombre: this.nombre,
            correo: this.correo,
            esAdmin: this.esAdmin
        };
    }
}
