const Product = require("../models/product");

const getProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.getProduct(id);
    if (!product)
      return res
        .status(404)
        .json({ status: 404, message: "Producto no encontrado" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res
      .status(500)
      .json({ status: 500, message: "Error al obtener el producto", error });
  }
};

const addProduct = async (req, res) => {
  const { name, description, price, quantity } = req.body;
  let image = req.file ? `../data/img/${req.file.path}` : null;

  try {
    if (!name || !description || !price || !quantity || !image) {
      return res
        .status(400)
        .json({ status: 400, message: "Todos los campos son requeridos" });
    }

    const products = await Product.getProducts();
    if (products.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return res
        .status(400)
        .json({ status: 400, message: `El producto "${name}" ya existe.` });
    }

    const newProduct = await Product.createProduct(
      name,
      description,
      price,
      quantity,
      image
    );
    res.status(201).json({
      status: 201,
      message: "Producto agregado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error al agregar el producto:", error.message);
    res.status(500).json({
      status: 500,
      message: `Error al agregar el producto ${error.message}`,
    });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const products = await Product.getProducts();
    const productIndex = products.findIndex((p) => p.id === parseInt(id));
    if (productIndex === -1)
      return res
        .status(404)
        .json({ status: 404, message: "Producto no encontrado" });

    const updatedProduct = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description || products[productIndex].description,
      price: price || products[productIndex].price,
      quantity: quantity || products[productIndex].quantity,
      image: image || products[productIndex].image,
    };

    products[productIndex] = updatedProduct;
    await Product.saveProducts(products);
    res.json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .json({ status: 500, message: "Error al actualizar el producto", error });
  }
};

module.exports = { getProduct, addProduct, editProduct };
