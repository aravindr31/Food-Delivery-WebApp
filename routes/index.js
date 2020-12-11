var express = require("express");
var router = express.Router();
var apiFunction = require("../apiFunctions/userFunctions");
// const passport = require("passport")
// const initializePassport = require ("../apiFunctions/passportConfig")
// initializePassport(passport)

/* GET home page. */
router.get("/", async (req, res, next) => {
  let menu = await apiFunction.getMenu();
  res.render("User/Home", {
    title: "Foodies.com",
    cssFile: "User_Home.css",
    menu: menu,
    Items: menu.Items,
    count: menu.length,
  });
});

router.get("/login", (req, res) => {
  res.render("User/Login", { cssFile: "Login.css", title: "Foodies.com" });
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  await apiFunction.userLogin(req.body).then((response) => {
    if (response.loginStatus) {
      res.redirect("/");
    } else {  
      res.send("Sorry try again");
    }
  });
});

router.post("/register", (req, res) => {
  console.log(req.body);
  apiFunction.addUser(req.body).then((statusData) => {
    if (statusData) {
      res.redirect("/login");
    } else {
      res.send("Sorry try again");
    }
  });
});
module.exports = router;
