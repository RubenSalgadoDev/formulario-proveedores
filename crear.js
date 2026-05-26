import pg from 'pg';
const { Client } = pg;

// Credenciales directas de tu Notion
const client = new Client({
  connectionString: "postgresql://proveedores_0cr9_user:J4WjtV7R5c62kXb5aqvtUH3ZRuv3dMR@dpg-d87kui8js32c73ee8tf0-a.oregon-postgres.render.com/proveedores_0cr9",
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras con Render
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
