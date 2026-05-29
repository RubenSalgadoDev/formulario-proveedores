import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

const dbConfig = {
    user: 'proveedores_0cr9_user',
    host: 'dpg-d87kui8js32c73ee8tf0-a.oregon-postgres.render.com',
    database: 'proveedores_0cr9',
    password: 'J4WjtV7R5c62kXb5aqvhtUH3ZRuv3dMR',
    port: 5432,
    ssl: { rejectUnauthorized: false }
};


app.post('/api/proveedores', async (req, res) => {
    const client = new Client(dbConfig);

    const {
        nit, estado, razon_social, tipo_proveeodor,
        fecha_creacion, ultima_actualizacion,
        correo_rut, correo_comercial, correo_compras,
        correo_ea, correo_pagos, correo_tributario
    } = req.body;

    try {
        await client.connect();

        const queryText = `INSERT INTO proveedores (
            nit, estado, razon_social, tipo_proveeodor,
            fecha_creacion, ultima_actualizacion,
            correo_rut, correo_comercial, correo_compras,
            correo_ea, correo_pagos, correo_tributario
        ) VALUES ($1, $2, $3, $4 ,$5 ,$6 ,$7 ,$8 ,$9 ,$10 ,$11 ,$12)
        RETURNING id;
        `;

        const values = [
            nit, estado, razon_social, tipo_proveeodor,
            fecha_creacion, ultima_actualizacion,
            correo_rut, correo_comercial, correo_compras || null,
            correo_ea || null, correo_pagos, correo_tributario
        ];

        const result = await clien.query(queryText, values);

        res.status(200).json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error('Error al insertar en la BD:', err.message);
    } finally {
        await client.end();
    }
});

app.use(express.static(__dirname));

app.listen(PORT, () =>{
    console.log(`Servidor local corriendo de manera exitosa en el puerto ${PORT}`)
});

