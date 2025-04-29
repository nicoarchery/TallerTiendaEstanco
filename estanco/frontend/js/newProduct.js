document.getElementById('articleImagen').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
    }
});

document.getElementById('newProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = document.getElementById('newProductForm');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    const imagePreview = document.getElementById('imagePreview');

    formData.append('name', document.getElementById('articleNombre').value);
    formData.append('description', document.getElementById('articleDescripcion').value);
    formData.append('price', document.getElementById('articlePrice').value);
    formData.append('quantity', document.getElementById('articleCantidad').value);
    formData.append('image', document.getElementById('articleImagen').files[0]);

    try {
        const response = await fetch('http://localhost:3000/api/admin/add-product', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert(`${data.status} - ${data.message}`);
            form.reset();
            imagePreview.style.display = 'none';
            window.location.href = '../frontend/newProduct.html';
        } else {
            alert(`Error: ${data.status} - ${data.message}`);
        }
    } catch (error) {
        console.error('Error al enviar el producto:', error);
        alert(`Ocurrió un error al añadir el producto. ${error.toString()}`);
    }
});

const token = localStorage.getItem('token');

const userData = await(async () => {
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
