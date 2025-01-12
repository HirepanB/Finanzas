const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { registerUser, loginUser } = require('./database'); // Importar funciones de la base de datos

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
  registerUser(userData, (success, message) => {
    event.reply('register-response', { success, message }); // Responder al renderizador
  });
});

ipcMain.on('login-user', (event, { correo, contraseña }) => {
  loginUser(correo, contraseña, (success, message, user) => {
    event.reply('login-response', { success, message, user }); // Responder al renderizador
  });
});