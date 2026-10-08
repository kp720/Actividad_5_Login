const formLogin = document.getElementById('form-login');
const inputUsuario = document.getElementById('username');
const inputPassword = document.getElementById('password');
const btnVerPassword = document.getElementById('btn-ver-password');

function mostrarError(input, feedbackId, mensaje) {
    document.getElementById(feedbackId).textContent = mensaje;
    input.classList.add('is-invalid');
}

function limpiarError(input) {
    input.classList.remove('is-invalid');
}

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

// Verifica que la contraseña no esté vacía y tenga más de 5 caracteres
function validarPassword(password) {
    if (password.length >= 6) {
        return true;
    } else {
        return false;
    }
}

// Devuelve '' si el usuario es válido, o el texto del error.
function validarUsuario(valor) {
    if (valor === '') return 'Ingresa tu usuario o correo.';

    if (valor.includes('@')) {
        return validarCorreo(valor)
            ? ''
            : 'El correo no es válido. Ejemplo: nombre@dominio.com';
    }

    if (/\s/.test(valor)) return 'El usuario no puede tener espacios.';
    if (valor.length < 3) return 'El usuario debe tener al menos 3 caracteres.';
    return '';
}

// Devuelve '' si la contraseña es válida, o el texto del error.
function validarClave(valor) {
    if (valor === '') return 'Ingresa tu contraseña.';
    return validarPassword(valor) ? '' : 'La contraseña no cumple los requisitos.';
}

// ---------- Envío del formulario ----------

formLogin.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = inputUsuario.value.trim();
    const password = inputPassword.value; // la contraseña no se recorta

    limpiarError(inputUsuario);
    limpiarError(inputPassword);

    const errorUsuario = validarUsuario(username);
    const errorPassword = validarClave(password);

    if (errorUsuario) mostrarError(inputUsuario, 'error-username', errorUsuario);
    if (errorPassword) mostrarError(inputPassword, 'error-password', errorPassword);

    // Si algo falló, enfoca el primer campo con error y no continúa
    if (errorUsuario) return inputUsuario.focus();
    if (errorPassword) return inputPassword.focus();

    // Si es correo toma lo anterior al @; si no, usa el usuario tal cual
    const base = username.includes('@') ? username.split('@')[0] : username;
    const nombreUsuario = capitalizarPalabras(base);

    localStorage.setItem('usuarioActivo', nombreUsuario);
    window.location.href = 'index.html';
});

// Quita el error de un campo en cuanto el usuario vuelve a escribir
inputUsuario.addEventListener('input', () => limpiarError(inputUsuario));
inputPassword.addEventListener('input', () => limpiarError(inputPassword));

// ---------- Mostrar / ocultar contraseña ----------

btnVerPassword.addEventListener('click', function () {
    const oculta = inputPassword.type === 'password';
    inputPassword.type = oculta ? 'text' : 'password';
    btnVerPassword.textContent = oculta ? 'Ocultar' : 'Mostrar';
    btnVerPassword.setAttribute('aria-pressed', String(oculta));
    btnVerPassword.setAttribute('aria-label', oculta ? 'Ocultar contraseña' : 'Mostrar contraseña');
});