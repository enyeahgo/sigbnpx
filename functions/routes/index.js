var express = require('express');
var router = express.Router();
const admin = require('../Admin');
const db = admin.database();
const messaging = admin.messaging();
const auth = admin.auth();
    
// HELPERS
const isLoggedIn = require('../helpers/isLoggedIn');
const constants = require('../helpers/constants');
const persdata = require('../helpers/persdata');
const logaccess = require('../helpers/logaccess');
const logremoteuser = require('../helpers/logremoteuser');

// HOME
router.get('/', logremoteuser, isLoggedIn, (req, res) => {
  var whatsnew;
  var seoImage;
  getWhatsNew().then(w => {
    whatsnew = shuffleArray(w);
    getSeoImage().then(s => {
      seoImage = s;
      if(req.isLoggedIn) {
        res.render('home', {
          whatsnew: whatsnew,
          isLoggedIn: 'yes',
          userdata: req.userdata,
          seoImage: seoImage
        });
      } else {
        res.render('home', {
          whatsnew: whatsnew,
          isLoggedIn: 'no',
          userdata: null,
          seoImage: seoImage
        });
      }
    });
  });
});
router.get('/notifoffer', logremoteuser, isLoggedIn, (req, res) => {
  var whatsnew;
  var seoImage;
  getWhatsNew().then(w => {
    whatsnew = shuffleArray(w);
    getSeoImage().then(s => {
      seoImage = s;
      res.render('notifoffer', {
        whatsnew: whatsnew,
        isLoggedIn: 'yes',
        userdata: req.userdata,
        seoImage: seoImage
      });
    });
  });
});

// NEW ORDER
router.post('/neworder', logremoteuser, async (req, res) => {
  // Save to database
  let newKey = db.ref('/Records').push().getKey();
  await db.ref(`/Records/${newKey}`).set({
    recordId: newKey,
    sn: req.body.sn,
    date: req.body.date,
    total: req.body.total,
    corpo: req.body.corpo,
    items: req.body.items,
    message: req.body.message,
    paid: req.body.paid,
    payment: req.body.payment,
    tid: req.body.tid,
    delivered: req.body.delivered,
    lat: req.body.lat,
    long: req.body.long,
    name: req.body.name,
    mobile: req.body.mobile,
    uid: req.body.uid,
    mytopic: req.body.mytopic
  });

  // Update remaining px items
  db.ref('RemainingPXEstimate').once('value').then(snapshot => {
    let newVal = parseInt(snapshot.val()-parseInt(req.body.total));
    db.ref('RemainingPXEstimate').set(parseInt(newVal));
  });

  // Change after first order
  if(req.body.firstOrder == 'yes') {
    db.ref(`/Users/${req.body.uid}/firstOrder`).set('no');
  }

  // Update user's orders
  db.ref(`/Users/${req.body.uid}/orders`).set(parseInt(req.body.orders)+1);

  // Notify PX Admins
  var finalItems = [];
  req.body.items.forEach(i => {
    finalItems.push(i.replace('|', 'x'));
  });
  
  const message = {
    notification: {
      title: `New Order from ${req.body.name}`,
      body: `${finalItems.join(', ')}; Total: ₱${req.body.total} (${req.body.payment.toUpperCase()}); CP: ${req.body.sn}; Message: ${req.body.message}`
    },
    webpush: {
      fcmOptions: {
        link: '/adminnotifications'
      }
    },
    topic: 'admintopic'
  };

  // Send a message to devices subscribed to the provided topic.
  messaging.send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

// PASABUY ORDER
router.post('/newpborder', logremoteuser, async (req, res) => {
  // Save to database
  let newPBorder = db.ref('Pasabuy/orders').push().getKey();
  await db.ref(`Pasabuy/orders/${newPBorder}`).set({
    recordId: newPBorder,
    instructions: req.body.instructions,
    mobile: req.body.mobile,
    name: req.body.name,
    date: req.body.date,
    delivered: 'no',
    paid: 'no',
    lat: req.body.lat,
    long: req.body.long,
    uid: req.body.uid,
    mytopic: req.body.mytopic,
    fee: req.body.fee
  });
  // Update user's orders
  db.ref(`/Users/${req.body.uid}/orders`).set(parseInt(req.body.orders)+1);

  // // Notify PX Admins
  const message = {
    notification: {
      title: `PasaBuy Order from ${req.body.name}`,
      body: `${req.body.instructions}; Mobile: ${req.body.mobile}; Fee: ${req.body.fee}`
    },
    webpush: {
      fcmOptions: {
        link: '/adminnotifications'
      }
    },
    topic: 'admintopic'
  };

  // // Send a message to devices subscribed to the provided topic.
  messaging.send(message)
    .then((response) => {
  //     // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

// MARK AS PAID
router.post('/markaspaid', (req, res) => {
  db.ref(`/Records/${req.body.recordId}/paid`).set('yes');
  let message = {
    notification: {
      title: `Order Paid`,
      body: `Your payment for your order with order id: ${req.body.tid} has been received. Thank you!`
    },
    webpush: {
      fcmOptions: {
        link: '/#orders'
      }
    },
    topic: req.body.mytopic.toString()
  };

  // Send a message to devices subscribed to the provided topic.
  messaging.send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

// MARK AS DELIVERED
router.post('/markasdelivered', (req, res) => {
  db.ref(`/Records/${req.body.recordId}/delivered`).set('yes');
  let message = {
    notification: {
      title: `Order Delivered`,
      body: `Our delivery personnel is now at your designated pick-up point. Thank you!`
    },
    webpush: {
      fcmOptions: {
        link: '/#orders'
      }
    },
    topic: req.body.mytopic.toString()
  };

  // Send a message to devices subscribed to the provided topic.
  messaging.send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

// MARK AS PAID PASABUY
router.post('/markaspaidpb', (req, res) => {
  db.ref(`Pasabuy/orders/${req.body.recordId}/paid`).set('yes');
  let message = {
    notification: {
      title: `PasaBuy Order Paid`,
      body: `Your payment for your PasaBuy order has been received. Thank you!`
    },
    webpush: {
      fcmOptions: {
        link: '/#orders'
      }
    },
    topic: req.body.mytopic.toString()
  };

  // Send a message to devices subscribed to the provided topic.
  messaging.send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

// MARK AS DELIVERED PASABUY
router.post('/markasdeliveredpb', (req, res) => {
  db.ref(`Pasabuy/orders/${req.body.recordId}/delivered`).set('yes');
  let message = {
    notification: {
      title: `Your PasaBuy Order is here`,
      body: `Please prepare the principal amount plus Php${req.body.fee} as fee. Our delivery personnel is now at your designated pick-up point for your PasaBuy Order. Thank you!`
    },
    webpush: {
      fcmOptions: {
        link: '/#orders'
      }
    },
    topic: req.body.mytopic.toString()
  };

  // Send a message to devices subscribed to the provided topic.
  messaging.send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

// NOTIFY INDIVIDUAL USER
router.get('/notify', (req, res) => {
  getPXPin().then(pin => {
    res.render('notify', {
      pin: pin
    });
  });
});
router.post('/notify', (req, res) => {
  getMyTopic(req.body.mobile.toString()).then( async mytopic => {
    let message = {
      notification: {
        title: `${req.body.title}`,
        body: `${req.body.message}`
      },
      webpush: {
        fcmOptions: {
          link: '/'
        }
      },
      topic: mytopic.toString()
    };
  
    // Send a message to devices subscribed to the provided topic.
    await messaging.send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  });
});

// REGISTER
router.get('/register', logremoteuser, (req, res) => {
  res.render('register');
});
router.post('/register', async (req, res) => {
  let d = new Date();
  db.ref(`Users/${req.body.uid}`).set({
    uid: req.body.uid,
    mobile: req.body.mobile,
    mytopic: req.body.mytopic,
    fname: 'Firstname',
    lname: 'Lastname',
    firstOrder: 'yes',
    orders: 0,
    lat: '11.391452',
    long: '122.439579',
    latLong: '11.391452,122.439579',
    location: '3ID',
    device: getDevice(req.headers),
    locSet: 'no',
    joined: parseInt(d.getTime())
  });
  const expiresIn = 60 * 60 * 24 * 30 * 1000;
  const options = {
    maxAge: expiresIn,
    httpOnly: true
  };
  res.cookie('__session', {
    uidmobile: `${req.body.uid}${req.body.mobile}`
  }, options);
  // Notify Admin 17124
  let message = {
    notification: {
      title: `New User Registration`,
      body: `Mobile: ${req.body.mobile}; UID: ${req.body.uid}`
    },
    webpush: {
      fcmOptions: {
        link: '/remoteusers'
      }
    },
    topic: 'newuser'
  };
  await messaging.send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.sendStatus(200);
    });
});

// LOGIN
router.get('/login', logremoteuser, (req, res) => {
  res.render('login');
});
router.post('/login', (req, res) => {
  const expiresIn = 60 * 60 * 24 * 30 * 1000;
  const options = {
    maxAge: expiresIn,
    httpOnly: true
  };
  res.cookie('__session', {
    uidmobile: `${req.body.uid}${req.body.mobile}`
  }, options);
  res.sendStatus(200);
});

// LOGOUT
router.get('/logout', logremoteuser, (req, res) => {
  res.clearCookie('__session');
  res.redirect('/');
});

// INIT
router.get('/init', isLoggedIn, (req, res) => {
  if(req.isLoggedIn) {
    res.render('init', {
      uid: req.userdata.uid,
      mobile: req.userdata.mobile,
      mytopic: req.userdata.mytopic,
      device: getDevice(req.headers)
    });
  } else {
    res.render('404');
  }
});

// CHANGE NAME
router.get('/changename', isLoggedIn, (req, res) => {
  if(req.isLoggedIn) {
    res.render('changename', {
      uid: req.userdata.uid
    });
  } else {
    res.render('404');
  }
});

// NOTIFICATIONS
router.post('/changenotiftoken', isLoggedIn, async (req, res) => {
  if(req.isLoggedIn) {
    await db.ref(`Users/${req.body.uid}/notificationToken`).set(req.body.notificationToken);
    // Register to User Group
    var newRegTokens = [];
    newRegTokens.push(req.body.notificationToken);
    admin.messaging().subscribeToTopic(newRegTokens, 'usertopic').then(response => {
      
      // Register to Individual User
      let myRegToken = [];
      myRegToken.push(req.body.notificationToken);
      admin.messaging().subscribeToTopic(myRegToken, req.body.mytopic.toString()).then(response => {
        res.send(`Subscribe Done: ${JSON.stringify(response)}`);
        res.sendStatus(200);
      }).catch(error => {
        console.log(`There has been an error: ${error}`);
        res.sendStatus(500);
      });

    }).catch(error => {
      console.log(`There has been an error: ${error}`);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(500);
  }
});
router.post('/deleteToken', isLoggedIn, async (req, res) => {
  if(req.isLoggedIn) {
    // Unsubscribe from User Group
    var regTokensUnsub = [];
    regTokensUnsub.push(req.body.notificationToken);
    await admin.messaging().unsubscribeFromTopic(regTokensUnsub, 'usertopic').then(async response => {

      // Unsubscribe from Individual User
      let myRegTokensUnsub = [];
      myRegTokensUnsub.push(req.body.notificationToken);
      await admin.messaging().unsubscribeFromTopic(myRegTokensUnsub, req.body.mytopic.toString()).then(async response => {
        console.log(`User ${req.body.uid} was unsubscribed from topic.`);
        db.ref(`Users/${req.body.uid}/notificationToken`).set('off');
        res.sendStatus(200);
      }).catch(error => {
        console.log(`Error unsubscribing from topic: ${error}`);
        res.sendStatus(500);
      });

    }).catch(error => {
      console.log(`Error unsubscribing from topic: ${error}`);
      res.sendStatus(500);
    });
  } else {
    res.sendStatus(500);
  }
});

// DELETE ACCOUNT
router.post('/deleteAccount', isLoggedIn, (req, res) => {
  if(req.isLoggedIn) {
    setTimeout(()=>{
      res.sendStatus(200);
    }, 2000);
    // auth.deleteUser(req.body.uid).then(result => {
    // }).catch(err => {
    //   res.sendStatus(500);
    // });
  }
});

// ADMIN
router.get('/admin', (req, res) => {
  var overallTotal = 0;
  getOverallTotal().then(ot => {
    overallTotal = ot;
    db.ref('Items').once('value').then(snapshot => {
      res.render('index', Object.assign(constants, {
        itemDetails: snapshot.val(),
        overallTotal: overallTotal
      }));
    });
  })
});

// ADMIN NOTIFICATIONS
router.get('/adminnotifications', (req, res) => {
  getPXPin().then(pin => {
    res.render('adminnotifications', {
      pin: pin
    });
  });
});
router.post('/adminchangenotiftoken', async (req, res) => {
  await db.ref(`AdminUsers/${req.body.sn}/notificationToken`).set(req.body.notificationToken);
  var newRegTokens = [];
  newRegTokens.push(req.body.notificationToken);
  admin.messaging().subscribeToTopic(newRegTokens, 'admintopic').then(async response => {
    res.send(`Subscribe Done: ${JSON.stringify(response)}`);
    res.sendStatus(200);
  }).catch(error => {
    res.send(`There has been an error: ${error}`)
  });
});
router.post('/admindeleteToken', async (req, res) => {
  var regTokensUnsub = [];
  regTokensUnsub.push(req.body.notificationToken);
  await admin.messaging().unsubscribeFromTopic(regTokensUnsub, 'admintopic').then(async response => {
    console.log(`User ${req.body.sn} was unsubscribed from topic.`);
    db.ref(`AdminUsers/${req.body.sn}/notificationToken`).set('off');
    res.sendStatus(200);
  }).catch(error => {
    console.log(`Error unsubscribing from topic: ${error}`);
    res.sendStatus(500);
  });
});

// REGISTER TO TOPIC
router.get('/reg', (req, res) => {
  getPXPin().then(pin => {
    res.render('reg', {
      pin: pin
    });
  });
});
router.post('/reg', (req, res) => {
  let tokens = [];
  tokens.push(req.body.token);
  admin.messaging().subscribeToTopic(tokens, req.body.topic.toString()).then(response => {
    console.log(`Subscribe Done: ${JSON.stringify(response)}`);
    res.sendStatus(200);
  }).catch(error => {
    console.log(`There has been an error: ${error}`);
    res.sendStatus(500);
  });
});

// SHOW REMOTE USERS LOG
router.get('/remoteusers', (req, res) => {
  getPXPin().then(pin => {
    res.render('remoteusers', {
      pin: pin
    });
  });
});
router.post('/clearremoteusers', (req, res) => {
  db.ref('Log').set(null);
  res.sendStatus(200);
})

// SCANNER
router.get('/scanner', (req, res) => {
  res.render('scanner');
});
router.get('/scanner_', (req, res) => {
  res.render('scanner_');
});

router.get('/store/:sn', logaccess, (req, res) => {
  res.render('store', Object.assign(constants, {
    user: req.params.sn
  }));
});

// RECORDS
router.get('/records/:sn', logaccess, (req, res) => {
  res.render('records', {
    user: req.params.sn
  });
});

router.get('/recordscorpo/:sn', logaccess, (req, res) => {
  res.render('recordscorpo', {
    user: req.params.sn
  });
});

router.get('/record/:sn/:date/:total/:tid/:items', logaccess, (req, res) => {
    var newKey = db.ref('Records').push().getKey();
    db.ref(`Records/${newKey}`).set({
      recordId: newKey,
      sn: req.params.sn,
      date: parseInt(req.params.date),
      total: parseInt(req.params.total),
      corpo: 'no',
      items: req.params.items.split('_'),
      message: 'Non-corpo',
      paid: 'no'
    });
    // Update remaining px items
    db.ref('RemainingPXEstimate').once('value').then(snap => {
      let newVal = parseInt(snap.val()-parseInt(req.body.total));
      db.ref('RemainingPXEstimate').set(parseInt(newVal));
    });
    // Update transactions
    db.ref(`Transactions/${req.params.tid}/status`).set('success');
    res.redirect(`/scanner_`);

});

router.get('/altrecord/:sn/:date/:total/:corpo/:items', (req, res) => {

  if(req.params.corpo == 'yes') {
    var corpoMembers = req.params.sn.split('_');
    var eachPersonnel = Math.round(parseInt(req.params.total)/corpoMembers.length);
    var items_ = req.params.items.split('_');
    var finalItems = [];
    items_.forEach(i => {
      finalItems.push(i.replace('|', 'x'));
    });
    var message = `Corpo with ${corpoMembers.join(',')} (Php${eachPersonnel} each) == ${finalItems.join(',')}`;
    // Insert a corpo record
    let newKey = db.ref('Records').push().getKey();
    db.ref(`Records/${newKey}`).set({
      recordId: newKey,
      sn: 'Corpo',
      date: parseInt(req.params.date),
      total: parseInt(req.params.total),
      corpo: 'no',
      items: req.params.items.split('_'),
      message: message,
      paid: 'no'
    });
    // Update remaining px items
    db.ref('RemainingPXEstimate').once('value').then(snap => {
      let newVal = parseInt(snap.val()-parseInt(req.body.total));
      db.ref('RemainingPXEstimate').set(parseInt(newVal));
    });
    // Insert to each personnel
    corpoMembers.forEach(member => {
      var nk = db.ref('Records').push().getKey();
      db.ref(`Records/${nk}`).set({
        recordId: nk,
        sn: member,
        date: parseInt(req.params.date),
        total: eachPersonnel,
        corpo: 'yes',
        items: req.params.items.split('_'),
        message: message,
        paid: 'no'
      });
    });
    res.redirect('/recordscorpo/12345');

  } else {
    let newKey_ = db.ref('Records').push().getKey();
    db.ref(`Records/${newKey_}`).set({
      recordId: newKey_,
      sn: req.params.sn,
      date: parseInt(req.params.date),
      total: parseInt(req.params.total),
      corpo: 'no',
      items: req.params.items.split('_'),
      message: 'Non-corpo',
      paid: 'no'
    });
    // Update remaining px items
    db.ref('RemainingPXEstimate').once('value').then(snap => {
      let newVal = parseInt(snap.val()-parseInt(req.body.total));
      db.ref('RemainingPXEstimate').set(parseInt(newVal));
    });
    res.redirect(`/altmyrecord/${req.params.sn}`);
  }
});

router.post('/altrecord', (req, res) => {

  if(req.body.corpo == 'yes') {
    var corpoMembers = req.body.sn.split('_');
    var eachPersonnel = Math.round(parseInt(req.body.total)/corpoMembers.length);
    var items_ = req.body.items.split('_');
    var finalItems = [];
    items_.forEach(i => {
      finalItems.push(i.replace('|', 'x'));
    });
    var message = `Corpo with ${corpoMembers.join(',')} (Php${eachPersonnel} each) == ${finalItems.join(',')}`;
    // Insert a corpo record
    let newKey = db.ref('Records').push().getKey();
    db.ref(`Records/${newKey}`).set({
      recordId: newKey,
      sn: 'Corpo',
      date: parseInt(req.body.date),
      total: parseInt(req.body.total),
      corpo: 'no',
      items: req.body.items.split('_'),
      message: message,
      paid: 'no'
    });
    // Update remaining px items
    db.ref('RemainingPXEstimate').once('value').then(snap => {
      let newVal = parseInt(snap.val()-parseInt(req.body.total));
      db.ref('RemainingPXEstimate').set(parseInt(newVal));
    });
    // Insert to each personnel
    corpoMembers.forEach(member => {
      let nk = db.ref('Records').push().getKey();
      db.ref(`Records/${nk}`).set({
        recordId: nk,
        sn: member,
        date: parseInt(req.body.date),
        total: eachPersonnel,
        corpo: 'yes',
        items: req.body.items.split('_'),
        message: message,
        paid: 'no'
      });
    });
    res.sendStatus(200);

  } else {
    let newKey_ = db.ref('Records').push().getKey();
    db.ref(`Records/${newKey_}`).set({
      recordId: newKey_,
      sn: req.body.sn,
      date: parseInt(req.body.date),
      total: parseInt(req.body.total),
      corpo: 'no',
      items: req.body.items.split('_'),
      message: 'Non-corpo',
      paid: 'no'
    });
    // Update remaining px items
    db.ref('RemainingPXEstimate').once('value').then(snap => {
      let newVal = parseInt(snap.val()-parseInt(req.body.total));
      db.ref('RemainingPXEstimate').set(parseInt(newVal));
    });
    res.sendStatus(200);
  }
});

router.get('/myrecord/:sn', (req, res) => {
  db.ref('Records').once('value').then(snapshot => {
    let myrecords = Object.values(snapshot.val()).filter(record => (parseInt(record.sn) == parseInt(req.params.sn)) && (record.paid == 'no') );
    res.render('myrecord', {
      records: myrecords.reverse(),
      user: req.params.sn
    });
  });
});

router.get('/altmyrecord/:sn', (req, res) => {
  db.ref('Records').once('value').then(snapshot => {
    let myrecords = Object.values(snapshot.val()).filter(record => (parseInt(record.sn) == parseInt(req.params.sn)) && (record.paid == 'no') );
    res.render('altmyrecord', {
      records: myrecords.reverse(),
      user: req.params.sn
    });
  });
});

router.get('/perrecord_/:sn', (req, res) => {
  getRecIds(req.params.sn).then(recIds => {
    db.ref('Records').once('value').then(snapshot => {
      let myrecords = Object.values(snapshot.val()).filter(record => (parseInt(record.sn) == parseInt(req.params.sn)) && (record.paid == 'no') );
      res.render('perrecord_', {
        user: req.params.sn,
        recIds: recIds.join(','),
        records: myrecords.reverse()
      });
    });
  });
});

router.get('/perrecord/:sn', (req, res) => {
  db.ref('Records').once('value').then(snapshot => {
    let myrecords = Object.values(snapshot.val()).filter(record => (parseInt(record.sn) == parseInt(req.params.sn)) && (record.paid == 'no') );
    res.render('perrecord', {
      records: myrecords.reverse(),
      user: req.params.sn
    });
  });
});

// ADD ITEMS
router.get('/additem', (req, res) => {
  res.render('additem');
});

// CORPO
router.get('/corpo/:sn', (req, res) => {
  res.render('corpo', {
    persdata: persdata,
    user: req.params.sn
  })
});

// INVENTORY
router.get('/inventory', (req, res) => {
  getPXPin().then(pin => {
    res.render('inventory', {
      pin: pin
    });
  });
});

// OVERALL
router.get('/accountabilities', (req, res) => {
  var pin;
  var records;
  getPXPin().then(p => {
    pin = p;
    db.ref('Records').once('value').then(snapshot => {
      records = Object.values(snapshot.val());
      res.render('accountabilities', {
        persdata: persdata,
        pin: pin,
        records: records
      });
    });
  });
});

router.get('/accountabilities_', (req, res) => {
  var pin;
  var records;
  getPXPin().then(p => {
    pin = p;
    db.ref('Records').once('value').then(snapshot => {
      records = Object.values(snapshot.val());
      res.render('accountabilities_', {
        persdata: persdata,
        pin: pin,
        records: records
      });
    });
  });
});

// ACCESS LOG
router.get('/accesslog', (req, res) => {
  res.render('accesslog', {
    title: "Access Logs"
  });
});

router.post('/clearlog', (req, res) => {
  db.ref('AccessLog').set(null);
  res.sendStatus(200);
});

// BALANCE SHEET
router.get('/balancesheet', logremoteuser, (req, res) => {
  getPXPin().then(pin => {
    res.render('balancesheet', {
      pin: pin
    });
  });
});
// ADMIN
router.get('/balancesheet_', logremoteuser, (req, res) => {
  getPXPin().then(pin => {
    res.render('balancesheet_', {
      pin: pin
    });
  });
});

// TESTS
router.get('/test', (req, res) => {
  let d = new Date();
  let date = d.toString().split(' ');
  res.render('test', {
    output: `${date[2]}-${date[1]} ${date[4].toString().substr(0,5)}`,
  })
});

// FUNCTIONS
async function getPXPin() {
  let pin;
  await db.ref('PXPin').once('value').then(snapshot => {
    pin = snapshot.val();
  });
  return Promise.resolve(pin);
}

async function getRecIds(mySn) {
  var recIds = [];
  await db.ref('Records').once('value').then(snapshot => {
    var myRecs = Object.values(snapshot.val()).filter(rec => parseInt(rec.sn) == parseInt(mySn));
    myRecs.forEach(ri => {
      if(ri.paid == 'no') {
        recIds.push(ri.recordId);
      }
    });
  });
  return Promise.resolve(recIds);
}

async function getWhatsNew() {
  var whatsnew = [];
  await db.ref('WhatsNew').once('value').then(snapshot => {
    Object.values(snapshot.val()).forEach(wnData => {
      wnData.pic = dropboxURL(wnData.pic);
      whatsnew.push(wnData);
    });
  });
  return Promise.resolve(whatsnew);
}

async function getSeoImage() {
  var seoImage;
  await db.ref('SeoImage').once('value').then(snapshot => {
    seoImage = snapshot.val();
  });
  return Promise.resolve(seoImage);
}

function dropboxURL(link) {
  var base = link.split('?')[0];
  var fileId = base.split('/')[4];
  var fileName = base.split('/')[5]; 
  return `https://dl.dropboxusercontent.com/s/${fileId}/${fileName}`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

async function getOverallTotal() {
  var overallTotal = 0;
  await db.ref('/Records').once('value').then(snapshot => {
    var unpaidRecs = Object.values(snapshot.val()).filter(rec => rec.paid == 'no' && rec.sn != 'Corpo');
    unpaidRecs.forEach(ur => {
      overallTotal += parseInt(ur.total);
    });
  });
  return Promise.resolve(overallTotal);
}

function unixToDate(unixDate) {
  var d = new Date(unixDate);
  return `${d.getDate()}-${getMonthName(d.getMonth())} ${(d.getHours() <= 9) ? `0${d.getHours()}` : d.getHours()}:${d.getMinutes() <= 9 ? `0${d.getMinutes()}` : d.getMinutes()}`;
}

function getMonthName(monthNum) {
  switch (monthNum) {
    case 0: return 'Jan';
    case 1: return 'Feb';
    case 2: return 'Mar';
    case 3: return 'Apr';
    case 4: return 'May';
    case 5: return 'Jun';
    case 6: return 'Jul';
    case 7: return 'Aug';
    case 8: return 'Sep';
    case 9: return 'Oct';
    case 10: return 'Nov';
    case 11: return 'Dec';
  }
}

function getDevice(headers) {
  return headers['user-agent'].split(';')[2].split(')')[0].replace(/[^\w\s]/gi, '');
}

async function getMyTopic(mobile) {
  let mytopic;
  if(mobile == 'admintopic') {
    mytopic = 'admintopic';
  } else if(mobile == 'usertopic') {
    mytopic = 'usertopic';
  } else if(mobile == 'newuser') {
    mytopic = 'newuser';
  } else {
    await db.ref(`Users`).once('value').then(snapshot => {
      let user = Object.values(snapshot.val()).filter(u => u.mobile == mobile);
      mytopic = user[0].mytopic;
    });
  }
  return Promise.resolve(mytopic);
}

module.exports = router;