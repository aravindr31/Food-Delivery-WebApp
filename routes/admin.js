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
router.get("/allorders", (req, res) => {
  apiFunction.getOrders().then((order)=>{
    res.render("Admin/All-Orders", {
      admin: true,
      order:order,
      title: "Foodies.com",
      cssFile: "All_Orders.css",
    });
  })
});
router.post("/changeStatus",(req,res)=>{
  apiFunction.changeStatus(req.body).then((status)=>{
    console.log(status)
    res.json({status})
  })
})

module.exports = router;
