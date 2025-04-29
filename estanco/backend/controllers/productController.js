const Product = require('../models/product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.status(200).send(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send({ message: 'Error interno del servidor' });
  }
};
