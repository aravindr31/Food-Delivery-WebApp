var db = require("../dbFiles/connection");
var collection = require("../dbFiles/collections");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
module.exports = {
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
           }else{
             response.loginStatus = false
           } 
      resolve(response);
    });
  },

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
 }
