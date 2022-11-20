const User = require("../models/User");

exports.login = function () {};

exports.logout = function () {};

exports.register = function (req, res) {
  //instantiate a new User object and pass the form data to the contructor function
  let user = new User(req.body);

  //execute the register method on the user
  user.register();

  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("congrats!");
  }
};

exports.home = function (req, res) {
  res.render("home-guest");
};
