function createDB(db){

    // Crear la tabla "usuarios" si no existe
    db.exec(`
        CREATE TABLE IF NOT EXISTS Adeudos (
            id_adeudo INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            fechaRegistro TEXT NOT NULL,
            descripcion TEXT,
            monto REAL NOT NULL,
            vencimiento TEXT NOT NULL,
            estado TEXT NOT NULL,
            id_categoria INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Categorias (
            id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
            nombreCategoria TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Deudas (
            id_deuda INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            monto REAL NOT NULL,
            fechaInicio TEXT NOT NULL,
            fechaVencimiento TEXT NOT NULL,
            descripcion TEXT,
            estado TEXT NOT NULL,
            acreedor TEXT NOT NULL,
            id_categoria INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Gastos (
            id_gasto INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            monto REAL NOT NULL,
            fecha TEXT NOT NULL,
            descripcion TEXT,
            id_categoria INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Ingresos (
            id_ingreso INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            monto REAL NOT NULL,
            descripcion TEXT,
            fechaIngreso TEXT NOT NULL,
            fuente TEXT NOT NULL,
            id_categoria INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Inversiones (
            id_inversion INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            montoInvertido REAL NOT NULL,
            tipoInversion TEXT NOT NULL,
            fechaInicio TEXT NOT NULL,
            estado TEXT NOT NULL,
            descripcion TEXT,
            rendimiento REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS PagosTarjeta (
            id_pagoTarjeta INTEGER PRIMARY KEY AUTOINCREMENT,
            id_tarjeta INTEGER NOT NULL,
            monto REAL NOT NULL,
            acreedor TEXT NOT NULL,
            plazoPago TEXT NOT NULL,
            descripcion TEXT
        );

        CREATE TABLE IF NOT EXISTS Presupuestos (
            id_presupuestos INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            montoAsignado REAL NOT NULL,
            periodo TEXT NOT NULL,
            estado TEXT NOT NULL,
            descripcion TEXT,
            id_categoria INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Tarjetas (
            id_tarjeta INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            numeroTarjeta TEXT NOT NULL,
            banco TEXT NOT NULL,
            saldoActual REAL NOT NULL,
            cvv TEXT NOT NULL,
            estado TEXT NOT NULL,
            descripcion TEXT,
            fechaExpiracion TEXT NOT NULL,
            tipoTarjeta TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Usuarios (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellidoPaterno TEXT NOT NULL,
            apellidoMaterno TEXT NOT NULL,
            correo TEXT NOT NULL,
            contrasena TEXT NOT NULL,
            telefono TEXT NOT NULL
        );
    `, (err) => {
        if (err) {
            console.error('Error al crear las tablas:', err.message);
        } else {
            console.log('Tablas creadas con exito');
        }
    });

}

module.exports = { createDB };