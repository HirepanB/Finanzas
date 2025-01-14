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
        INSERT INTO usuarios (nombre, apellidoPaterno, apellidoMaterno, correo, contrasena, telefono)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    bcrypt.hash(data.contrasena, 10, (err, hash) => {
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
function loginUser(correo, contrasena, callback) {
    const sql = 'SELECT * FROM usuarios WHERE correo = ?';

    db.get(sql, [correo], (err, row) => {
        if (err) {
            console.error('Error al buscar el usuario:', err.message);
            callback(false, err.message);
        } else if (row) {
            bcrypt.compare(contrasena, row.contrasena, (err, result) => {
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
function editUser(data, callback) {
    const sql = `
        UPDATE Usuarios
        SET nombre = ?,
            correo = ?,
            contrasena = ?
        WHERE id_usuario = ?
    `;


    bcrypt.hash(data.contrasena, 10, (err, hash) => {
        if (err) {
            console.error('Error al generar el hash:', err.message);
            callback(false, 'Error interno del servidor');
        } else {
            db.run(sql, [
                data.nombre,
                data.correo,
                hash,
                data.id_usuario
            ], function (err) {
                if (err) {
                    console.error('Error al ediar el user:', err.message);
                    callback(false, err.message);
                } else {
                    console.log('ediar el user éxito, ID:', '');
                    callback(true, 'Usuario registrado con éxito');
                }
            });
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

function getInversiones(filtros, callback) {
    let sql = `
        SELECT *
        FROM Inversiones
        WHERE id_usuario = ?
    `;
    const params = [filtros.id_usuario];

    console.log('Consulta SQL generada:', sql); // Depuración: Verificar la consulta generada
    console.log('Parámetros usados:', params); // Depuración: Verificar los parámetros usados

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al obtener los Deudas:', err.message);
            callback(false, null, err.message);
        } else {
            console.log('Resultados obtenidos:', rows); // Depuración: Verificar los resultados obtenidos
            callback(true, rows, 'Deudas obtenidos con éxito');
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

function getAdeudos(filtros, callback) {
    let sql = `
        SELECT Adeudos.*, Categorias.nombreCategoria as categoria
        FROM Adeudos
        JOIN Categorias ON Adeudos.id_categoria = Categorias.id_categoria
        WHERE Adeudos.id_usuario = ?
    `;
    const params = [filtros.id_usuario];

    console.log('Consulta SQL generada:', sql); // Depuración: Verificar la consulta generada
    console.log('Parámetros usados:', params); // Depuración: Verificar los parámetros usados

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al obtener los Adeudos:', err.message);
            callback(false, null, err.message);
        } else {
            console.log('Resultados obtenidos:', rows); // Depuración: Verificar los resultados obtenidos
            callback(true, rows, 'Adeudos obtenidos con éxito');
        }
    });
}

function registerIngreso(data, callback) {
    const sql = `
        INSERT INTO Ingresos (id_usuario, monto, descripcion, fechaIngreso, fuente, id_categoria)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        data.id_usuario,     // ID del usuario autenticado
        data.monto,          // Monto del ingreso
        data.descripcion,    // Descripción del ingreso
        data.fecha,          // Fecha del ingreso
        data.fuente,         // Fuente del ingreso
        data.id_categoria    // ID de la categoría
    ], function (err) {
        if (err) {
            console.error('Error al registrar el ingreso:', err.message);
            callback(false, err.message);
        } else {
            console.log('Ingreso registrado con éxito, ID:', this.lastID);
            callback(true, 'Ingreso registrado con éxito');
        }
    });
}

function getIngresos(filtros, callback) {
    let sql = `
        SELECT Ingresos.*, Categorias.nombreCategoria as categoria
        FROM Ingresos
        JOIN Categorias ON Ingresos.id_categoria = Categorias.id_categoria
        WHERE Ingresos.id_usuario = ?
    `;
    const params = [filtros.id_usuario];

    console.log('Consulta SQL generada:', sql); // Depuración: Verificar la consulta generada
    console.log('Parámetros usados:', params); // Depuración: Verificar los parámetros usados

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al obtener los Ingresos:', err.message);
            callback(false, null, err.message);
        } else {
            console.log('Resultados obtenidos:', rows); // Depuración: Verificar los resultados obtenidos
            callback(true, rows, 'Ingresos obtenidos con éxito');
        }
    });
}

// Función para registrar tarjeta
function registerTarjeta(data, callback) {
    const sql = `
        INSERT INTO Tarjetas (id_usuario, numeroTarjeta, banco, saldoActual, cvv, estado, descripcion, fechaExpiracion, tipoTarjeta)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const estadoInicial = "Activa"; // Estado inicial de la tarjeta

    db.run(sql, [
        data.id_usuario,        // Usuario asociado
        data.numeroTarjeta,     // Número de tarjeta
        data.banco,             // Banco
        data.saldoActual,       // Saldo actual
        data.cvv,               // CVV
        estadoInicial,          // Estado inicial
        data.descripcion || '', // Descripción (opcional)
        data.fechaExpiracion,   // Fecha de expiración
        data.tipoTarjeta        // Tipo de tarjeta (Crédito/Débito)
    ], function (err) {
        if (err) {
            console.error('Error al registrar la tarjeta:', err.message);
            callback(false, err.message);
        } else {
            console.log('Tarjeta registrada con éxito, ID:', this.lastID);
            callback(true, 'Tarjeta registrada con éxito');
        }
    });
}
// Obtener tarjetas del usuario
function getTarjetas(id_usuario, callback) {
    const sql = `
        SELECT *
        FROM Tarjetas
        WHERE id_usuario = ?
    `;
    db.all(sql, [id_usuario], (err, rows) => {
        if (err) {
            console.error('Error al obtener tarjetas:', err.message);
            callback(false, null, err.message);
        } else {
            callback(true, rows, 'Tarjetas obtenidas con éxito');
        }
    });
}

// Registrar un pago
function registerPago(data, callback) {
    const sql = `
        INSERT INTO PagosTarjeta (id_tarjeta, monto, acreedor, plazoPago, descripcion)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [
        data.id_tarjeta,
        data.monto,
        data.acreedor,
        data.plazoPago,
        data.descripcion || ''
    ], function (err) {
        if (err) {
            console.error('Error al registrar el pago:', err.message);
            callback(false, err.message);
        } else {
            callback(true, 'Pago registrado con éxito');
        }
    });
}

function getPagos(filtros, callback) {
    let sql = `
        SELECT PagosTarjeta.*, Tarjetas.*
        FROM PagosTarjeta
        JOIN Tarjetas ON PagosTarjeta.id_tarjeta = Tarjetas.id_tarjeta
        WHERE Tarjetas.id_usuario = ?
    `;
    const params = [filtros.id_usuario];

    console.log('Consulta SQL generada:', sql); // Depuración: Verificar la consulta generada
    console.log('Parámetros usados:', params); // Depuración: Verificar los parámetros usados

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al obtener los Pagos:', err.message);
            callback(false, null, err.message);
        } else {
            console.log('Resultados obtenidos:', rows); // Depuración: Verificar los resultados obtenidos
            callback(true, rows, 'Pagos obtenidos con éxito');
        }
    });
}

//////////////////////////////////
// Función para obtener deudas

function getDeudas(filtros, callback) {
    let sql = `
        SELECT Deudas.*, Categorias.nombreCategoria AS categoria
        FROM Deudas
        JOIN Categorias ON Deudas.id_categoria = Categorias.id_categoria
        WHERE Deudas.id_usuario = ?
    `;
    const params = [filtros.id_usuario];

    console.log('Consulta SQL generada:', sql); // Depuración: Verificar la consulta generada
    console.log('Parámetros usados:', params); // Depuración: Verificar los parámetros usados

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al obtener los Deudas:', err.message);
            callback(false, null, err.message);
        } else {
            console.log('Resultados obtenidos:', rows); // Depuración: Verificar los resultados obtenidos
            callback(true, rows, 'Deudas obtenidos con éxito');
        }
    });
}

// Función para registrar un gasto
function registerDeuda(data, callback) {
    const sql = `
        INSERT INTO Deudas (id_usuario,monto,fechaInicio,fechaVencimiento,descripcion,estado,acreedor,id_categoria)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0'); // Asegura que tenga 2 dígitos
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const anio = hoy.getFullYear();
    
    const fechaInicio =  `${dia}/${mes}/${anio}`;

    db.run(sql, [
        data.id_usuario,
        data.monto,
        fechaInicio,
        data.fecha,
        data.descripcion,
        data.estado,
        data.acreedor,
        data.id_categoria
    ], function (err) {
        if (err) {
            console.error('Error al registrar la deuda:', err.message);
            callback(false, err.message);
        } else {
            console.log('Deuda registrada con éxito, ID:', this.lastID);
            callback(true, 'Deuda registrada con éxito');
        }
    });
}

////////////////////////////////

function getDeudas(filtros, callback) {
    let sql = `
        SELECT Deudas.*, Categorias.nombreCategoria AS categoria
        FROM Deudas
        JOIN Categorias ON Deudas.id_categoria = Categorias.id_categoria
        WHERE Deudas.id_usuario = ?
    `;
    const params = [filtros.id_usuario];

    console.log('Consulta SQL generada:', sql); // Depuración: Verificar la consulta generada
    console.log('Parámetros usados:', params); // Depuración: Verificar los parámetros usados

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al obtener los Deudas:', err.message);
            callback(false, null, err.message);
        } else {
            console.log('Resultados obtenidos:', rows); // Depuración: Verificar los resultados obtenidos
            callback(true, rows, 'Deudas obtenidos con éxito');
        }
    });
}

// Función para registrar un gasto
function registerPresupuesto(data, callback) {
    const sql = `
        INSERT INTO Presupuestos (id_usuario,montoAsignado,periodo,estado,descripcion,id_categoria)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const estadoInicial = "Activa";
    let presupuestoId="";
    let fl=true;

    db.run(sql, [
        data.id_usuario,
        data.montoAsignado,
        data.periodo,
        data.estado,
        data.descripcion,
        data.id_categoria
    ], function (err) {
        if (err) {
            console.error('Error al registrar la deuda:', err.message);
            fl=false;
            callback(false, err.message);
        } else {
            console.log('presupuesto registrada con éxito, ID:', this.lastID);
            presupuestoId=this.lastID;
            
            const detalles=data.detalles;
            console.log(presupuestoId);

            const sqlDetalle = `
                INSERT INTO DetallesPresupuesto (id_presupuesto,descripcion,monto)
                VALUES (?, ?, ?)
            `;

            detalles.forEach(detalle => {
                db.run(sqlDetalle, [
                    presupuestoId,
                    detalle.descripcion,
                    detalle.monto
                ], function (err) {
                    if (err) {
                        console.error('Error al registrar detalle:', err.message);
                        return;
                    } else {
                        console.log('Detalle registrada con éxito, ID:', this.lastID);
                    }
                });

            });
            callback(true, 'presupuesto registrada con éxito');
        }
    });

    if(!fl)return;

    

}

function getPresupuestosDetalles(filtros, callback) {
    let sql = `
        SELECT Presupuestos.*, DetallesPresupuesto.*, Categorias.nombreCategoria as categoria
        FROM Presupuestos
        JOIN Categorias ON Presupuestos.id_categoria = Categorias.id_categoria
        JOIN DetallesPresupuesto ON Presupuestos.id_presupuestos = DetallesPresupuesto.id_presupuesto
        WHERE Presupuestos.id_usuario = ?
        ORDER BY Presupuestos.id_presupuestos ASC
    `;
    const params = [filtros.id_usuario];

    console.log('Consulta SQL generada:', sql); // Depuración: Verificar la consulta generada
    console.log('Parámetros usados:', params); // Depuración: Verificar los parámetros usados

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al obtener los presupuestos:', err.message);
            callback(false, null, err.message);
        } else {
            console.log('Resultados obtenidos:', rows); // Depuración: Verificar los resultados obtenidos
            callback(true, rows, 'presupuestos obtenidos con éxito');
        }
    });
}

// Exportar la función
module.exports = { 
    db, 
    registerUser, 
    loginUser,
    editUser,
    registerGasto, 
    getGastos, 
    registerInversion,
    getInversiones,
    registerAdeudo, 
    getAdeudos,
    registerIngreso,
    getIngresos,
    registerTarjeta,
    getTarjetas,
    registerPago,
    getPagos,
    getDeudas,
    registerDeuda,
    registerPresupuesto,
    getPresupuestosDetalles
};
