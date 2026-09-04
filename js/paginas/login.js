import GestorUsuarios from "../servicios/GestorUsuarios.js";
import { notificar } from "../ui/Notificador.js";

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    const correoInput = document.getElementById("login-correo");
    const botonSubmit = formLogin.querySelector("button[type='submit']");
    const params = new URLSearchParams(window.location.search);
    const correo = params.get("correo");

    if (correo && correoInput) {
        correoInput.value = correo;
    }

    formLogin.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const correoForm = document.getElementById("login-correo").value;
        const contrasena = document.getElementById("login-contrasena").value;

        botonSubmit.disabled = true;
        botonSubmit.textContent = "Ingresando...";

        try {
            const resultado = await GestorUsuarios.iniciarSesion(correoForm, contrasena);
            notificar(resultado.mensaje, resultado.exito ? "exito" : "error");

            if (resultado.exito) {
                window.location.href = resultado.usuario.esAdmin ? "menu-admin.html" : "menu.html";
            }
        } finally {
            botonSubmit.disabled = false;
            botonSubmit.textContent = "Entrar";
        }
    });
});
