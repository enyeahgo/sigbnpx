// Initialize Firebase
var config = {
    apiKey: "AIzaSyAkS3ru74cFQ99it8ARrobZuy1QEWIuP6Y",
    authDomain: "kusinazone.firebaseapp.com",
    databaseURL: "https://kusinazone.firebaseio.com",
    projectId: "kusinazone",
    storageBucket: "kusinazone.appspot.com",
    messagingSenderId: "513461902854",
    appId: "1:513461902854:web:7460a05d6f4d18576aad87",
    measurementId: "G-7SWZ6DVWZ9"
  };
  firebase.initializeApp(config);

// As httpOnly cookies are to be used, do not persist any state client side.
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

// FirebaseUI config.
var uiConfig = {
    signInOptions: [
        // google sign in option
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],

    // Terms of service url/callback.
    tosUrl: '/ppu.html',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
        window.location.assign('/ppu.html');
    },

    callbacks: {
        signInSuccessWithAuthResult: function(user, credential, redirectUrl) {
            // User successfully signed in.
            var user = firebase.auth().currentUser;
            var uid = user.uid;
            user.getIdToken().then(function(idToken) {
                window.localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/client/sessionLogin/' + idToken + '/' + uid;
            }).catch(error => {
                alert(error);
            })

        }
    }
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);