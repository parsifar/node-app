const usersCollection = require("../db").db().collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const md5 = require("md5");

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
    return new Promise(async (resolve, reject) => {
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

        //only if username is valid then check to see if it's taken
        if (
            this.data.username.length > 2 &&
            validator.isAlphanumeric(this.data.username)
        ) {
            let usernameExists = await usersCollection.findOne({
                username: this.data.username,
            });
            if (usernameExists) {
                this.errors.push("that username is already taken");
            }
        }

        //only if email is valid then check to see if it's taken
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({
                email: this.data.email,
            });
            if (emailExists) {
                this.errors.push("that email is already taken");
            }
        }
        resolve();
    });
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
                    bcrypt.compareSync(
                        this.data.password,
                        attemptedUserObj.password
                    )
                ) {
                    this.data = attemptedUserObj;
                    this.getAvatar();
                    res("login successfull");
                } else {
                    rej("wrong login");
                }
            })
            .catch((err) => console.log(err));
    });
};

User.prototype.register = function () {
    return new Promise(async (resolve, reject) => {
        //sanitize user submitted data
        this.cleanUp();
        //validate the user data
        await this.validate();

        //if valid then store user in the db
        if (!this.errors.length) {
            //hash the password
            let salt = bcrypt.genSaltSync(10);
            this.data.password = bcrypt.hashSync(this.data.password, salt);

            await usersCollection.insertOne(this.data).then((result) => {
                console.log(result);
            });
            this.getAvatar();
            resolve();
        } else {
            reject(this.errors);
        }
    });
};

User.prototype.getAvatar = function () {
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`;
};

module.exports = User;
