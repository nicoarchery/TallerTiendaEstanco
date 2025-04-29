document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert('No se proporcionó un ID de producto válido.');
        window.location.href = 'index.html';
        return;
    }

    async function fetchProductData(productId) {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/get-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: productId })
            });

            const productData = await response.json();

            if (!response.ok) {
                alert(`Error al obtener los datos del producto: ${productData.status} - ${productData.message}`);
            }

            return productData;
        } catch (error) {
            alert('Ocurrió un error al cargar los datos del producto.');
            return null;
        }
    }

    const productData = await fetchProductData(productId);

    if (productData) {
        document.getElementById('articleNombre').value = productData.name || '';
        document.getElementById('articleDescripcion').value = productData.description || '';
        document.getElementById('articlePrice').value = productData.price || '';
        document.getElementById('articleCantidad').value = productData.quantity || '';

        const productImage = document.getElementById('productImage');
        if (productData.image) {
            productImage.src = productData.image;
        }
    }

    document.getElementById('editProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', document.getElementById('articleNombre').value);
        formData.append('description', document.getElementById('articleDescripcion').value);
        formData.append('price', document.getElementById('articlePrice').value);
        formData.append('quantity', document.getElementById('articleCantidad').value);
        const imageFile = document.getElementById('articleImagen').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/edit-product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Producto actualizado exitosamente: ${result.message}`);
                window.location.href = 'index.html';
            } else {
                alert(`Error al actualizar producto: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al actualizar los datos del producto:', error);
            alert('Ocurrió un error al actualizar el producto.');
        }
    });
});

const token = localStorage.getItem('token');

const userData = await (async () => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return null;
    }
})();

if (!token) {
    window.location.href = '../frontend/login.html';
} else {
    if (userData.rol !== 'admin') {
        window.location.href = '../frontend/index.html';
    }
}
