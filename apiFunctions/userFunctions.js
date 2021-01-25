var db = require("../dbFiles/connection");
var collection = require("../dbFiles/collections");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const { resolve } = require("path");
// const { resolve } = require("path");
var instance = new Razorpay({
  key_id: "rzp_test_Jt7dPp8jwV1KsB",
  key_secret: "j3G9STm9IILKgchw9VrGRAQ1",
});

module.exports = {
  getUser: (id) => {
    console.log(">>>>>>>>>" + id);
    return new Promise(async (resolve, reject) => {
      let user = db
        .get()
        .collection(collection.USERS)
        .findOne({ _id: ObjectId(id) });
      resolve(user);
    });
  },
  getMenu: () => {
    return new Promise(async (resolve, reject) => {
      let menu = await db
        .get()
        .collection(collection.MENU)
        .aggregate([
          {
            $project: {
              _id: 1,
              Category: 1,
              VegCategory: 1,
              Price: 1,
              Name: 1,
            },
          },
          {
            $group: {
              _id: "$Category",
              Items: { $push: "$$ROOT" },
            },
          },
          {
            $project: {
              _id: 1,
              "Items.Category": 0,
            },
          },
        ])
        .toArray();
      resolve(menu);
    });
  },
  addUser: (data) => {
    return new Promise(async (resolve, reject) => {
      let user = {
        Name: data.Name,
        Password: await bcrypt.hash(data.Password, 10),
        Email: data.Email,
        Mobile: data.Mobile,
      };
      await db
        .get()
        .collection(collection.USERS)
        .insertOne(user)
        .then(() => {
          resolve({ addStatus: true });
        });
    });
  },
  userLogin: (data) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USERS)
        .findOne({ Email: data.Email });
      if (user) {
        await bcrypt.compare(data.Password, user.Password).then((status) => {
          if (status) {
            response.user = user;
            response.loginStatus = true;
            resolve(response);
          } else {
            resolve({ loginStatus: false });
          }
        });
      } else {
        response.loginStatus = false;
      }
      resolve(response);
    });
  },
  addToCart: (itemId, userId) => {
    let orderObject = {
      item: ObjectId(itemId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      console.log(userId);
      let userCart = await db
        .get()
        .collection(collection.CART)
        .findOne({ user: ObjectId(userId) });

      if (userCart) {
        let ItemExist = userCart.orders.findIndex(
          (order) => order.item == itemId
        );
        if (ItemExist != -1) {
          await db
            .get()
            .collection(collection.CART)
            .updateOne(
              { "orders.item": ObjectId(itemId) },
              {
                $inc: { "orders.$.quantity": 1 },
              }
            )
            .then((response) => {
              // console.log(response);
              resolve({ quantityUpdate: true });
            });
        } else {
          await db
            .get()
            .collection(collection.CART)
            .findOneAndUpdate(
              { user: ObjectId(userId) },
              {
                $push: { orders: orderObject },
              },
              {
                $projection: {},
              }
            )
            .then((response) => {
              resolve({ orderUpdate: true });
            });
        }
      } else {
        let firstOrder = {
          user: ObjectId(userId),
          orders: [orderObject],
        };
        await db
          .get()
          .collection(collection.CART)
          .insertOne(firstOrder)
          .then((response) => {
            resolve({ cartUpdate: true });
          });
      }
    });
  },
  getCart: (userID) => {
    console.log(userID);
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collection.CART)
        .aggregate([
          {
            $match: { user: ObjectId(userID) },
          },
          {
            $unwind: "$orders",
          },
          {
            $project: {
              item: "$orders.item",
              quantity: "$orders.quantity",
            },
          },
          {
            $lookup: {
              from: collection.MENU,
              localField: "item",
              foreignField: "_id",
              as: "order",
            },
          },
        ])
        .toArray();
      console.log(cartItems);
      resolve(cartItems);
    });
  },
  getTotal: (userId) => {
    return new Promise(async (resolve, reject) => {
      let price = {};
      let subtotal = await db
        .get()
        .collection(collection.CART)
        .aggregate([
          {
            $match: { user: ObjectId(userId) },
          },
          {
            $unwind: "$orders",
          },
          {
            $project: {
              item: "$orders.item",
              quantity: "$orders.quantity",
            },
          },
          {
            $lookup: {
              from: collection.MENU,
              localField: "item",
              foreignField: "_id",
              as: "order",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              order: { $arrayElemAt: ["$order", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$order.Price"] } },
            },
          },
        ])
        .toArray();
      let gst = (18 * parseInt(subtotal[0].total)) / 100;
      let Dcharge = 50;
      let total = parseInt(subtotal[0].total) + gst + Dcharge;
      price = {
        subtotal: subtotal[0].total,
        GST: gst,
        Dcharge: Dcharge,
        total: total,
      };
      //   console.log(total)
      // console.log(total[0].total);
      console.log(price);
      resolve(price);
    });
  },
  addAddress: (userId, address) => {
    return new Promise((resolve, reject) => {
      let userDetails = db
        .get()
        .collection(collection.USERS)
        .findOne({ _id: ObjectId(userId) });
      if (address.defaultCheck) {
        db.get()
          .collection(collection.USERS)
          .updateOne(
            { _id: ObjectId(userId) },
            {
              $set: { Address: address },
            }
          );
      } else {
        db.get()
          .collection(collection.USERS)
          .updateOne(
            { _id: ObjectId(userId) },
            {
              $set: { tmpAddress: address },
            }
          );
      }
      resolve({ addStatus: true });
    });
  },
  getFromCart: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collection.CART)
        .findOne({ user: ObjectId(userId) });
      resolve(cart.orders);
    });
  },
  checkout: (user, cart, total, addressType) => {
    var orderId = new Date().valueOf();
    return new Promise(async (resolve, reject) => {
      let orderObj = {
        // userId: ObjectId(user._id),
        OrderId: orderId.toString(),
        Ordered_Item: cart,
        Total: total.total,
        Date: new Date(),
        status: "Pending",
        deliveryDetails: {},
      };
      if (addressType.address == "defaultAddress") {
        orderObj.deliveryDetails = {
          FirstName: user.Address.firstname,
          LastName: user.Address.lastname,
          address: user.Address.address,
          country: user.Address.country,
          city: user.Address.city,
          state: user.Address.state,
          zipCode: user.Address.zipcode,
        };
      } else if (addressType.address == "tmpAddress") {
        orderObj.deliveryDetails = {
          FirstName: user.tmpAddress.firstname,
          LastName: user.tmpAddress.lastname,
          address: user.tmpAddress.address,
          country: user.tmpAddress.country,
          city: user.tmpAddress.city,
          state: user.tmpAddress.state,
          zipCode: user.tmpAddress.zipcode,
        };
      }
      // console.log(orderObj);
      let newOrder = {};
      let userExist = await db
        .get()
        .collection(collection.ORDERS)
        .findOne({ user: ObjectId(user._id) });

      if (userExist) {
        // console.log(">>>>>>>>> if here");
        // console.log(userExist);
        await db
          .get()
          .collection(collection.ORDERS)
          .updateOne(
            { user: ObjectId(user._id) },
            { $push: { orders: orderObj } }
          );
        resolve(orderObj);
      } else {
        console.log(">>>>>>>>>>>>>>>>>>>else here");
        await db
          .get()
          .collection(collection.ORDERS)
          .insertOne({ user: user._id, orders: [orderObj] })
          .then(() => {
            resolve(orderObj);
          });
      }
    });
  },
  payment: (orderId, total) => {
    let Rtotal = Math.round(total.total);
    return new Promise((resolve, reject) => {
      var options = {
        amount: Rtotal * 100,
        currency: "INR",
        receipt: "" + orderId,
      };
      console.log(options);
      instance.orders.create(options, function (err, Rorder) {
        // console.log(">>>>>>>>>>>>>>>>>>>>>",Rorder);
        // console.log(err)
        resolve(Rorder);
      });
    });
  },
  verifyPayment: (details) => {
    // console.log(details)
    // console.log(details["paymentDetails[razorpay_payment_id]"]);
    // console.log(details["paymentDetails[razorpay_order_id]"])
    // console.log(details["paymentDetails[razorpay_signature]"])
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "j3G9STm9IILKgchw9VrGRAQ1");
      // console.log("hmac",hmac)
      hmac.update(
        details["paymentDetails[razorpay_order_id]"] +
          "|" +
          details["paymentDetails[razorpay_payment_id]"]
      );
      // console.log("hmac",hmac)
      hmac = hmac.digest("hex");
      if (hmac === details["paymentDetails[razorpay_signature]"]) {
        // console.log("resolved")
        resolve();
      } else {
        // console.log("rejected")
        reject();
      }
    });
  },
  changeStatus: (userId, objId) => {
    console.log("from changeStatus");
    console.log("--------", userId);
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ORDERS)
        .updateOne(
          {
            user: ObjectId(userId),
            "orders.OrderId": objId,
          },
          { $set: { "orders.$.status": "Placed" } }
        );
      // console.log(">>>>>>>>>>>", u);
      resolve({ changeStatus: true });
    });
  },
  confirmMail:(user)=>{
console.log(user)
return new Promise((resolve,reject)=>{

  var message=`Thanks ${user.Name} <br> The order you placed at Foodie.com is confirmed.<br>You can track your order in Foodie.com/orders`

  var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'xlabsoffical@outlook.com',
      pass: 'microsoft123#'
    }
  });
  
  var mailOptions = {
    from:'xlabsoffical@outlook.com',
    to: user.Email,
    subject: "Order Confirmation",
    text:message
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
resolve()
})
  }
};
