const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { registerUser, loginUser, registerGasto, getGastos, registerInversion,getInversiones,registerAdeudo,getAdeudos,registerIngreso,getIngresos,registerTarjeta,registerPago,getPagos,getTarjetas,registerDeuda,getDeudas,registerPresupuesto,getPresupuestosDetalles} = require('./database'); // Importar todas las funciones necesarias

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

ipcMain.on('get-pagos', (event, filtros) => {
    console.log('Filtros recibidos para obtener deuda:', filtros);
    getPagos(filtros, (success, data, message) => {
        if (success) {
            console.log('Datos de pagos obtenidas:', data);
            event.reply('get-pagos-response', { success, data });
        } else {
            console.error('Error al obtener las pagos:', message);
            event.reply('get-pagos-response', { success: false, message });
        }
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
    getPresupuestosDetalles(filtros, (success, data, message) => {
        if (success) {
            console.log('Datos de presupuestos obtenidas:', data);
            event.reply('get-presupuestos-response', { success, data });
        } else {
            console.error('Error al obtener las presupuestos:', message);
            event.reply('get-presupuestos-response', { success: false, message });
        }
    });
});

const PDFDocument = require('pdfkit');
const fs = require('fs');

function generarReporteQuincenal(datos, rangoFechas, filePath = './reporte-quincenal.pdf') {
    const doc = new PDFDocument();

    // Guardar el archivo
    doc.pipe(fs.createWriteStream(filePath));

    // Encabezado
    doc.fontSize(20).text('Reporte Financiero Quincenal', { align: 'center' });
    doc.fontSize(14).text(`Periodo: ${rangoFechas.inicio} - ${rangoFechas.fin}`, { align: 'center' });
    doc.moveDown();

    // Ingresos
    doc.fontSize(16).text('Ingresos', { underline: true });
    datos.ingresos.forEach((ingreso) => {
        doc.fontSize(12).text(`- ${ingreso.descripcion}: $${ingreso.monto.toFixed(2)} (${ingreso.fechaIngreso})`);
    });
    const totalIngresos = datos.ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0);
    doc.fontSize(12).text(`Total Ingresos: $${totalIngresos.toFixed(2)}`);
    doc.moveDown();

    // Gastos
    doc.fontSize(16).text('Gastos', { underline: true });
    datos.gastos.forEach((gasto) => {
        doc.fontSize(12).text(`- ${gasto.descripcion}: $${gasto.monto.toFixed(2)} (${gasto.fecha})`);
    });
    const totalGastos = datos.gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    doc.fontSize(12).text(`Total Gastos: $${totalGastos.toFixed(2)}`);
    doc.moveDown();

    // Adeudos
    doc.fontSize(16).text('Adeudos', { underline: true });
    datos.adeudos.forEach((adeudo) => {
        doc.fontSize(12).text(`- ${adeudo.descripcion}: $${adeudo.monto.toFixed(2)} (Vence: ${adeudo.vencimiento}, Estado: ${adeudo.estado})`);
    });
    const totalAdeudos = datos.adeudos.reduce((sum, adeudo) => sum + adeudo.monto, 0);
    doc.fontSize(12).text(`Total Adeudos: $${totalAdeudos.toFixed(2)}`);
    doc.moveDown();

    // Deudas
    doc.fontSize(16).text('Deudas', { underline: true });
    datos.deudas.forEach((deuda) => {
        doc.fontSize(12).text(`- ${deuda.descripcion}: $${deuda.monto.toFixed(2)} (Vence: ${deuda.fechaVencimiento}, Estado: ${deuda.estado}, Acreedor: ${deuda.acreedor})`);
    });
    const totalDeudas = datos.deudas.reduce((sum, deuda) => sum + deuda.monto, 0);
    doc.fontSize(12).text(`Total Deudas: $${totalDeudas.toFixed(2)}`);
    doc.moveDown();

    // Pagos con Tarjeta
    doc.fontSize(16).text('Pagos con Tarjeta', { underline: true });
    datos.pagosTarjeta.forEach((pago) => {
        doc.fontSize(12).text(`- ${pago.descripcion}: $${pago.monto.toFixed(2)} (Fecha límite: ${pago.plazoPago}, Acreedor: ${pago.acreedor})`);
    });
    const totalPagosTarjeta = datos.pagosTarjeta.reduce((sum, pago) => sum + pago.monto, 0);
    doc.fontSize(12).text(`Total Pagos con Tarjeta: $${totalPagosTarjeta.toFixed(2)}`);
    doc.moveDown();

    // Resumen final
    const balance = totalIngresos - (totalGastos + totalAdeudos + totalDeudas + totalPagosTarjeta);
    doc.fontSize(16).text('Resumen Final', { underline: true });
    doc.fontSize(12).text(`Balance Quincenal: $${balance.toFixed(2)}`);
    doc.moveDown();

    // Finalizar y guardar
    doc.end();
    console.log(`Reporte generado en: ${filePath}`);
    
}

// Datos de ejemplo
const datosEjemplo = {
    ingresos: [
        { descripcion: 'Salario', monto: 15000, fechaIngreso: '2025-01-01' },
        { descripcion: 'Venta', monto: 2000, fechaIngreso: '2025-01-10' },
    ],
    gastos: [
        { descripcion: 'Renta', monto: 7000, fecha: '2025-01-05' },
        { descripcion: 'Supermercado', monto: 2500, fecha: '2025-01-08' },
    ],
    adeudos: [
        { descripcion: 'Pago servicio', monto: 1200, vencimiento: '2025-01-14', estado: 'Pendiente' },
    ],
    deudas: [
        { descripcion: 'Préstamo', monto: 5000, fechaVencimiento: '2025-01-12', estado: 'Pendiente', acreedor: 'Banco XYZ' },
    ],
    pagosTarjeta: [
        { descripcion: 'Pago mensualidad', monto: 3000, plazoPago: '2025-01-15', acreedor: 'Banco ABC' },
    ],
};


const rangoFechas = { inicio: '2025-01-01', fin: '2025-01-15' };

//generarReporteQuincenal(datosEjemplo,rangoFechas);

function openPDF(filePath){
    let pdfWindow = new BrowserWindow({
        icon: './build/icon.png',
        width: 1200,
        height: 800,
        webPreferences: {
            plugins: true
        }
    });

    pdfWindow.loadURL(require('url').format({
        pathname: filePath,
        protocol: 'file:',
        slashes: true
    }));

    pdfWindow.setMenu(null);

    pdfWindow.on("closed", function () {
        pdfWindow = null
    });
}

ipcMain.on('generar-reporte', (event, data) => {
    console.log('Generando reporte con datos:', data);

    const filtros={id_usuario: data.id_usuario};

    var ingresos,gastos,adeudos,deudas,pagosTarjeta;

    getIngresos(filtros, (success, data, message) => {
        ingresos = data;
    });
    getGastos(filtros, (success, data, message) => {
        gastos = data;
    });
    getAdeudos(filtros, (success, data, message) => {
        adeudos = data;
    });
    getDeudas(filtros, (success, data, message) => {
        deudas = data;
    });
    getPagos(filtros, (success, data, message) => {
        pagosTarjeta = data;
    });

    function calcularRangoQuincena(data) {
        const inicio = `${data.ano}-${String(data.mes).padStart(2, '0')}-${data.quincena === 1 ? '01' : '16'}`;
        const fin =
            data.quincena === 1
                ? `${data.ano}-${String(data.mes).padStart(2, '0')}-15`
                : `${data.ano}-${String(data.mes).padStart(2, '0')}-${new Date(data.ano, data.mes, 0).getDate()}`; // Último día del mes
        return { inicio, fin };
    }
    
    // Función para verificar si una fecha está dentro de un rango
    function estaEnRango(fecha, inicio, fin) {
        return fecha >= inicio && fecha <= fin;
    }
    
    // Datos del usuario
    const rango = calcularRangoQuincena(data);
    
    setTimeout(()=>{

        // Filtrar los ingresos, gastos, adeudos, deudas y pagos de tarjeta
        ingresos = ingresos.filter((ingreso) =>
            estaEnRango(ingreso.fechaIngreso, rango.inicio, rango.fin)
        );
        
        gastos = gastos.filter((gasto) =>
            estaEnRango(gasto.fecha, rango.inicio, rango.fin)
        );
        
        adeudos = adeudos.filter((adeudo) =>
            estaEnRango(adeudo.vencimiento, rango.inicio, rango.fin)
        );
        
        deudas = deudas.filter((deuda) =>
            estaEnRango(deuda.fechaVencimiento, rango.inicio, rango.fin)
        );
        
        pagosTarjeta = pagosTarjeta.filter((pago) =>
            estaEnRango(pago.plazoPago, rango.inicio, rango.fin)
        );
        
        // Salida de prueba
        /* console.log('Ingresos Filtrados:', ingresosFiltrados);
        console.log('Gastos Filtrados:', gastosFiltrados);
        console.log('Adeudos Filtrados:', adeudosFiltrados);
        console.log('Deudas Filtradas:', deudasFiltradas);
        console.log('Pagos con Tarjeta Filtrados:', pagosTarjetaFiltrados); */

        generarReporteQuincenal({
            ingresos,gastos,adeudos,deudas,pagosTarjeta
            },rango);

        openPDF('./reporte-quincenal.pdf');

    },5000);

});