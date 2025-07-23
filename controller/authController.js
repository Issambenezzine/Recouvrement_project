require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Gestionnaire = require("../models/Gestionnaire");
const Responsable = require("../models/Responsable");
const Admin = require("../models/Admin.js");
const UserLogs = require("../models/UserLogs.js");

const users = [];

exports.login = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.signup = async (req, res) => {
  const user = users.find((user) => user.username == req.body.username);
  if (user == null) {
    return res.status(400).send("Cannot find the user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not allowed");
    }
  } catch {
    res.status(500).send();
  }
};

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.login2 = (req, res) => {
  const username = req.body.username;
  const id = req.body.id;
  const user = { id: id, username: username };

  const accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY);
  res.json({ accessToken: accessToken });
};

module.exports.signup_get = (req, res) => {};

module.exports.login_get = (req, res) => {};

module.exports.signup_post = async (req, res) => {
  try {
    const { username, password, email, tel, role } = req.body;
    const dateEmb = new Date();
    if (role === "GESTIONNAIRE") {
      const gestionnaire = await Gestionnaire.create({
        username,
        password,
        email,
        tel,
        dateEmb,
      });
      if (!gestionnaire) {
        return res.status(502).send("Error saving gestionnaire");
      }
      return res
        .status(200)
        .send(`Successfully saving Gestionnaire : ${gestionnaire.username}`);
    }
    if (role === "RESPONSABLE") {
      const responsable = await Responsable.create({
        username,
        password,
        email,
        tel,
        dateEmb,
      });
      if (!responsable) {
        return res.status(502).send("Error saving responsable");
      }
      return res
        .status(200)
        .send(`Successfully saving Responsable : ${responsable.username}`);
    }
  } catch (err) {
    return res.status(500).send(`Error signing up : ${err.message}`);
  }
};

module.exports.login_post = async (req, res) => {
  try {
    const { password, email } = req.body;
    let role = "";
    let User = await Admin.findOne({ where: { email: email } });
    if (User) {
      role = "ADMIN";
    } else {
      User = await Responsable.findOne({ where: { email: email } });
      if (User) {
        role = "RESPONSABLE";
      } else {
        User = await Gestionnaire.findOne({ where: { email: email } });
        if (User) {
          role = "GESTIONNAIRE";
        } else {
          return res.status(401).json({ message: "Invalid credentials" });
        }
      }
    }
    const valid = bcrypt.compareSync(password, User.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (User.activation === "Block") {
      return res.status(401).json({ message: "Vous n'êtes pas autorisé" });
    }
    const token = jwt.sign(
      { id: User.id, email: User.email, role, name: User.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );
    if (role !== "ADMIN") {
      await UserLogs.create({
        user: User.username,
        userRole: role,
        action: "Se connecter",
        timestamp: new Date(),
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax", // Important for cross-origin
      maxAge: 86400000, // 24 hours
    });
    res.json({
      message: "Logged in",
      role,
      name: User.username,
      email: User.email,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(`Internal Server Error : ${err.message}`);
  }
};

module.exports.logout = async (req, res) => {
  const user = req.user;
  try {
    if (user.role !== "ADMIN") {
      await UserLogs.create({
        user: user.name,
        userRole: user.role,
        action: "Se déconnecter",
        timestamp: new Date(),
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax", // must match the cookie options
      secure: false, // true in production with https
    });
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).send(`Cannot logout : ${err.message}`);
  }
};
