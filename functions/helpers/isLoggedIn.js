const admin = require('../Admin');
const db = admin.database();

module.exports = function isLoggedIn(req, res, next) {
  if (req.cookies.__session) {
    var uidmobile = req.cookies.__session.uidmobile || '';
    
    db.ref(`Users`).once('value').then(snapshot => {
        var users = Object.values(snapshot.val());
        var person = users.filter(user => `${user.uid}${user.mobile}` == uidmobile);
        if(person == null || person.length == 0 || person == undefined) {
            req.isLoggedIn = false;
            next();
        } else {
            req.isLoggedIn = true;
            req.userdata = person[0];
            next();
        }
    })

  } else {
    req.isLoggedIn = false;
    next();
  }
}