const token = localStorage.getItem("token");

const profileCart = document.getElementById("profileCart");
const authButtons = document.getElementById("authButtons");

if (token) {
  profileCart.style.display = "flex";
  authButtons.style.display = "none";
} else {
  profileCart.style.display = "none";
  authButtons.style.display = "block";
}

async function userData() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/auth/user-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    localStorage.setItem("token", data.token);

    return data;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  }
}

async function contentUser() {
  const data = await userData();
  const email = document.getElementById("email");
  const username = document.getElementById("username");

  email.innerHTML = "";
  username.innerHTML = "";

  username.textContent = data.nombre;
  email.textContent = data.email;
}

async function displayCart() {
  const cartContent = document.getElementById("cartContent");
  cartContent.innerHTML = "";

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/customer/order-cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Error al obtener los productos 3: ${response.status} - ${response.statusText}`
      );
    } else {
      let total = 0;

      const products = await response.json();

      if (products.length === 0) {
        cartContent.innerHTML = "<p>No hay productos en tu historial.</p>";
        return;
      }

      products.forEach((product) => {
        const cartProduct = document.createElement("div");
        cartProduct.classList.add("cart-product");

        cartProduct.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div>
            <p><strong>${product.name}</strong></p>
            <p>$${product.price}</p>
            <p>Cantidad: ${product.quantity}</p>
          </div>
        `;

        total += product.price * product.quantity;
        cartContent.appendChild(cartProduct);
      });

      const totalElement = document.getElementById("totalCart");
      totalElement.textContent = `Total: $${total}`;
    }
  } catch (error) {
    alert(`Error al cargar los productos del carrito: ${error.toString()}`);
  }
}

async function displayHistory() {
  const historyContent = document.getElementById("historyContent");
  historyContent.innerHTML = "";

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/customer/order-history",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Error al obtener los productos 1: ${response.status} - ${response.statusText}`
      );
    } else {
      const facturas = await response.json();

      if (facturas.length === 0) {
        historyContent.innerHTML = "<p>No hay productos en tu historial.</p>";
        return;
      }

      facturas.forEach((factura) => {
        let productFactura = "";
        let total = 0;
        let date = "";
        let user = "";

        const facturaItem = document.createElement("div");

        factura.products.forEach((product) => {
          productFactura += `<p>${product.name}..............${product.quantity} * ${product.price}</p>\n`;
          date = product.date;
          user = product.username;
          total += product.price * product.quantity;
        });
        const productItem = document.createElement("div");
        productItem.classList.add("modal-content");
        productItem.innerHTML = `
                <span id="closeModal" class="close-btn" onclick="init()">&times;</span>
        <h2>Factura compra</h2>
        <h3>Tipsy</h3>
        <h3>Cali/Colombia</h3>
        <h3>Cliente: ${user}</h3>
        <h3>Fecha: ${date}</h3>
        <p>----------------------------------------------------</p>
        ${productFactura}
        <p>----------------------------------------------------</p>
        <p>----------------------------------------------------</p>
        <h3>Total: $${total}</h3>
        <button id="confirmBuy" class="btn" onclick="init()">Ok</button>
              `;

        facturaItem.appendChild(productItem);
        historyContent.appendChild(facturaItem);
      });
    }
  } catch (error) {
    console.error(`Error al cargar los productos del historial: ${error}`);
  }
}

document.getElementById("buyCart").addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/customer/buy-cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    } else {
      // Mostrar el modal de pago
      const paymentModal = document.getElementById("paymentModal");
      paymentModal.innerHTML = "";
      const modalBackdrop = document.getElementById("modalBackdrop");
      paymentModal.style.display = "block"; // Mostrar el modal
      modalBackdrop.style.display = "block"; // Mostrar el fondo de modal

      const products = await response.json();

      let productFactura = "";
      let total = 0;
      let date = "";
      let user = "";
      products.forEach((product) => {
        productFactura += `<p>${product.name}..............${product.quantity} * ${product.price}</p>\n`;
        date = product.date;
        user = product.username;
        total += product.price * product.quantity;
      });

      const productItem = document.createElement("div");
      productItem.classList.add("modal-content");
      productItem.innerHTML = `
                <span id="closeModal" class="close-btn" onclick="init()">&times;</span>
        <h2>Factura compra</h2>
        <h3>Tipsy</h3>
        <h3>Cali/Colombia</h3>
        <h3>Cliente: ${user}</h3>
        <h3>Fecha: ${date}</h3>
        <p>----------------------------------------------------</p>
        ${productFactura}
        <p>----------------------------------------------------</p>
        <p>----------------------------------------------------</p>
        <h3>Total: $${total}</h3>
        <button id="confirmBuy" class="btn" onclick="init()">Ok</button>
              `;

      paymentModal.appendChild(productItem);
    }
  } catch (error) {
    console.error(`Error al comprar los productos: ${error}`);
  }
});

// Función para cerrar el modal de pago
document.getElementById("closeModal").addEventListener("click", () => {
  const paymentModal = document.getElementById("paymentModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  paymentModal.style.display = "none"; // Ocultar el modal
  modalBackdrop.style.display = "none"; // Ocultar el fondo de modal
  window.location.href = "index.html";
});

// Confirmar la compra
document.getElementById("confirmBuy").addEventListener("click", async () => {
  const paymentModal = document.getElementById("paymentModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  paymentModal.style.display = "none"; // Ocultar el modal después de la compra
  modalBackdrop.style.display = "none"; // Ocultar el fondo de modal
  window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  let products = [];

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/customer/products");

    if (!response.ok) {
      throw new Error(
        `Error al obtener los productos 2: ${response.status} - ${response.statusText}`
      );
    }

    products = await response.json();

    if (!Array.isArray(products)) {
      throw new Error("La respuesta no es un arreglo de productos");
    }

    const data = await userData();

    if (data.rol === "admin") {
      const newProduct = document.getElementById("newProduct");
      newProduct.style.display = "flex";
    }

    if (token) {
      await displayCart();
      await displayHistory();
    }

    const cuadricula = document.getElementById("cuadricula");
    cuadricula.innerHTML = "";

    function renderProducts(filteredProducts) {
      cuadricula.innerHTML = "";
      let count = 0;

      while (count < filteredProducts.length) {
        const content = document.createElement("div");
        content.classList.add("content");

        const productList = document.createElement("div");
        productList.classList.add("product-list");
        productList.id = "productList";

        for (let j = 0; j < 4 && count < filteredProducts.length; j++) {
          const product = filteredProducts[count];
          const productItem = document.createElement("div");
          productItem.classList.add("product-card");

          if (data.rol === "admin") {
            productItem.innerHTML = `
                <button id="editButton" class="edit-btn" onclick="editProduct(${product.id})">
                  <i class="fas fa-edit"></i> <!-- Ícono de lápiz de FontAwesome -->
                </button>
                <img src="${product.image}" alt="${product.name}">
                <p>$${product.price} /u</p>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
              `;
          } else {
            productItem.innerHTML = `
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">+</button>
                <img src="${product.image}" alt="${product.name}">
                <p>$${product.price} /u</p>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
              `;
          }

          productList.appendChild(productItem);
          count++;
        }

        content.appendChild(productList);
        cuadricula.appendChild(content);
      }
    }

    function removeAccent(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    renderProducts(products);
    await contentUser();

    const searchButton = document.querySelector(".search button");
    const searchInput = document.querySelector(".search input");

    searchButton.addEventListener("click", () => {
      const query = searchInput.value.toLowerCase();
      const filteredProducts = products.filter((product) => {
        return (
          removeAccent(product.name).toLowerCase().includes(query) ||
          removeAccent(product.description).toLowerCase().includes(query)
        );
      });

      renderProducts(filteredProducts);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchButton.click();
      }
    });

    console.log("Productos cargados exitosamente.");
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
});

async function init() {
  window.location.href = "index.html";
}

async function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(productId);
  localStorage.setItem("cart", JSON.stringify(cart));

  const token = localStorage.getItem("token"); // Asumiendo que el token está en localStorage

  if (!token) {
    console.error(
      "No se ha proporcionado un token. El usuario debe estar autenticado."
    );
    return;
  }

  const quantity = 1;

  try {
    const response = await fetch(
      "http://localhost:3000/api/customer/add-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Error al obtener los datos del usuario: ${errorData.message}`
      );
    } else {
      await displayCart();
      await displayHistory();
    }
  } catch (error) {
    console.error("Error al agregar el producto al pedido:", error);
  }
}

const editProduct = (productId) => {
  window.location.href = `editProduct.html?id=${productId}`;
};
