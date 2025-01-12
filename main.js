const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { registerUser, loginUser, registerGasto, getGastos } = require('./database'); // Importar funciones de la base de datos

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, // Permitir Node.js en el renderizador
            contextIsolation: false // Desactivar aislamiento de contexto
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Eventos IPC para registro y login
ipcMain.on('register-user', (event, userData) => {
    console.log('Datos de usuario recibidos para registro:', userData);
    registerUser(userData, (success, message) => {
        console.log(success ? 'Usuario registrado con éxito.' : `Error al registrar usuario: ${message}`);
        event.reply('register-response', { success, message });
    });
});

ipcMain.on('login-user', (event, { correo, contraseña }) => {
    console.log('Intento de login:', { correo });
    loginUser(correo, contraseña, (success, message, user) => {
        console.log(success ? 'Login exitoso.' : `Error de login: ${message}`);
        event.reply('login-response', { success, message, user });
    });
});

// Evento IPC para registrar un gasto
ipcMain.on('register-gasto', (event, gastoData) => {
    console.log('Datos del gasto recibidos:', gastoData);
    registerGasto(gastoData, (success, message) => {
        console.log(success ? 'Gasto registrado con éxito.' : `Error al registrar gasto: ${message}`);
        event.reply('register-gasto-response', { success, message });
    });
});

// Evento IPC para obtener los gastos con filtros
ipcMain.on('get-gastos', (event, filtros) => {
    console.log('Filtros recibidos para obtener gastos:', filtros);
    getGastos(filtros, (success, data, message) => {
        if (success) {
            console.log('Datos de gastos obtenidos:', data);
            event.reply('get-gastos-response', { success, data });
        } else {
            console.error('Error al obtener los gastos:', message);
            event.reply('get-gastos-response', { success: false, message });
        }
    });
});