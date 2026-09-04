import GestorUsuarios from "../servicios/GestorUsuarios.js";
import { notificar } from "../ui/Notificador.js";

document.addEventListener("DOMContentLoaded", () => {
    const formRegistro = document.getElementById("form-registro");
    const botonSubmit = formRegistro.querySelector("button[type='submit']");

    formRegistro.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const nombre = document.getElementById("registro-nombre").value;
        const correo = document.getElementById("registro-correo").value;
        const contrasena = document.getElementById("registro-contrasena").value;

        botonSubmit.disabled = true;
        botonSubmit.textContent = "Registrando...";

        try {
            const resultado = await GestorUsuarios.registrar(nombre, correo, contrasena);
            notificar(resultado.mensaje, resultado.exito ? "exito" : "error");

            if (resultado.exito) {
                window.location.href = `login.html?correo=${encodeURIComponent(correo)}`;
            }
        } finally {
            botonSubmit.disabled = false;
            botonSubmit.textContent = "Registrarme";
        }
    });
});
