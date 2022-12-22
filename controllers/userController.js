const { databaseName } = require("../db");
const User = require("../models/User");

//middleware to redirect logged-out users to homepage
exports.mustBeLoggedIn = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash("errors", "You must be logged in to do that!");
        req.session.save(function () {
            res.redirect("/");
        });
    }
};

exports.login = function (req, res) {
    //create a new user object with the submitted data
    let user = new User(req.body);
    //run the login method
    user.login()
        .then(() => {
            req.session.user = {
                username: user.data.username,
                avatar: user.avatar,
                _id: user.data._id,
            };
            req.session.save(function () {
                res.redirect("/");
            });
        })
        .catch((err) => {
            //leverage the flash package to add an object called errors to the session
            req.flash("errors", err);
            req.session.save(function () {
                res.redirect("/");
            });
        });
};

exports.logout = function (req, res) {
    //remove the session from the db and redirect to home
    req.session.destroy(function () {
        res.redirect("/");
    });
};

exports.register = function (req, res) {
    //instantiate a new User object and pass the form data to the constructor function
    let user = new User(req.body);

    //execute the register method on the user
    user.register()
        .then(() => {
            req.session.user = {
                username: user.data.username,
                avatar: user.avatar,
                _id: user.data._id,
            };
            req.session.save(function () {
                res.redirect("/");
            });
        })
        .catch((regErrors) => {
            regErrors.forEach(function (error) {
                req.flash("regErrors", error);
            });
            req.session.save(function () {
                res.redirect("/");
            });
        });
};

exports.home = function (req, res) {
    //logged in users
    if (req.session.user) {
        res.render("home-dashboard");
        //logged out users
    } else {
        res.render("home-guest", {
            errors: req.flash("errors"),
            regErrors: req.flash("regErrors"),
        });
    }
};
