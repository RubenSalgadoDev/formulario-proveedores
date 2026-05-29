document.getElementById('formProveedores').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const btn = document.getElementById('btnRegistrar');
    btn.disabled = true;
    btn.innerText = 'Procesando registro...';

    try {
        const response = await fetch('/api/proveedores' ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resultado = await responde.json();
        if (response.ok){
            alert('¡Proveedor registrado exitosamente!');
            e.target.reset();
        }else{
            alert('Error en el registro: ' + resultado.error);
        }
    } catch (error) {
        console.error('Error de comunicación:', error);
        alert('No se pudo establecer conexión con el servidor.');
    }finally{
        btn.disabled=false;
        btn.innerText = 'Registrar Proveedor';
    }
});
