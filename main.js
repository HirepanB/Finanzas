const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { registerUser, loginUser, registerGasto, getGastos, registerInversion,getInversiones,registerAdeudo,getAdeudos,registerIngreso,getIngresos,registerTarjeta,registerPago,getTarjetas,registerDeuda,getDeudas,registerPresupuesto} = require('./database'); // Importar todas las funciones necesarias

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

// Evento IPC para registrar una inversión
ipcMain.on('register-inversion', (event, inversionData) => {
    console.log('Datos de la inversión recibidos:', inversionData);

    registerInversion(inversionData, (success, message) => {
        if (success) {
            console.log('Inversión registrada con éxito.');
            event.reply('register-inversion-response', { success, message });
        } else {
            console.error('Error al registrar la inversión:', message);
            event.reply('register-inversion-response', { success: false, message });
        }
    });
});

ipcMain.on('get-inversiones', (event, filtros) => {
    console.log('Filtros recibidos para obtener inversiones:', filtros);
    getInversiones(filtros, (success, data, message) => {
        if (success) {
            console.log('Datos de inversiones obtenidas:', data);
            event.reply('get-inversiones-response', { success, data });
        } else {
            console.error('Error al obtener las inversiones:', message);
            event.reply('get-inversiones-response', { success: false, message });
        }
    });
});

// Evento IPC para registrar un adeudo
ipcMain.on('register-adeudo', (event, adeudoData) => {
    console.log('Datos del adeudo recibidos:', adeudoData);

    registerAdeudo(adeudoData, (success, message) => {
        if (success) {
            console.log('Adeudo registrado con éxito.');
            event.reply('register-adeudo-response', { success, message });
        } else {
            console.error('Error al registrar el adeudo:', message);
            event.reply('register-adeudo-response', { success: false, message });
        }
    });
});

ipcMain.on('get-adeudos', (event, filtros) => {
    console.log('Filtros recibidos para obtener deuda:', filtros);
    getAdeudos(filtros, (success, data, message) => {
        if (success) {
            console.log('Datos de adeudos obtenidas:', data);
            event.reply('get-adeudos-response', { success, data });
        } else {
            console.error('Error al obtener las adeudos:', message);
            event.reply('get-adeudos-response', { success: false, message });
        }
    });
});

// Evento IPC para registrar un ingreso
ipcMain.on('register-ingreso', (event, ingresoData) => {
    console.log('Datos del ingreso recibidos:', ingresoData);
    registerIngreso(ingresoData, (success, message) => {
        if (success) {
            console.log('Ingreso registrado con éxito.');
            event.reply('register-ingreso-response', { success, message });
        } else {
            console.error('Error al registrar el ingreso:', message);
            event.reply('register-ingreso-response', { success: false, message });
        }
    });
});

ipcMain.on('get-ingresos', (event, filtros) => {
    console.log('Filtros recibidos para obtener ingresos:', filtros);
    getIngresos(filtros, (success, data, message) => {
        if (success) {
            console.log('Datos de Ingresos obtenidas:', data);
            event.reply('get-ingresos-response', { success, data });
        } else {
            console.error('Error al obtener las Ingresos:', message);
            event.reply('get-ingresos-response', { success: false, message });
        }
    });
});

// Evento para registrar tarjeta
ipcMain.on('register-tarjeta', (event, tarjetaData) => {
    registerTarjeta(tarjetaData, (success, message) => {
        event.reply('register-tarjeta-response', { success, message });
    });
});

// Obtener tarjetas del usuario
ipcMain.on('get-tarjetas', (event, { id_usuario }) => {
    getTarjetas(id_usuario, (success, data, message) => {
        event.reply('get-tarjetas-response', { success, data, message });
    });
});

// Registrar un pago
ipcMain.on('register-pago', (event, pagoData) => {
    registerPago(pagoData, (success, message) => {
        event.reply('register-pago-response', { success, message });
    });
});

// Evento IPC para registrar una deuda
ipcMain.on('register-deuda', (event, data) => {
    console.log('Datos de la deuda recibidos:', data);
    registerDeuda(data, (success, message) => {
        console.log(success ? 'deuda registrada con éxito.' : `Error al registrar deuda: ${message}`);
        event.reply('register-deuda-response', { success, message });
    });
});

// Evento IPC para obtener las deudas
ipcMain.on('get-deudas', (event, filtros) => {
    console.log('Filtros recibidos para obtener deuda:', filtros);
    getDeudas(filtros, (success, data, message) => {
        if (success) {
            console.log('Datos de deudas obtenidas:', data);
            event.reply('get-deudas-response', { success, data });
        } else {
            console.error('Error al obtener las deudas:', message);
            event.reply('get-deudas-response', { success: false, message });
        }
    });
});

ipcMain.on('register-presupuesto', (event, data) => {
    console.log('Datos de la presupuesto recibidos:', data);
    registerPresupuesto(data, (success, message) => {
        console.log(success ? 'presupuesto registrada con éxito.' : `Error al registrar presupuesto: ${message}`);
        event.reply('register-presupuesto-response', { success, message });
    });
});

ipcMain.on('get-presupuestos', (event, filtros) => {
    console.log('Filtros recibidos para obtener deuda:', filtros);
    getPresupuestos(filtros, (success, data, message) => {
        if (success) {
            console.log('Datos de presupuestos obtenidas:', data);
            event.reply('get-presupuestos-response', { success, data });
        } else {
            console.error('Error al obtener las presupuestos:', message);
            event.reply('get-presupuestos-response', { success: false, message });
        }
    });
});