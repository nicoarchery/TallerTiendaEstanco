const fs = require('fs');
const path = require('path');

const ordersPath = path.join(__dirname, '../../data/orders.json');

class Order {
  static async saveOrders(orders) {
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  }

  static async getOrders() {
    if (!fs.existsSync(ordersPath)) fs.writeFileSync(ordersPath, '[]');
    const ordersData = fs.readFileSync(ordersPath, 'utf-8');
    try {
      return JSON.parse(ordersData);
    } catch (error) {
      console.error("Orders: Error al analizar el archivo JSON:", error);
      return [];
    }
  }

  static async getOrdersByUserId(userId) {
    const orders = await this.getOrders();
    return orders.find(order => order.userId === userId);
  }

  static async getOrdersByUserIdSold(userId) {
    const orders = await this.getOrders();
    return orders.find(order => order.userId === userId && order.sold);
  }

  static async getOrdersByUserIdUnsold(userId) {
    const orders = await this.getOrders();
    return orders.find(order => order.userId === userId && !order.sold);
  }

  static async addProductToOrder(userId, product) {
    const orders = await this.getOrders();
    let userOrder = orders.find(order => order.userId === userId && !order.sold);

    if (userOrder) {
      const existingProduct = userOrder.products.find(p => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        userOrder.products.push(product);
      }
    } else {
      const newOrder = {
        orderId: orders.length > 0 ? Math.max(...orders.map(o => o.orderId)) + 1 : 1,
        userId: userId,
        sold: false,
        date: new Date().toISOString().split('T')[0],
        products: [product],
      };
      orders.push(newOrder);
    }

    await this.saveOrders(orders);
  }

  static async editProductInOrder(orderId, productId, date, sold, updatedProduct) {
    const orders = await this.getOrders();
    const userOrder = orders.find(order => order.orderId === orderId);

    if (!userOrder) {
      throw new Error(`Orden no encontrada con ID ${orderId}`);
    }

    userOrder.date = date || userOrder.date;
    userOrder.sold = sold || userOrder.sold;

    const productIndex = userOrder.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      throw new Error(`Producto con ID ${productId} no encontrado en la orden con ID ${orderId}`);
    }

    userOrder.products[productIndex] = {
      ...userOrder.products[productIndex],
      ...updatedProduct
    };

    await this.saveOrders(orders);
  }

  static async removeProductFromOrder(orderId, productId) {
    const orders = await this.getOrders();
    const userOrder = orders.find(order => order.orderId === orderId);

    if (!userOrder) {
      throw new Error(`Orden no encontrada con ID ${orderId}`);
    }

    const productIndex = userOrder.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      throw new Error(`Producto con ID ${productId} no encontrado en la orden con ID ${orderId}`);
    }

    userOrder.products.splice(productIndex, 1);

    if (userOrder.products.length === 0) {
      orders.splice(orders.indexOf(userOrder), 1);
    }

    await this.saveOrders(orders);
  }

  static async getAllOrders() {
    return await this.getOrders();
  }

  static async markOrderAsSold(orderId) {
    const orders = await this.getOrders();
    const userOrder = orders.find(order => order.orderId === orderId);

    if (!userOrder) {
      throw new Error(`Orden no encontrada con ID ${orderId}`);
    }

    userOrder.sold = true;
    await this.saveOrders(orders);
  }
}

module.exports = Order;
