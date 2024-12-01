const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Environment variabes
const id = process.env.USER_ID;
const pw = process.env.PASSWORD;
const cluster = process.env.CLUSTER_NAME;
const url =
  "mongodb+srv://" + id + ":" + pw + "@" + cluster + ".mongodb.net/todolistDB";

mongoose.connect(url);

const itemsSchema = {
  name: String,
};
new mongoose.Schema(itemsSchema);
const Item = mongoose.model("Item", itemsSchema);

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

//get request to homepage
app.get("/", function (req, res) {
  Item.find({}, function (err, tasks) {
    if (err) {
      console.log(err);
    } else {
      console.log(tasks);
      res.render("list", { listTitle: "Today", newListItems: tasks });
    }
  });
});

//Adding new task
app.post("/", function (req, res) {
  const item = req.body.newItem;
  const listName = req.body.list;

  const i = new Item({
    name: item,
  });

  if (listName === "Today") {
    //Root route
    i.save();
    console.log(123);
    setTimeout(() => {
      res.redirect("/");
    }, 1000);
  } else {
  }
});

//Deleting a task
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    //Root route
    Item.findByIdAndDelete(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted checked item");
        res.redirect("/");
      }
    });
  } else {
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});
app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const id = req.body.username;
  const pass = req.body.password;

  const adminId = "admin";
  const adminPassword = "admin";

  if (id === adminId && pass === adminPassword) {
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});