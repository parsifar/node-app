const usersCollection = require("../db").db().collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  //make sure all input data are strings
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  //get rid of bogus data
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("username cannot be empty");
  }
  if (
    this.data.username.length > 0 &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("username should be alphanumeric");
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

User.prototype.login = function () {
  return new Promise((res, rej) => {
    this.cleanUp();

    //query the db for the username
    usersCollection
      .findOne({ username: this.data.username })
      .then((attemptedUserObj) => {
        if (
          attemptedUserObj &&
          bcrypt.compareSync(this.data.password, attemptedUserObj.password)
        ) {
          res("login successfull");
        } else {
          rej("wrong login");
        }
      })
      .catch((err) => console.log(err));
  });
};

User.prototype.register = function () {
  //sanitize user submitted data
  this.cleanUp();
  //validate the user data
  this.validate();

  //if valid then store user in the db
  if (!this.errors.length) {
    //hash the password
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);

    usersCollection.insertOne(this.data).then((result) => {
      console.log(result);
    });
  }
};

module.exports = User;
