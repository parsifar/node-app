const validator = require("validator");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("username cannot be empty");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("email is not valid");
  }
  if (this.data.password == "") {
    this.errors.push("password cannot be empty");
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("password should be at least 12 characters");
  }
  if (this.data.password.length > 100) {
    this.errors.push("password should less than 100 characters");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("username should be at least 3 characters");
  }
};

User.prototype.register = function () {
  //validate the user data
  this.validate();

  //if valid then store user in the db
};

module.exports = User;
