const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const hashedPass = bcrypt.hashSync(password, 10);
  User.create({
    email: email,
    firstname: firstname,
    lastname: lastname,
    username: username,
    password: hashedPass,
  })
    .then(function (user) {
      res.sendStatus(201);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then(function (user) {
      if (user) {
        userPass = user.password;
        userEmail = user.email;
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({ userEmail }, process.env.SECRET_KEY, {
            expiresIn: "24h",
          });
          res.json({
            email: user.email,
            username: user.username,
            id: user.id,
            token: token,
            message: "Logged In",
          });
        } else {
          res.status(401).json({
            message: "Unauthorized",
          });
        }
      } else {
        res.send("email or password not correct");
      }
    })
    .catch((error) => res.send(error));
};
