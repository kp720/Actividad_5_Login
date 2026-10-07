const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Uso de utileria.js
    if (validarCorreo(username) && validarPassword(password)) {
        
        // Extrae el nombre antes del @ si es correo, o deja el usuario normal
        const nombreUsuario = username.includes('@') ? username.split('@')[0] : username;
        
        // Guarda en localStorage
        localStorage.setItem('usuarioActivo', nombreUsuario);
        
        // Redirige al sistema
        window.location.href = 'index.html';
    } else {
        alert("Error: Correo inválido o la contraseña debe tener al menos 6 caracteres.");
    }
});