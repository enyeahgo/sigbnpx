var admin = require("firebase-admin");

var serviceAccount = require("./services/sixcavcoypx-firebase-adminsdk-olugw-eae5cc62db.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sixcavcoypx-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

module.exports = admin;