const express = require("express");
const app = express();

//set the public directory (for css and browser js)
app.use(express.static("public"));

//set the views directory
app.set("views", "views");
//set the templating engine
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("home-guest");
});

app.listen(3000);
