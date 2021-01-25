// addToCart: (itemId, userId) => {
//     let orderObject = {
//       item: ObjectId(itemId),
//       quantity: 1,
//     };
//     return new Promise(async (resolve, reject) => {
//       console.log(userId);
//       let userCart = await db
//         .get()
//         .collection(collection.CART)
//         .findOne({ user: ObjectId(userId) });

//       if (userCart) {
//         let ItemExist = userCart.orders.findIndex(
//           (order) => order.item == itemId
//         );
//         if (ItemExist != -1) {
//           db.get()
//             .collection(collection.CART)
//             .updateOne(
//               { "orders.item": ObjectId(itemId) },
//               {
//                 $inc: { "orders.$.quantity": 1 },
//               }
//             )
//             .then((response) => {
//               console.log(response)
//               resolve();
//             });
//         } else {
//           db.get()
//             .collection(collection.CART)
//             .updateOne(
//               { user: ObjectId(userId) },
//               {
//                 $push: { orders: orderObject },
//               }
//             )
//             .then((response) => {
//               console.log(response)
//               resolve();
//             });
//         }
//       } else {
//         let firstOrder = {
//           user: ObjectId(userId),
//           orders: [orderObject],
//         };
//         db.get()
//           .collection(collection.CART)
//           .insertOne(firstOrder)
//           .then((response) => {
//             console.log(response)
//             resolve();
//           });
//       }
//     });
//   },
//   getCart: (userID) => {
//     console.log(userID)
//     return new Promise(async (resolve, reject) => {
//       let cartItems = await db
//         .get()
//         .collection(collection.CART).aggregate([
//           {
//             $match :{user: ObjectId(userID) }
//           },
//           {
//             $unwind:"$orders"
//           },
//           {
//             $project: {
//               item: "$orders.item",
//               quantity: "$orders.quantity",
//             },
//           },
//           {
//             $lookup: {
//               from: collection.MENU,
//               localField: "item",
//               foreignField: "_id",
//               as: "order",
//             },
//           },
//         ]).toArray()
//         console.log(cartItems)
//         resolve(cartItems)
//         });
// },

//Passport auth

  //   checkPassword:(data)=>{
  //   return new Promise((resolve,reject)=>{
  //     await bcrypt.compare(data.password, user.Password).then((status) => {
  //       resolve(status)
  //     })
  //   })
  //   }
  // };

  // if (user) {
  //   await bcrypt.compare(data.Password, user.Password).then((status) => {
  //      if (status) {
  //        response.user = user;
  //        response.loginStatus = true;
  //        resolve(response);
  //      } else {
  //        resolve({ loginStatus: false });
  //      }
  //    });


  //cart css

  cart
.adminButton {
  height: 60px;
  width: 60px;
  background-color: #57C67F;;
  border-radius: 50%;
  display: block;
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
.adminButton:hover {
  color: white;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.adminActions > button {
  background-color: #fff;
  border-radius: 50%;
  color: #fff;
}
.buttonimg {
  height: 35px;
}
.sidebar {
  height: 100vh;
  width: 0;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  overflow-x: hidden;
  transition: 0.3s;
  padding-top: 25px;
  border-right: 1px solid lightgray;
  margin-top: 75px;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  flex: 0.1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid lightgray;
}
.sidebar-content {
  flex: 0.7;
  overflow-x: hidden;
  overflow-y: scroll;
}
.sidebar-footer {
  flex: 0.2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  margin-bottom: calc(100% - 82%);
  border-top: 1px solid lightgray;
  padding:20px ;
}
.sidebar-header .closebtn {
  position: absolute;
  top: 0;
  right: 20px;
  font-size: 36px;
  margin-left: 5px;
  text-decoration: none;
  color: #000;
}

.openbtn {
  font-size: 20px;
  cursor: pointer;
  background-color: #fff;
  color: white;
  padding: 10px 15px;
  border: none;
}

.openbtn:hover {
  /* background-color: #444; */
  color: white;
}
@media screen and (max-height: 450px) {
  .sidebar {
    padding-top: 15px;
  }
}
.sidebar-content {
  overflow-y: scroll;
}
.sidebar-content > .card {
  margin: 0 20px;
  width: 90%;
}
.cartCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  border-bottom: 1px solid lightgray;
}
.cart-left {
  flex: 0.3;
}
.card-left > h5 {
  font-weight: 500;
  font-size: 15px;
}
.cart-right {
  flex: 0.4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.card-right > .top {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  border: 1px solid lightgray;
  border-radius: 10px;
}
.card-right > .top > .btn {
  background-color: white;
  color: grey;
  font-size: large;
  font-weight: bold;
  text-align: center;
  padding: 15px, 15px;
}
.card-right > .top > .btn:hover {
  background-color: #ffa500;
  color: white;
  border-radius: 10px;
}
.card-right > .top > h5 {
  font-weight: bold;
  font-size: 15px;
  margin: 1px 0;
}
.card-right > .bottom {
  padding-top: 20px;
}
.card-right > .bottom > h5 {
  font-size: 17px;
  font-weight: 600;
}
.subtotal{
margin-left:auto;
margin-right: 20px;
}
.subtotal >h4{
  font-size: 20px;
  font-weight: 500;
}
.sidebar-footer >.btn{
  background-color: #60B246;
  color: white;
  font-weight: 500;
}
.sidebar-footer >.btn:hover{
  color: white;
}