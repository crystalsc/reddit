let firebaseConfig = {
    apiKey: "AIzaSyBHhkE7qul_s-gTy9ZxDFl-5zjlEC-1ue8",
    authDomain: "reddit-7127a.firebaseapp.com",
    databaseURL: "https://reddit-7127a.firebaseio.com",
    projectId: "reddit-7127a",
    storageBucket: "reddit-7127a.appspot.com",
    messagingSenderId: "75733530892",
    appId: "1:75733530892:web:23539654a22c40834f7129",
    measurementId: "G-MJL46YR25L"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var database = firebase.database();

  var user;
  var name, email, photoUrl, uid, emailVerified;


  function logout() {
    firebase.auth().signOut().then(function () {
      document.getElementById("seeLogin").style.display = "block";
      document.getElementById("loggedIn").style.display = "none";
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
  }

  function login() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      if (user != null) {

        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        document.getElementById("seeLogin").style.display = "none";
        document.getElementById("loggedIn").style.display = "block";
        loggedIn();
      }
      // ...
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  function loggedIn() {
    $("#loggedIn").html('');
    $("#loggedIn").append(`<img id="thumbnail" style="margin-right:5px;" src="${photoUrl}" class="img-thumbnail">`);
    $("#loggedIn").append(name);
    $("#loggedIn").append(`<button class="btn btn-light" style="margin-left:5px;"  id="seeLogout" onclick="logout()">Logout</button>`);

  }

  function goToBoard(value1) {
    var queryString = "?board=" + value1;
    window.location.href = "board.html" + queryString;
  }

  function createBoard() {
    firebase.database().ref('createBoard/' + Date.now() + '/board/' + firebase.auth().currentUser.uid ).set({
      name: document.getElementById("boardName").value,
      description: document.getElementById("description").value
    });
  }

  function getBoards() {
    var starCountRef = firebase.database().ref('createBoard/');
    starCountRef.on('value', function (snapshot) {
      var p = snapshot.val();
      $("#boards").html('');
      for (var key in p) {
      if (p.hasOwnProperty(key)) {

          for (var key2 in p[key]['board']) {
            if (p[key]['board'].hasOwnProperty(key2)) {
              $("#boards").prepend(`
                <div class="row card style="margin-top:10px">
                <div class="card-body">
                <h5 class="card-title">${p[key]['board'][key2].name}</h5>
                <p class="card-text">${p[key]['board'][key2].description}</p>
                <button type="button" onclick="goToBoard(${key})" class="btn btn-primary mb-2">Read More</button>
                </div>
            </div>`);
            }
          } 
      }
}
    });
  }



  $(document).ready(function () {

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        document.getElementById("seeLogin").style.display = "none";
        document.getElementById("getStarted").style.display = "none";
        document.getElementById("started").style.display = "block";
        document.getElementById("loggedIn").style.display = "block";
        loggedIn();
        getBoards();
      } else {
        document.getElementById("seeLogin").style.display = "block";
        document.getElementById("getStarted").style.display = "block";
        document.getElementById("started").style.display = "none";
        document.getElementById("loggedIn").style.display = "none";
        // No user is signed in.
      }
    });
   
  });