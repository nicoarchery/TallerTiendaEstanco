document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: 'cliente' })
    });

    if (response.ok) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        }
        document.getElementById('registerForm').reset();
    } else {
        alert('Error en el registro. Por favor, intenta nuevamente.');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    const { token } = data;

    if (token) {
        localStorage.setItem('token', token);
        window.location.href = 'index.html';
        alert('Inicio de sesión exitoso');
    } else {
        alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
});

const token = localStorage.getItem('token');
if (token) {
    window.location.href = '../frontend/index.html';
}
