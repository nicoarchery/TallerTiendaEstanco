const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../../data/products.json');

class Product {
  static async saveProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  }

  static async getProducts() {
    if (!fs.existsSync(productsPath)) fs.writeFileSync(productsPath, '[]');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    try {
      return JSON.parse(productsData);
    } catch (error) {
      console.error("Products: Error al analizar el archivo JSON:", error);
      return "[]";
    }
  }

  static async getProduct(id) {
    const products = await this.getProducts();
    const productId = Number(id);
    return products.find(product => product.id === productId);
  }

  static async createProduct(name, description, price, quantity, image) {
    const products = await this.getProducts();
    const newProduct = { id: Date.now(), name, description, price, quantity, image };
    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  static async editProduct(id, newNombre, newDescription, newPrice, newQuantity, newImage) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    products[productIndex].name = newNombre || products[productIndex].name;
    products[productIndex].description = newDescription || products[productIndex].description;
    products[productIndex].price = newPrice || products[productIndex].price;
    products[productIndex].quantity = newQuantity || products[productIndex].quantity;
    products[productIndex].image = newImage || products[productIndex].image;
    await this.saveProducts(products);
    return products[productIndex];
  }

  static async getAllProducts() {
    return await this.getProducts();
  }
}

module.exports = Product;
