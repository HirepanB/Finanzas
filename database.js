const sqlite3 = require('sqlite3').verbose();

// Crear o abrir la base de datos
const db = new sqlite3.Database('./finanzas.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a SQLite.');
    }
});

// Crear la tabla "usuarios" si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellidoPaterno TEXT NOT NULL,
            apellidoMaterno TEXT NOT NULL,
            correo TEXT NOT NULL UNIQUE,
            contraseña TEXT NOT NULL,
            telefono TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message);
        } else {
            console.log('Tabla "usuarios" creada o ya existe.');
        }
    });
});

// Función para registrar un usuario
const bcrypt = require('bcrypt');

function registerUser(data, callback) {
    const sql = `
        INSERT INTO usuarios (nombre, apellidoPaterno, apellidoMaterno, correo, contraseña, telefono)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Generar un hash de la contraseña
    bcrypt.hash(data.contraseña, 10, (err, hash) => {
        if (err) {
            console.error('Error al generar el hash:', err.message);
            callback(false, 'Error interno del servidor');
        } else {
            // Guardar la contraseña hasheada en la base de datos
            db.run(sql, [
                data.nombre,
                data.apellidoPaterno,
                data.apellidoMaterno,
                data.correo,
                hash, // Guardar el hash en lugar de la contraseña
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
            // Comparar la contraseña ingresada con el hash almacenado
            bcrypt.compare(contraseña, row.contraseña, (err, result) => {
                if (result) {
                    console.log('Login exitoso:', row);
                    callback(true, 'Login exitoso');
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

// Exportar las funciones y la base de datos
module.exports = { db, registerUser, loginUser };