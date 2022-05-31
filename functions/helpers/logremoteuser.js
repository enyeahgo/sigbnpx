const admin = require('../Admin');
const db = admin.database();

module.exports = function logremoteuser(req, res, next) {
  var newEntry = db.ref(`Log`).push().getKey();
  var d = new Date();
  var ipAdd = `${req.ip || req.ips || req.headers['x-forwarded-for'] || req.socket.remoteAddress}`;
  db.ref(`Log/${newEntry}`).set({
    logId: newEntry,
    user: getDevice(req.headers),
    time: d.getTime(),
    page: req.path,
    ipAdd: ipAdd.replace('::ffff:', '')
  });
  next();
}

function getDevice(headers) {
  return headers['user-agent'].split(';')[2].split(')')[0].replace(/[^\w\s]/gi, '');
}