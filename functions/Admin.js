var admin = require("firebase-admin");

var serviceAccount = require("<insert path of your service account json file>");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "<insert your firebase database URL>"
});

module.exports = admin;
