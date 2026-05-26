JavaScript

import pg from 'pg';
const { Client } = pg;

// Separamos los datos para evitar conflictos con caracteres especiales como la '@'
const client = new Client({
  user: 'proveedores_0cr9_user',
  host: 'dpg-d87kui8js32c73ee8tf0-a.oregon-postgres.render.com',
  database: 'proveedores_0cr9',
  password: 'J4WjtV7R5c62kXb5aqvhtUH3ZRuv3dMR'
  port: 5432,
  ssl: {
    rejectUnauthorized: false // Requerido por Render para conexiones seguras
  }
});

async function crearTabla() {
  try {
    await client.connect();
    
    // Tu estructura exacta de proveedores
    const sql = `
      CREATE TABLE IF NOT EXISTS proveedores (
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
      );
    `;

    await client.query(sql);
    console.log("¡Éxito total! La tabla 'proveedores' ha sido creada correctamente en Render.");

  } catch (err) {
    console.error("Error al conectar o crear la tabla:", err.message);
  } finally {
    await client.end();
  }
}

crearTabla();
