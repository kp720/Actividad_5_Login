// 0. Cargar el usuario del Login en el Navbar
const usuarioGuardado = localStorage.getItem('usuarioActivo');

if (usuarioGuardado) {
    document.getElementById('nombreUsuarioNavbar').textContent = usuarioGuardado;
} else {
    window.location.replace('login.html');
}

// Cerrar sesión: borra el usuario guardado
document.getElementById('btn-cerrar-sesion').addEventListener('click', function () {
    localStorage.removeItem('usuarioActivo');
});

// 1. Lógica del Botón Hamburguesa (Sidebar)
const menuToggle = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');

menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    wrapper.classList.toggle('toggled');
});

// ---------- Helpers de interfaz ----------
function mostrarError(input, mensaje) {
    input.closest('.campo').querySelector('.invalid-feedback').textContent = mensaje;
    input.classList.add('is-invalid');
}

function limpiarErrores(form) {
    form.querySelectorAll('.is-invalid').forEach(i => i.classList.remove('is-invalid'));
}

function enfocarPrimerError(form) {
    const primero = form.querySelector('.is-invalid');
    if (primero) primero.focus();
}

// Quita el error de un campo en cuanto el usuario vuelve a escribir
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('input', e => e.target.classList.remove('is-invalid'));
});

// "YYYY-MM-DD" -> Date en hora local (evita el desfase de un día por zona horaria)
function fechaLocal(valor) {
    const [anio, mes, dia] = valor.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
}

// 2. Lógica de Captura de Usuarios (Validando con utileria.js)
const formUsuarios = document.getElementById('form-usuarios');
const inputNombre = document.getElementById('nombreUsuario');
const inputCorreo = document.getElementById('correoUsuario');
const inputTelefono = document.getElementById('telefonoUsuario');
const inputPassword = document.getElementById('passwordUsuario');
const resultadoUsuario = document.getElementById('resultado-usuario');

// Al salir del campo, normaliza lo que el usuario escribió
inputNombre.addEventListener('blur', function () {
    if (soloLetras(inputNombre.value)) {
        inputNombre.value = capitalizarPalabras(inputNombre.value);
    }
});

inputTelefono.addEventListener('blur', function () {
    const formateado = formatearTelefono(inputTelefono.value);
    if (formateado) inputTelefono.value = formateado;
});

formUsuarios.addEventListener('submit', function(e) {
    e.preventDefault();
    
    limpiarErrores(formUsuarios);
    resultadoUsuario.classList.add('d-none');

    const nombre = inputNombre.value.trim();
    const correo = document.getElementById('correoUsuario').value;
    const telefono = formatearTelefono(inputTelefono.value);
    const password = document.getElementById('passwordUsuario').value;

    if (nombre === '') {
        mostrarError(inputNombre, 'Ingresa el nombre.');
    } else if (!soloLetras(nombre)) {
        mostrarError(inputNombre, 'El nombre solo puede tener letras y espacios.');
    }

    if (correo === '') {
        mostrarError(inputCorreo, 'Ingresa el correo electrónico.');
    } else if (!validarCorreo(correo)) {
        mostrarError(inputCorreo, 'El correo no es válido. Ejemplo: nombre@dominio.com');
    }

    if (!telefono) {
        mostrarError(inputTelefono, 'Ingresa un teléfono de 10 dígitos.');
    }

    if (password === '') {
        mostrarError(inputPassword, 'Ingresa la contraseña.');
    } else if (!validarPassword(password)) {
        mostrarError(inputPassword, 'La contraseña no cumple los requisitos.');
    }

    if (formUsuarios.querySelector('.is-invalid')) {
        enfocarPrimerError(formUsuarios);
        return;
    }

    resultadoUsuario.textContent =
        'Datos válidos. Nombre: ' + capitalizarPalabras(nombre) +
        '. Correo: ' + correo +
        '. Teléfono: ' + telefono + '.';
    resultadoUsuario.classList.remove('d-none');
    formUsuarios.reset();
});

// 3. Lógica de Alumnos (Número de Control y Modal de Edad)
const formAlumnos = document.getElementById('form-alumnos');
const inputNombreAlumno = document.getElementById('nombreAlumno');
const inputNumControl = document.getElementById('numControl');
const inputFecha = document.getElementById('fechaNacimiento');
const modalEdad = new bootstrap.Modal(document.getElementById('modalEdad')); 
const resumenModal = document.getElementById('resumenModalAlumno');
const mensajeModal = document.getElementById('mensajeModalEdad');

// La fecha de nacimiento no puede ser posterior a hoy
const hoy = new Date();
inputFecha.max = hoy.getFullYear() + '-' +
    String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
    String(hoy.getDate()).padStart(2, '0');

inputNombreAlumno.addEventListener('blur', function () {
    if (soloLetras(inputNombreAlumno.value)) {
        inputNombreAlumno.value = capitalizarPalabras(inputNombreAlumno.value);
    }
});

formAlumnos.addEventListener('submit', function(e) {
    e.preventDefault();
    limpiarErrores(formAlumnos);

    const nombre = inputNombreAlumno.value.trim();
    const numControl = inputNumControl.value.trim();
    const edad = NaN;
    const fecha = inputFecha.value;


    // Nombre
    if (nombre === '') {
        mostrarError(inputNombreAlumno, 'Ingresa el nombre del alumno.');
    } else if (!soloLetras(nombre)) {
        mostrarError(inputNombreAlumno, 'El nombre solo puede tener letras y espacios.');
    }

    /// Número de control: solo números y exactamente 8 dígitos
    if (numControl === '') {
        mostrarError(inputNumControl, 'Ingresa el número de control.');
    } else if (!/^\d+$/.test(numControl)) {
        mostrarError(inputNumControl, 'Solo se permiten números.');
    } else if (!validarLongitud(numControl, 8)) {
        mostrarError(inputNumControl, 'No puede tener más de 8 dígitos.');
    } else if (numControl.length < 8) {
        mostrarError(inputNumControl, 'Debe tener exactamente 8 dígitos.');
    }

    // Fecha de nacimiento
    if (fecha === '') {
        mostrarError(inputFecha, 'Ingresa la fecha de nacimiento.');
    } else {
        edad = calcularEdad(fechaLocal(fecha));
        if (isNaN(edad)) {
            mostrarError(inputFecha, 'La fecha no es válida.');
        } else if (edad < 0) {
            mostrarError(inputFecha, 'La fecha no puede ser futura.');
        } else if (edad > 100) {
            mostrarError(inputFecha, 'Revisa la fecha de nacimiento.');
        }
    }

    if (formAlumnos.querySelector('.is-invalid')) {
        enfocarPrimerError(formAlumnos);
        return;
    }

    // Resultado en el modal
    const esMayor = esMayorDeEdad(fechaLocal(fecha));
    resumenModal.textContent =
        capitalizarPalabras(nombre) + ', número de control ' + numControl +
        ', ' + edad + (edad === 1 ? ' año.' : ' años.');

    mensajeModal.textContent = esMayor
        ? 'El alumno es mayor de edad.'
        : 'El alumno es menor de edad.';
    mensajeModal.className = 'modal-estado ' + (esMayor ? 'estado-mayor' : 'estado-menor');

    modalEdad.show();
    formAlumnos.reset();
});


