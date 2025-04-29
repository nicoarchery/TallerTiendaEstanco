const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtConfig = require("../config/jwtConfig");

exports.register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  const existingUser = await User.findUserByEmail(email);

  if (existingUser)
    return res.status(400).send({ message: "El usuario ya existe" });

  const user = await User.createUser(nombre, email, password, rol);

  res.status(200).send(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ message: "Credenciales incorrectas" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      rol: user.rol,
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  res.status(200).send({ token });
};

exports.userData = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader)
      return res
        .status(401)
        .send({ status: 401, message: "No se proporcionó un token" });
    else if (!authHeader.startsWith("Bearer "))
      return res
        .status(401)
        .send({ status: 401, message: "Token mal formado" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, jwtConfig.secret);

    const token2 = jwt.sign(
      {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        password: decoded.password,
        rol: decoded.rol,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.status(200).send({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      rol: decoded.rol,
      token: token2,
    });
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    res
      .status(500)
      .send({ status: 500, message: "Error al obtener los datos del usuario" });
  }
};
