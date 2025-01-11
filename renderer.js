const { ipcRenderer } = require('electron');

// Registro de usuario
document.getElementById('register-button').addEventListener('click', () => {
    const userData = {
        nombre: document.getElementById('nombre').value,
        apellidoPaterno: document.getElementById('apellidoPaterno').value,
        apellidoMaterno: document.getElementById('apellidoMaterno').value,
        correo: document.getElementById('correo').value,
        contraseña: document.getElementById('contraseña').value,
        telefono: document.getElementById('telefono').value,
    };

    ipcRenderer.send('register-user', userData);

    ipcRenderer.once('register-response', (event, response) => {
        if (response.success) {
            alert('Usuario registrado con éxito');
        } else {
            alert(`Error: ${response.message}`);
        }
    });
});

// Login de usuario
document.getElementById('login-button').addEventListener('click', () => {
    const loginData = {
        correo: document.getElementById('login-correo').value,
        contraseña: document.getElementById('login-contraseña').value,
    };

    ipcRenderer.send('login-user', loginData);

    ipcRenderer.once('login-response', (event, response) => {
        if (response.success) {
            alert('Inicio de sesión exitoso');
        } else {
            alert(`Error: ${response.message}`);
        }
    });
});