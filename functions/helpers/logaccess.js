const admin = require('../Admin');
const db = admin.database();

// HELPERS
const persdata = require('../helpers/persdata');

module.exports = function logaccess(req, res, next) {
  var sn = req.params.sn;
  var newEntry = db.ref(`AccessLog`).push().getKey();
  var d = new Date();
  db.ref(`AccessLog/${newEntry}`).set({
    sn: sn,
    name: getName(sn),
    time: d.getTime(),
    page: req.path
  });
  next();
}

function getName(sn) {
  return persdata[`${sn}`].rank + " " + persdata[`${sn}`].lname;
}