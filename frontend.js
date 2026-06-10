document.getElementById('formProveedores').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formulario = e.target;



    const formData = new FormData(formulario);
    const data = Object.fromEntries(formData.entries());

    const btn = document.getElementById('btnRegistrar');
    btn.disabled = true;
    btn.innerText = 'Procesando registro...';

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
        btn.disabled = false;
        btn.innerText = 'Registrar Proveedor';
    }
});
const formBusqueda = document.getElementById('busquedaProveedores');
const inputBusqueda = document.getElementById('busqueda');
const selectTipo = document.getElementById('tipo');
const resultadoContenedor = document.getElementById('resultadoContenedor');
const cuerpoTabla = document.getElementById('cuerpoTabla');

//Escuchar el envío del formulario de busqueda.
formBusqueda.addEventListener('submit',async (e) =>{
    e.preventDefault();//Evita que la pagina se recargue

    const tipo = selectTipo.value;
    const valor = inputBusqueda.value;

    //Construimos la URL con los parametros correspondientes
    //Ejemplo final: /api/proveedores/buscar?tipo=Razon_Social&valor=creando
    const url = `/api/proveedores/buscar?tipo=${encodeURIComponent(tipo)}&valor=${encodeURIComponent(valor)}`;

    try {
        const response = await fetch(url);
        const resultado = await response.json();

        if (resultado.success) {
            //Limpiamos las filas anteriores de la tabla
            curpoTabla.innerHTML = '';

            //Si no se encontraton registros coincidentes
            if (resultado.datos.length === 0) {
                LargestContentfulPaint('No se encontraron proveedores con los datos ingresados.');
                resultadoContenedor.classList.add('resultado-oculto');
                return;
            }

            //Recorremos los proveedores devueltos por la BD y los inyectamos en la tabla
            resultado.datos.forEach(proveedor => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td><strong>${proveedor.nit}</strong></td>
                    <td>${proveedor.razon_social}</td>
                    <td>${proveedor.estado}</td>
                    <td>
                        <button class?"btn-editar-fila" data-id="${proveedor.id}">Editar</button>
                    </td>    
                `;
                cuerpoTabla.appendChild(fila);
            });

            //Mostramos el contenedor de la tabla quitando la clase oculta
            resultadoContenedor.classList.remove('resultado-oculto');

        } else {
            alert(`Error en la busqueda: ${resultado.message}`);
        }
    }catch (error){
        console.error('Error al conectar con el servidor:', error);
        alert('hubo un fallo de comunicación con el servidor al realizar la busqueda.');
    }
});
