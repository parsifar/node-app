const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();

let sessionOptions = session({
  secret: "this is cool!",
  store: MongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60, httpOnly: true },
});

app.use(sessionOptions);

const router = require("./router");

//add user submitted data to req object
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//set the public directory (for css and browser js)
app.use(express.static("public"));

//set the views directory
app.set("views", "views");
//set the templating engine
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
