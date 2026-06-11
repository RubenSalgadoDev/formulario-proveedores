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

        const result = await client.query(queryText, values);

        return res.status(200).json({ success: true });

    } catch (err) {

        console.error('Error al insertar en la BD:', err.message);
        return res.status(500).json({ success: false, error: err.message });

    } finally {
        await client.end();
    }

});

// 🔍 RUTA PARA BUSCAR PROVEEDORES (Fase 2)

app.get('/api/proveedores/buscar', async (req, res) => {
    const { tipo, valor } = req.query;

    //validar que parametros no esten vacios
    if (!tipo || !valor) {
        return res.status(400).json({ success: false, mesage: 'Faltan parametros de búsqueda' });
    }

    //inicializar una instancia del cliente de la BD
    const client = new Client(dbConfig);

    try {
        await client.connect();

        let queryText = '';
        let values = [];

        if (tipo === 'NIT') {
            //busqueda por NIT exacta
            queryText = 'SELECT * FROM proveedores WHERE nit = $1';
            values = [valor.trim()];
        } else if (tipo === 'Razon_Social') {
            queryText = 'SELECT * FROM proveedores WHERE razon_social ILIKE $1';
            values = [`%${valor.trim()}%`];
        } else {
            return res.status(400).json({
                success: false, message: 'Tipo de búsqueda no válido'
            });
        }

        const result = await client.query(queryText, values);
        res.status(200).json({ success: true, datos: result.rows });

    } catch (err) {
        console.error('Error al consultar en la BD:', err.message);
        res.status(500).json({ success: false, error: 'Error interno del servidor al buscar.' });
    } finally {
        await client.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor local corriendo de manera exitosa en el puerto ${PORT}`)
});





