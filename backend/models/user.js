const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersPath = path.join(__dirname, '../../data/users.json');

class User {
  static async saveUsers(users) {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  }

  static async getUsers() {
    if (!fs.existsSync(usersPath)) fs.writeFileSync(usersPath, '[]');
    const usersData = fs.readFileSync(usersPath, 'utf-8');
    try {
      return JSON.parse(usersData);
    } catch (error) {
      console.error("User: Error al analizar el archivo JSON:", error);
      return "[]";
    }
  }

  static async createUser(nombre, email, password, rol) {
    const users = await this.getUsers();
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = { id: Date.now(), nombre, email, password: hashedPassword, rol };
    users.push(newUser);
    await this.saveUsers(users);
    return newUser;
  }

  static async findUserByEmail(email) {
    const users = await this.getUsers();
    return users.find(user => user.email === email);
  }
}

module.exports = User;
