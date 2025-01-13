const sqlite3 = require('sqlite3').verbose();
const { createDB } = require('./createDB.js');
const bcrypt = require('bcrypt');

// Crear o abrir la base de datos
const db = new sqlite3.Database('./finanzas.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a SQLite.');
        createDB(db); // Crear las tablas si no existen
    }
});

// Función para registrar un usuario
function registerUser(data, callback) {
    const sql = `
        INSERT INTO usuarios (nombre, apellidoPaterno, apellidoMaterno, correo, contraseña, telefono)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    bcrypt.hash(data.contraseña, 10, (err, hash) => {
        if (err) {
            console.error('Error al generar el hash:', err.message);
            callback(false, 'Error interno del servidor');
        } else {
            db.run(sql, [
                data.nombre,
                data.apellidoPaterno,
                data.apellidoMaterno,
                data.correo,
                hash,
                data.telefono,
            ], function (err) {
                if (err) {
                    console.error('Error al registrar el usuario:', err.message);
                    callback(false, err.message);
                } else {
                    console.log('Usuario registrado con éxito, ID:', this.lastID);
                    callback(true, 'Usuario registrado con éxito');
                }
            });
        }
    });
}

// Función para autenticar un usuario
function loginUser(correo, contraseña, callback) {
    const sql = 'SELECT * FROM usuarios WHERE correo = ?';

    db.get(sql, [correo], (err, row) => {
        if (err) {
            console.error('Error al buscar el usuario:', err.message);
            callback(false, err.message);
        } else if (row) {
            bcrypt.compare(contraseña, row.contraseña, (err, result) => {
                if (result) {
                    console.log('Login exitoso:', row);
                    callback(true, 'Login exitoso', JSON.stringify(row));
                } else {
                    console.log('Contraseña incorrecta.');
                    callback(false, 'Correo o contraseña incorrectos');
                }
            });
        } else {
            console.log('Correo no encontrado.');
            callback(false, 'Correo o contraseña incorrectos');
        }
    });
}

// Función para registrar un gasto
function registerGasto(data, callback) {
    const sql = `
        INSERT INTO Gastos (id_usuario, monto, fecha, descripcion, id_categoria)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [
        data.id_usuario,
        data.monto,
        data.fecha,
        data.descripcion,
        data.id_categoria
    ], function (err) {
        if (err) {
            console.error('Error al registrar el gasto:', err.message);
            callback(false, err.message);
        } else {
            console.log('Gasto registrado con éxito, ID:', this.lastID);
            callback(true, 'Gasto registrado con éxito');
        }
    });
}

// Función para obtener gastos con filtros
function getGastos(filtros, callback) {
    let sql = `
        SELECT G.id_gasto, G.monto, G.fecha, G.descripcion, C.nombreCategoria AS categoria
        FROM Gastos G
        JOIN Categorias C ON G.id_categoria = C.id_categoria
        WHERE G.id_usuario = ?
    `;
    const params = [filtros.id_usuario];

    // Aplicar filtros opcionales
    if (filtros.categoria && filtros.categoria !== 'todos') {
        sql += ' AND G.id_categoria = ?';
        params.push(filtros.categoria);
    }
    if (filtros.fecha) {
        sql += ' AND G.fecha = ?';
        params.push(filtros.fecha);
    }
    if (filtros.monto) {
        sql += ' AND G.monto >= ?';
        params.push(filtros.monto);
    }

    console.log('Consulta SQL generada:', sql); // Depuración: Verificar la consulta generada
    console.log('Parámetros usados:', params); // Depuración: Verificar los parámetros usados

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al obtener los gastos:', err.message);
            callback(false, null, err.message);
        } else {
            console.log('Resultados obtenidos:', rows); // Depuración: Verificar los resultados obtenidos
            callback(true, rows, 'Gastos obtenidos con éxito');
        }
    });
}
function registerInversion(data, callback) {
    const sql = `
        INSERT INTO Inversiones (id_usuario, montoInvertido, tipoInversion, fechaInicio, estado, descripcion, rendimiento)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Estado inicial de la inversión: "Activa"
    const estadoInicial = "Activa";

    db.run(sql, [
        data.id_usuario,           // Usuario asociado
        data.monto,                // Monto invertido
        data.categoria,            // Tipo de inversión (categoría)
        data.fecha,                // Fecha de inicio
        estadoInicial,             // Estado inicial de la inversión
        data.descripcion || '',    // Descripción (opcional)
        data.rendimiento           // Rendimiento esperado
    ], function (err) {
        if (err) {
            console.error('Error al registrar la inversión:', err.message);
            callback(false, err.message);
        } else {
            console.log('Inversión registrada con éxito, ID:', this.lastID);
            callback(true, 'Inversión registrada con éxito');
        }
    });
}

function registerAdeudo(data, callback) {
    const sql = `
        INSERT INTO Adeudos (id_usuario, fechaRegistro, descripcion, monto, vencimiento, estado, id_categoria)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const fechaActual = new Date().toISOString().split('T')[0]; // Fecha actual (YYYY-MM-DD)

    db.run(sql, [
        data.id_usuario,      // ID del usuario autenticado
        fechaActual,          // Fecha de registro (actual)
        data.descripcion,     // Descripción del adeudo
        data.monto,           // Monto del adeudo
        data.fecha,           // Fecha de vencimiento
        data.estado,          // Estado del adeudo
        data.id_categoria     // ID de la categoría
    ], function (err) {
        if (err) {
            console.error('Error al registrar el adeudo:', err.message);
            callback(false, err.message);
        } else {
            console.log('Adeudo registrado con éxito, ID:', this.lastID);
            callback(true, 'Adeudo registrado con éxito');
        }
    });
}

// Exportar la función
module.exports = { db, registerUser, loginUser, registerGasto, getGastos, registerInversion, registerAdeudo };
