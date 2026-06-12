// ==========================================
// FASE 1: REGISTRO DE PROVEEDORES (index.html)
// ==========================================
const formRegistro = document.getElementById('formProveedores');

// Validamos si el formulario de registro existe en la página actual
if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formulario = e.target;
        const formData = new FormData(formulario);
        const data = Object.fromEntries(formData.entries());

        const btn = document.getElementById('btnRegistrar');
        if (btn) {
            btn.disabled = true;
            btn.innerText = 'Procesando registro...';
        }

        try {
            const response = await fetch('/api/proveedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const resultado = await response.json();
            if (response.ok) {
                alert('¡Proveedor registrado exitosamente!');
                formulario.reset();
            } else {
                alert('Error en el registro: ' + resultado.error);
            }
        } catch (error) {
            console.error('Error de comunicación:', error);
            alert('No se pudo establecer conexión con el servidor.');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerText = 'Registrar Proveedor';
            }
        }
    });
}

// ==========================================
// FASE 2: LÓGICA DE BÚSQUEDA Y EDICIÓN (buscar.html)
// ==========================================
const formBusqueda = document.getElementById('busquedaProveedores');
const inputBusqueda = document.getElementById('busqueda');
const selectTipo = document.getElementById('tipo');
const resultadoContenedor = document.getElementById('resultadoContenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');

const modalEdicion = document.getElementById('modalEdicion');
const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');
const formEditarProveedor = document.getElementById('formEditarProveedor');

// Validamos si el formulario de búsqueda existe en la página actual antes de colgar el evento
if (formBusqueda) {
    formBusqueda.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ahora sí detendrá la recarga de forma garantizada

        const tipo = selectTipo.value;
        const valor = inputBusqueda.value;

        const url = `/api/proveedores/buscar?tipo=${encodeURIComponent(tipo)}&valor=${encodeURIComponent(valor)}`;

        try {
            const response = await fetch(url);
            const resultado = await response.json();

            if (resultado.success) {
                cuerpoTabla.innerHTML = '';

                if (resultado.datos.length === 0) {
                    alert('No se encontraron proveedores con los datos ingresados.');
                    resultadoContenedor.classList.add('resultado-oculto');
                    return;
                }

                resultado.datos.forEach(proveedor => {
                    const fila = document.createElement('tr');

                    fila.innerHTML = `
                        <td><strong>${proveedor.nit}</strong></td>
                        <td>${proveedor.razon_social}</td>
                        <td>${proveedor.estado}</td>
                        <td>
                            <button type="button" class="btn-editar-fila" data-proveedor='${JSON.stringify(proveedor)}'>Editar</button>
                        </td>    
                    `;
                    cuerpoTabla.appendChild(fila);
                });

                resultadoContenedor.classList.remove('resultado-oculto');

            } else {
                alert(`Error en la búsqueda: ${resultado.message}`);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Hubo un fallo de comunicación con el servidor al realizar la búsqueda.');
        }
    });
}

// Control del Modal (Solo si la tabla existe en la página)
if (cuerpoTabla) {
    cuerpoTabla.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-editar-fila')) {
            const proveedor = JSON.parse(e.target.getAttribute('data-proveedor'));

            document.getElementById('edit_id').value = proveedor.id;
            document.getElementById('edit_nit').value = proveedor.nit;
            document.getElementById('edit_razon_social').value = proveedor.razon_social;
            document.getElementById('edit_estado').value = proveedor.estado;
            document.getElementById('edit_correo_rut').value = proveedor.correo_rut;
            document.getElementById('edit_correo_comercial').value = proveedor.correo_comercial;
            document.getElementById('edit_correo_compras').value = proveedor.correo_compras || '';
            document.getElementById('edit_correo_entradas').value = proveedor.correo_ea || '';
            document.getElementById('edit_correo_pagos').value = proveedor.correo_pagos;
            document.getElementById('edit_correo_tributario').value = proveedor.correo_tributario;

            modalEdicion.classList.remove('modal-oculto');
        }
    });
}

// Cierre del Modal
if (btnCancelarEdicion) {
    btnCancelarEdicion.addEventListener('click', () => {
        modalEdicion.classList.add('modal-oculto');
        formEditarProveedor.reset();
    });
}

if (formEditarProveedor) {
    formEditarProveedor.addEventListener('submit', async (e) => {
        e.preventDefault(); // 🛑 ¡AHORA SÍ detendrá la recarga de la página de forma garantizada!

        const id = document.getElementById('edit_id').value;
        const btnGuardar = document.getElementById('btnGuardarCambios');

        // Capturamos los valores actuales de los inputs del modal
        const dataEdicion = {
            razon_social: document.getElementById('edit_razon_social').value,
            estado: document.getElementById('edit_estado').value,
            correo_rut: document.getElementById('edit_correo_rut').value,
            correo_comercial: document.getElementById('edit_correo_comercial').value,
            correo_compras: document.getElementById('edit_correo_compras').value || null,
            correo_ea: document.getElementById('edit_correo_entradas').value || null, // Mapeado a correo_ea del Back
            correo_pagos: document.getElementById('edit_correo_pagos').value,
            correo_tributario: document.getElementById('edit_correo_tributario').value
        };

        // Bloqueamos el botón visualmente
        if (btnGuardar) {
            btnGuardar.disabled = true;
            btnGuardar.innerText = 'Guardando...';
        }

        try {
            // Enviamos la petición PUT real hacia la API del backend
            const response = await fetch(`/api/proveedores/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataEdicion)
            });

            const resultado = await response.json();

            if (resultado.success) {
                alert('¡Proveedor actualizado con éxito!');
                
                // Ocultamos el modal de forma limpia
                modalEdicion.classList.add('modal-oculto');
                formEditarProveedor.reset();

                // Refrescamos automáticamente la tabla realizando la búsqueda de nuevo
                if (formBusqueda) {
                    formBusqueda.dispatchEvent(new Event('submit'));
                }
            } else {
                alert(`Error al actualizar: ${resultado.error}`);
            }

        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Hubo un fallo de comunicación con el servidor al intentar actualizar.');
        } finally {
            if (btnGuardar) {
                btnGuardar.disabled = false;
                btnGuardar.innerText = 'Guardar Cambios';
            }
        }
    });
}