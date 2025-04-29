const jwt = require('jsonwebtoken');
const jwtConfig = require("../config/jwtConfig");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send({ status: 401, message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtConfig.secret);

    const userData = { id: decoded.id, nombre: decoded.nombre, email: decoded.email, rol: decoded.rol };
    if (userData.rol !== 'admin') return res.status(403).send({ status: 403, message: 'No tienes permisos para acceder a esta ruta' });

    next();
  } catch (error) {
    return res.status(403).send({ status: 403, message: 'Token inválido' });
  }
};

module.exports = authenticate;
