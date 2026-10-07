// 0. Cargar el usuario del Login en el Navbar
document.addEventListener("DOMContentLoaded", function() {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    const navbarUsuario = document.getElementById('nombreUsuarioNavbar');
    
    if (usuarioGuardado) {
        navbarUsuario.textContent = usuarioGuardado;
    } else {
        // Opcional: si alguien intenta entrar al index directo sin loguearse, lo regresa
        window.location.href = 'login.html';
    }
});
// 1. Lógica del Botón Hamburguesa (Sidebar)
const menuToggle = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');

menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    wrapper.classList.toggle('toggled');
});

// 2. Lógica de Captura de Usuarios (Validando con utileria.js)
const formUsuarios = document.getElementById('form-usuarios');

formUsuarios.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const correo = document.getElementById('correoUsuario').value;
    const password = document.getElementById('passwordUsuario').value;

    // Aquí llamamos a las funciones de tu librería utileria.js
    const correoValido = validarCorreo(correo);
    const passwordValido = validarPassword(password);

    if (correoValido && passwordValido) {
        alert("Usuario capturado y validado correctamente.");
        formUsuarios.reset();
    } else {
        alert("Error en la validación. Revisa el correo y la contraseña.");
    }
});

// 3. Lógica de Alumnos (Número de Control y Modal de Edad)
const formAlumnos = document.getElementById('form-alumnos');
const modalEdad = new bootstrap.Modal(document.getElementById('modalEdad')); // Instancia del modal de Bootstrap
const mensajeModal = document.getElementById('mensajeModalEdad');

formAlumnos.addEventListener('submit', function(e) {
    e.preventDefault();

    const numControl = document.getElementById('numControl').value;
    const edad = parseInt(document.getElementById('edadAlumno').value);

    // Validación del Número de Control (exactamente 6 dígitos)
    if (numControl.length !== 6) {
        alert("El número de control debe tener exactamente 6 dígitos.");
        return; // Detiene la ejecución si no cumple
    }

    // Validación de Edad para el Modal
    if (edad >= 18) {
        mensajeModal.textContent = "✅ El alumno ingresado es MAYOR de edad.";
        mensajeModal.className = "fs-5 text-success fw-bold";
    } else {
        mensajeModal.textContent = "❌ El alumno ingresado es MENOR de edad.";
        mensajeModal.className = "fs-5 text-danger fw-bold";
    }

    // Disparar el modal
    modalEdad.show();
    formAlumnos.reset();
});