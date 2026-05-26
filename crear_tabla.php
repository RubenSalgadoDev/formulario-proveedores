<?php
// 1. Reemplace con su 'External Connection String' completa de Notion
$external_connection_string = "postgresql://proveedores_0cr9_user:J4WjtV7R5c62kXb5aqvtUH3ZRuv3dMR@dpg-d87kui8js32c73ee8tf0-a.oregon-postgres.render.com/proveedores_0cr9";

try {
    // Convertir la URL de Render al formato que entiende PHP (PDO)
    $dbopts = parse_url($external_connection_string);
    
    $dsn = sprintf("pgsql:host=%s;port=%d;dbname=%s", 
        $dbopts["host"], 
        $dbopts["port"] ?? 5432, 
        ltrim($dbopts["path"], '/')
    );
    
    // Conectarse a PostgreSQL
    $pdo = new PDO($dsn, $dbopts["user"], $dbopts["pass"], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // 2. El código SQL con la estructura exacta de su tabla
    $sql = "CREATE TABLE IF NOT EXISTS proveedores (
        id SERIAL PRIMARY KEY,
        nit VARCHAR(15) NOT NULL UNIQUE,
        estado VARCHAR(10) NOT NULL,
        razon_social VARCHAR(50) NOT NULL,
        tipo_proveeodor VARCHAR(50) NOT NULL,
        fecha_creacion DATE NOT NULL,
        ultima_actualizacion DATE NOT NULL,
        proxima_actualizacion DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
        correo_rut VARCHAR(100) NOT NULL,
        correo_comercial VARCHAR(100) NOT NULL,
        correo_compras VARCHAR(100) NOT NULL,
        correo_ea VARCHAR(100) NOT NULL,
        correo_pagos VARCHAR(100) NOT NULL,
        correo_tributario VARCHAR(100) NOT NULL
    );";

    // Ejecutar la creación
    $pdo->exec($sql);
    echo "¡Éxito! La tabla 'proveedores' ha sido creada correctamente en Render.";

} catch (PDOException $e) {
    echo "Error al conectar o crear la tabla: " . $e->getMessage();
}
?>
