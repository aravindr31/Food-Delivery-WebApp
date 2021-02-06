var express = require("express");
var router = express.Router();
var apiFunction = require("../apiFunctions/userFunctions");
// const passport = require("passport")
// const initializePassport = require ("../apiFunctions/passportConfig")
// initializePassport(passport)

//verify login middileware
const verifyLogin = (req, res, next) => {
  if (req.session.userLogin) {
    next();
  } else {
    res.redirect("/login");
  }
};
/* GET home page. */
router.get("/", async (req, res, next) => {
  let user = req.session.user;
  let menu = await apiFunction.getMenu();
  // let cart = await apiFunction.getCart(user._id);
  console.log(menu[0].Items);
  res.render("User/Home", {
    title: "Foodies.com",
    cssFile: "User_Home.css",
    menu: menu,
    // cart: cart,
    user: user,
    // Items: menu.Items,
    count: menu.length,
  });
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/Login", {
      cssFile: "Login.css",
      title: "Foodies.com",
      Message: req.session.loginError,
    });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  await apiFunction.userLogin(req.body).then((response) => {
    if (response.loginStatus) {
      req.session.userLogin = true;
      req.session.user = response.user;
      console.log(req.session);
      res.redirect("/");
    } else {
      req.session.loginError = "Invalid Username or Password Try Again";
      res.redirect("/login");
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
router.get("/addtocart/:id", (req, res) => {
  console.log(req.params.id);
  let user = req.session.user;
  apiFunction.addToCart(req.params.id, user._id).then(() => {
    res.json({ addStatus: true });
  });
});
router.get("/cart", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let cart = await apiFunction.getCart(user._id);
  console.log(cart)
  if(cart.length>0){
    let total = await apiFunction.getTotal(user._id);
  res.render("User/Cart", {
    title: "Foodies.com", 
    cssFile: "Cart.css",
    user: user,
    cart: cart,
    total: total,
  });
}
else{
  res.render("User/Cart", {
    title: "Foodies.com",
    cssFile: "Cart.css",
    user: user,
  });
}
})
//   let total = await apiFunction.getTotal(user._id);
//   res.render("User/Cart", {
//     title: "Foodies.com",
//     cssFile: "Cart.css",
//     user: user,
//     cart: cart,
//     total: total,
//   });
// });
router.get("/checkout", verifyLogin, async (req, res) => {
  let sessionUser = req.session.user;
  let user = await apiFunction.getUser(sessionUser._id);
  let cart = await apiFunction.getCart(sessionUser._id);
  let total = await apiFunction.getTotal(sessionUser._id);
  // let user = await apiFunction.getUser(sessionUser._id)

  console.log(user);
  // if (user.Address) {
  res.render("User/Checkout", {
    title: "Foodies.com",
    cssFile: "Checkout.css",
    user: user,
    cart: cart,
    total: total,
    // address:user.Address,
  });
  // } else {
  //   res.render("User/Checkout", {
  //     title: "Foodies.com",
  //     cssFile: "Checkout.css",
  //     user: user,
  //   });
  // }
  // });
});
router.post("/addAddress", (req, res) => {
  let user = req.session.user;
  console.log(req.body);
  apiFunction.addAddress(user._id, req.body).then((response) => {
    res.json(response);
  });
});
router.post("/checkout", verifyLogin, async (req, res) => {
  let sessionUser = req.session.user;
  console.log(req.body);
  let user = await apiFunction.getUser(sessionUser._id);
  let cartItems = await apiFunction.getFromCart(sessionUser._id);
  let total = await apiFunction.getTotal(sessionUser._id);
  let order = await apiFunction.checkout(user, cartItems, total, req.body);
  await apiFunction.confirmMail(sessionUser);
  let paymentObj = await apiFunction.payment(order.OrderId, total);
  // console.log(order,paymentObj)
  res.json({ user, order, paymentObj });
  // console.log(order)
});
router.get("/ordersuccess", verifyLogin, (req, res) => {
  let user = req.session.user;
  // console.log("in order success--------------------");
  res.render("user/Order_Success", {
    cssFile: "Order_Success.css",
    title: "Foodies.com",
    user: user,
  });
});
router.post("/paymentVerification", async (req, res) => {
  console.log("from index pay verify1");
  let sessionUser = req.session.user;
  await apiFunction.verifyPayment(req.body).then(() => {
    // res.json({ redirect: true });
    console.log("from index verifypay");
    apiFunction
      .changeStatus(sessionUser._id, req.body["order[receipt]"])
      .then((response) => {
        res.json(response);
      });
  });
});
router.get("/orders",verifyLogin, async(req, res) => {
  let sessionUser = req.session.user;
  let user = await apiFunction.getUser(sessionUser._id);
  let orders = await apiFunction.getOrders(sessionUser._id)
  console.log(orders)
  res.render("User/Orders", {
    cssFile: "Orders.css",
    title: "Foodies.com",
    user: user,
    orders:orders,
  });
});
module.exports = router;
