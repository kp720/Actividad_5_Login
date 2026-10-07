// Expresión regular para verificar que el correo tenga formato correcto
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