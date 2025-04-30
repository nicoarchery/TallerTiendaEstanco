// Llamada al backend para obtener el historial de compras
fetch('/api/purchase-history')
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data)) {
            mostrarHistorialDeCompras(data); // Llamamos a la función para mostrar el historial de compras
        } else {
            console.error('Error: no se recibieron datos válidos del historial.');
            // Aquí podrías mostrar un mensaje de error en el frontend si no se reciben los datos correctamente
        }
    })
    .catch(error => {
        console.error('Error al obtener el historial:', error);
        alert("Hubo un problema al obtener el historial de compras.");
    });

// Función para mostrar el historial de compras
function mostrarHistorialDeCompras(historial) {
    const historialContent = document.getElementById('historyContent');
    historialContent.innerHTML = '';  // Limpiamos el contenido previo

    if (historial.length === 0) {
        historialContent.innerHTML = '<p>No hay compras realizadas.</p>';
    } else {
        historial.forEach(order => {
            let compraDiv = document.createElement('div');
            compraDiv.classList.add('compra-item');

            let fecha = document.createElement('p');
            fecha.textContent = `Fecha: ${order.date}`;
            compraDiv.appendChild(fecha);

            order.products.forEach(product => {
                let productoP = document.createElement('p');
                productoP.textContent = `${product.name} - ${product.quantity} * ${product.price}`;
                compraDiv.appendChild(productoP);
            });

            let total = document.createElement('p');
            total.textContent = `Total: $${order.total}`;
            compraDiv.appendChild(total);

            historialContent.appendChild(compraDiv);
        });
    }
}
