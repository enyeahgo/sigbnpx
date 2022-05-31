// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
const firebaseConfig = {
  apiKey: "AIzaSyBEDglK-zpG1LH0iPEL0tEOEvYgNl9qYrM",
  authDomain: "sixcavcoypx.firebaseapp.com",
  databaseURL: "https://sixcavcoypx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sixcavcoypx",
  storageBucket: "sixcavcoypx.appspot.com",
  messagingSenderId: "904591618146",
  appId: "1:904591618146:web:c764e778d12bdf7cb1e13b",
  measurementId: "G-66YP5RRQTD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = "6Cav PX";
  const notificationOptions = {
    body: "You have a new notification!",
    icon: '/assets/img/logo-icon.png',
    click_action: "/"
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// [END background_handler]