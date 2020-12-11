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
};
