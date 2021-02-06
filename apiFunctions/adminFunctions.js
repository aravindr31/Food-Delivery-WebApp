var db = require("../dbFiles/connection");
var collection = require("../dbFiles/collections");
const { ObjectId } = require("mongodb");
module.exports = {
  addDish: (data) => {
    // console.log(data);
    let category = data.Category;
    console.log(category);
    return new Promise(async (resolve, reject) => {
      await db.get().collection(collection.MENU).insertOne(data);
      resolve({ addStatus: true });
    });
  },
  getMenu: () => {
    return new Promise(async (resolve, reject) => {
      let menu = await db.get().collection(collection.MENU).find().toArray();
      resolve(menu);
    });
  },
  getOrders: () => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collection.ORDERS)
        .find({})
        .toArray();
      // console.log(orders);
      resolve(orders)
    });
  },
  changeStatus:(statusObject)=>{
    // console.log(statusObject)
    return new Promise(async(resolve,reject)=>{
     let user= await db
      .get()
      .collection(collection.ORDERS)
      .findOne({ user: ObjectId(statusObject.user) ,orders:{$elemMatch:{OrderId:statusObject.orderId}}})
    //  if(user){
      await db
      .get()
      .collection(collection.ORDERS)
      .updateOne(
        { user: ObjectId(statusObject.user) ,orders:{$elemMatch:{OrderId:statusObject.orderId}}},
        {
          $set: {
           "orders.$.status":statusObject.status
          },
        }
      )
      .then(() => {
        // console.log(response)
        resolve(statusObject.status);
      });
     
    // console.log(user)
    })
  }
};
