var express = require("express");
var router = express.Router();
var apiFunction = require("../apiFunctions/adminFunctions");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  let menu = await apiFunction.getMenu();
  console.log(">>>>>>>>>", menu);
  res.render("Admin/Home", {
    title: "Foodies.com",
    cssFile: "Admin_Home.css",
    menu: menu,
    admin: true,
  });
});
// let addCheck = false;
router.get("/add-dish", (req, res) => {
  res.render("Admin/Add-Dish", {
    title: "Foodies.com",
    cssFile: "Add_Dish.css",
    admin: true,
    // addCheck,
  });
});
router.post("/adddish", (req, res) => {
  console.log(req.body);
  apiFunction.addDish(req.body).then((response) => {
    if (response.addStatus) {
      // addCheck = true;
      res.redirect("/admin/add-dish");
    } else {
      res.redirect("/admin/add-dish");
    }
  });
});

module.exports = router;
