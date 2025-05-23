const Order = require("../models/order");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");

exports.getUnsoldProductsByUser = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtConfig.secret);

        const userId = decoded.id;

        const unsoldProducts = await Order.getOrdersByUserIdUnsold(Number(userId));

        if (!unsoldProducts) {
            return res.status(404).send({
                message: `No se encontró una orden para el usuario con ID ${userId}`,
            });
        }

        const allProducts = await Product.getAllProducts();

        let lista = [];
        for (const element of allProducts) {
            unsoldProducts.products = unsoldProducts.products || [];
            for (const element2 of unsoldProducts.products) {
                if (element.id === element2.id) {
                    element.quantity = element2.quantity;
                    lista.push(element);
                }
            }
        }

        res.status(200).send(lista);
    } catch (error) {
        console.error("Error al obtener productos no vendidos:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
};

exports.getSoldProductsByUser = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtConfig.secret);

        const userId = decoded.id;

        const orders = await Order.getOrders();
        if (!orders) {
            return res.status(404).send({
                message: `No se encontró una orden para el usuario con ID ${userId}`,
            });
        }

        const allProducts = await Product.getAllProducts();

        let lista = [];
        let response = [];
        for (const element of allProducts) {
            for (const order of orders) {
                if (order.userId === userId && order.sold) {
                    for (const product of order.products) {
                        if (element.id === product.id) {
                            element.quantity = product.quantity;
                            lista.push({
                                username: decoded.name,
                                id: element.id,
                                name: element.name,
                                quantity: product.quantity,
                                price: element.price,
                                image: element.image,
                                date: order.date,
                            });
                        }
                    }
                    response.push(lista);
                    lista = [];
                }
            }
        }

        res.status(200).send(response);
    } catch (error) {
        console.error("Error al obtener productos vendidos:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
};

exports.buyCart = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtConfig.secret);

        const userId = decoded.id;

        const unsoldProducts = await Order.getOrdersByUserIdUnsold(Number(userId));
        if (!unsoldProducts) {
            return res.status(404).send({
                message: `No se encontró una orden para el usuario con ID ${userId}`,
            });
        }

        let lista = [];
        const allProducts = await Product.getAllProducts();

        for (const element of unsoldProducts.products) {
            for (const element2 of allProducts) {
                if (element.id === element2.id) {
                    if (element.quantity > element2.quantity) {
                        return res.status(400).send({
                            message: `No hay suficiente stock para el producto ${element2.name}`,
                        });
                    } else {
                        unsoldProducts.date = new Date().toISOString().split("T")[0];
                        unsoldProducts.sold = true;
                        element2.quantity -= element.quantity;
                        await Product.editProduct(
                            element2.id,
                            element2.name,
                            element2.description,
                            element2.price,
                            element2.quantity,
                            element2.image
                        );
                        lista.push({
                            username: decoded.name,
                            id: element2.id,
                            name: element2.name,
                            quantity: element.quantity,
                            price: element2.price,
                            image: element2.image,
                            date: unsoldProducts.date,
                        });
                    }
                }
            }
        }

        for (const element of unsoldProducts.products) {
            await Order.editProductInOrder(
                Number(unsoldProducts.orderId),
                element.id,
                unsoldProducts.date,
                unsoldProducts.sold,
                element
            );
        }

        res.status(200).send(lista);
    } catch (error) {
        console.error("Error al comprar el carrito:", error);
        res
            .status(500)
            .send({ status: 500, message: "Error interno del servidor" });
    }
};

exports.createOrEditOrder = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtConfig.secret);

        const userId = decoded.id;

        const product = await Product.getProduct(Number(productId));

        if (!product) {
            return res
                .status(404)
                .send({ message: `Producto con ID ${productId} no encontrado` });
        }

        const productData = {
            id: product.id,
            quantity: quantity || product.quantity,
        };

        await Order.addProductToOrder(Number(userId), productData);
        res
            .status(200)
            .send({ message: "Producto agregado o actualizado en la orden" });
    } catch (error) {
        console.error("Error al crear o editar la orden:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
};











// Importamos los archivos JSON de productos y órdenes
const fs = require('fs');
const path = require('path');

// Leemos los archivos de productos y órdenes
const ordersFilePath = path.join(__dirname, '../data/orders.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

const getOrders = () => {
    const ordersData = fs.readFileSync(ordersFilePath);
    return JSON.parse(ordersData);
};

const getProducts = () => {
    const productsData = fs.readFileSync(productsFilePath);
    return JSON.parse(productsData);
};

// Función que devuelve el historial de compras con los productos correspondientes
const getPurchaseHistory = (req, res) => {
    const orders = getOrders();
    const products = getProducts();

    if (!orders || !products) {
        return res.status(404).send({ message: 'No se encontraron datos de órdenes o productos.' });
    }

    const purchaseHistory = orders.filter(order => order.sold === true); // Filtramos solo las órdenes vendidas

    const detailedHistory = purchaseHistory.map(order => {
        const orderDetails = {
            orderId: order.orderId,
            date: order.date,
            products: order.products.map(product => {
                const productDetails = products.find(p => p.id === product.id);
                return {
                    name: productDetails ? productDetails.name : 'Producto no encontrado',
                    quantity: product.quantity,
                    price: productDetails ? productDetails.price : 'No disponible'
                };
            }),
            total: calculateTotal(order.products, products) // Calculamos el total de la orden
        };
        return orderDetails;
    });

    res.json(detailedHistory); // Enviamos el historial detallado como respuesta
};

// Función para calcular el total de la orden
const calculateTotal = (products, allProducts) => {
    return products.reduce((total, product) => {
        const productDetails = allProducts.find(p => p.id === product.id);
        if (productDetails) {
            total += parseInt(productDetails.price.replace('.', '').replace(',', '')) * product.quantity;
        }
        return total;
    }, 0);
};

module.exports = { getPurchaseHistory };
