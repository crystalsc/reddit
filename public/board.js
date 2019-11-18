var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var queries = queryString.split("=");


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
        window.location.href = "index.html"
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}

function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }

function loggedIn() {
    $("#loggedIn").html('');
    $("#loggedIn").append(`<img id="thumbnail" style="margin-right:5px;" src="${photoUrl}" class="img-thumbnail">`);
    $("#loggedIn").append(name);
    $("#loggedIn").append(`<button class="btn btn-light" style="margin-left:5px;"  id="seeLogout" onclick="logout()">Logout</button>`);

}


function createPost() {
    let user = firebase.auth().currentUser.uid;
    firebase.database().ref('createBoard/' + queries[1] + '/posts/'  + user + '/' + Date.now()).set({
        description: document.getElementById("description").value,
        name: name,
        posterId: firebase.auth().currentUser.uid,
        photoUrl: photoUrl
    });
}


function vote(key2, key, num) {
    let user = firebase.auth().currentUser.uid;
    firebase.database().ref('createBoard/' + queries[1] + '/posts/' + key + '/' + key2 + '/votes/' + user).set({
        vote: num
    });
}

function voteBoard(key, num) {
    let user = firebase.auth().currentUser.uid;
    firebase.database().ref('createBoard/' + queries[1] + '/board/' + key + '/votes/' + user).set({
        vote: num
    });
}

function edit(key) {
    let user = firebase.auth().currentUser.uid;
    let id = "edit-" + key;
    firebase.database().ref('createBoard/' + queries[1] + '/posts/' + user + '/' + key).update({
        description: document.getElementById(id).value,
        name: name,
        posterId: user,
        photoUrl: photoUrl
    });
}

function editBoard(key) {
    let user = firebase.auth().currentUser.uid;
    let id = "edit-board";
    let name = "edit-name";
    firebase.database().ref('createBoard/' + queries[1] + '/board/' + key).update({
        description: document.getElementById(id).value,
        name: document.getElementById(name).value
    });
}

function deleteReply(key, keyR,key2) {
    let user = firebase.auth().currentUser.uid;
    let post = firebase.database().ref('createBoard/' + queries[1] + '/posts/' + key + '/' + key2  + '/replies/' + keyR + '/' + user);
    post.remove().then(function () {
    })
        .catch(function (error) {
        });
}

function editReply(key,keyR,key2){
    let user = firebase.auth().currentUser.uid;
    let id = "edit-" + keyR;
    firebase.database().ref('createBoard/' + queries[1] + '/posts/' + key + '/' + key2 + '/replies/' + keyR + '/' + user).update({
       description: document.getElementById(id).value
    });
}

function postReply(key2,key,replyName,original){
    let user = firebase.auth().currentUser.uid;
    let id = "reply-" + key;
    firebase.database().ref('createBoard/' + queries[1] + '/posts/' + key2 + '/' + key + '/replies/' + Date.now() + '/' + user).update({
       replyTo: replyName,
       posterId: user,
       original: document.getElementById("description-" + original).textContent,
       description: document.getElementById(id).value,
       name: name,
       photoUrl: photoUrl
    });
}
function cancel(key,key2,replyName) {
    $("#reply-button-" + key).html(`<button type="button" onclick='reply("${key}","${key2}","${replyName}")' class="btn btn-warning">Reply</button>`);
}
function reply(key2,key,replyName) {
    $("#reply-button-" + key2).html('');
    $("#reply-button-" + key2).append(`
        <div class="row card" style="margin-top:5px;margin-left:20px;">
        <div class="card-body">
        <p class="card-text">
            <form>
                <div class="form-group">
                    <textarea class="form-control" id="reply-${key}" rows="3"></textarea>
                </div>
            </form>
        </p>
        <p class="card-text"><button type="button" onclick='postReply("${key2}","${key}","${replyName}","${key2}")' class="btn btn-success">Post</button></p>
        <p class="card-text"><button type="button" onclick='cancel("${key2}","${key}")' class="btn btn-warning">Cancel</button></p>
        </div>
        </div>`);
}

function cancelReply(key2,keyR,key,replyName) {
    $("#reply-button-" + keyR).html(`<button type="button" onclick='replyToReply("${key2}","${keyR}","${key}","${replyName}")' class="btn btn-warning">Reply</button>`);
}

function postReply2(key2,key,replyName,original){
    let user = firebase.auth().currentUser.uid;
    let id = "reply-" + key;
    firebase.database().ref('createBoard/' + queries[1] + '/posts/' + key + '/' + key2 + '/replies/' + Date.now() + '/' + user).update({
       replyTo: replyName,
       posterId: user,
       original: document.getElementById("description-" + original).textContent,
       description: document.getElementById(id).value,
       name: name,
       photoUrl: photoUrl
    });
}
function replyToReply(key2,keyR,key,replyName) {
    console.log("here");
    $("#reply-button-" + keyR).html('');
    $("#reply-button-" + keyR).append(`
        <div class="row card" style="margin-top:5px;margin-left:20px;">
        <div class="card-body">
        <p class="card-text">
            <form>
                <div class="form-group">
                    <textarea class="form-control" id="reply-${key}" rows="3"></textarea>
                </div>
            </form>
        </p>
        <p class="card-text"><button type="button" onclick='postReply2("${key2}","${key}","${replyName}","${keyR}")' class="btn btn-success">Post</button></p>
        <p class="card-text"><button type="button" onclick='cancelReply("${key2}","${keyR}","${key}","${replyName}")' class="btn btn-warning">Cancel</button></p>
        </div>
        </div>`);
}

function deletePost(key) {
    let user = firebase.auth().currentUser.uid;
    let post = firebase.database().ref('createBoard/' + queries[1] + '/posts/' + user + '/' + key);
    post.remove().then(function () {
    })
        .catch(function (error) {
        });
}

function deleteBoard() {
    let post = firebase.database().ref('createBoard/' + queries[1]);
    post.remove().then(function () {
        window.location.href = "index.html"
    })
        .catch(function (error) {
        });
}

function getBoard(date) {
    var starCountRef = firebase.database().ref('createBoard/' + date + '/board');
    starCountRef.on('value', function (snapshot) {
        var p = snapshot.val();
        $("#board").html('');
        for (var key in p) {
            if (p.hasOwnProperty(key)) {
                let down = 0;
                let up = 0;
                for (var voter in p[key].votes) {
                    if (p[key].votes.hasOwnProperty(voter)) {
                        if ((p[key].votes)[voter].vote == 1) {
                            up++;
                        } else {
                            down--;
                        }

                    }

                }
                if (p[key].name && p[key].description) {
                    if (key === uid) {
                        $("#board").prepend(`
                            <div class="card row" style="margin-top:10px">
                            <div class="card-body">
                            <h5 class="card-title">${p[key].name}</h5>
                            <p class="card-text">${p[key].description}</p>
                            <p class="card-text">
                                <form>
                                    <div class="form-group">
                                            <textarea class="form-control" id="edit-name" rows="1">${p[key].name}</textarea>
                                    </div>
                                    <div class="form-group">
                                        <textarea class="form-control" id="edit-board" rows="3">${p[key].description}</textarea>
                                    </div>
                                </form>
                            </p>
                            <p class="card-text">${up}<img class="vote" style="margin-right:5px;" onclick='voteBoard("${key}",1)' src="./images/up.svg"><img class="vote" style="margin-left:5px;" onclick='voteBoard("${key}",-1)' src="./images/down.svg">${down}</p>
                            <p class="card-text"><button type="button" onclick='editBoard("${key}")' class="btn btn-warning">Edit</button>
                                         <button type="button" onclick="deleteBoard()" class="btn btn-danger">Delete</button></p>
                            </div>
                        </div>`);
                    } else {
                        $("#board").prepend(`
                            <div class="card row" style="margin-top:10px">
                            <div class="card-body">
                            <h5 class="card-title">${p[key].name}</h5>
                            <p class="card-text">${p[key].description}</p>
                            <p class="card-text">${up}<img class="vote" style="margin-right:5px;" onclick='voteBoard("${key}",1)' src="./images/up.svg"><img class="vote" style="margin-left:5px;" onclick='voteBoard("${key}",-1)' src="./images/down.svg">${down}</p>
                            </div>
                        </div>`);
                    }
                }
            }

        }
    })
}


function getPosts(date, id) {
    var starCountRef = firebase.database().ref('createBoard/' + date + '/posts');
    starCountRef.on('value', function (snapshot) {
        var p = snapshot.val();
        $("#posts").html('');
        for (var key in p) {
            if (p.hasOwnProperty(key)) {
                for (var key2 in p[key]) {
                    if (p[key].hasOwnProperty(key2)) {
                let down = 0;
                let up = 0;
                for (var voter in p[key][key2].votes) {
                    if (p[key][key2].votes.hasOwnProperty(voter)) {
                        if ((p[key][key2].votes)[voter].vote == 1) {
                            up++;
                        } else {
                            down--;
                        }

                    }

                }
                if (p[key][key2].posterId === id) {
                    $("#posts").prepend(`
                    <div class="row card" style="margin-top:5px">
                    <div class="card-body">
                    <h5 class="card-title"><img id="thumbnail" style="margin-right:5px;" src="${p[key][key2].photoUrl}" class="img-thumbnail">${p[key][key2].name}</h5>
                    <p class="card-text" >${p[key][key2].description}</p>
                    <p class="card-text">
                        <form>
                            <div class="form-group">
                                <textarea class="form-control" id="edit-${key2}" rows="3">${p[key][key2].description}</textarea>
                            </div>
                        </form>
                    </p>
                    <p class="card-text">${up}<img class="vote" style="margin-right:5px;" onclick='vote("${key2}","${key}",1)' src="./images/up.svg"><img class="vote" style="margin-left:5px;" onclick='vote("${key2}","${key}",-1)' src="./images/down.svg">${down}</p>
                    <p class="card-text"><button type="button" onclick='edit("${key2}")' class="btn btn-warning">Edit</button>
                                         <button type="button" onclick='deletePost("${key2}")' class="btn btn-danger">Delete</button></p>
                    </div>
                    </div>
                    <div id="replies-${key}"></div>`);
                    for (var keyR in p[key][key2].replies) {
                        if(p[key][key2].replies.hasOwnProperty(keyR)) {
                            for (var keyU in p[key][key2].replies[keyR]) {
                                if (p[key][key2].replies[keyR][keyU].posterId === id) {
                                    $("#replies-" + key).append(`
                                        <div class="row card" style="margin-top:5px;margin-left:20px;">
                                        <div class="card-body">
                                        <h5 class="card-title"><img id="thumbnail" style="margin-right:5px;" src="${p[key][key2].replies[keyR][keyU].photoUrl}" class="img-thumbnail">${p[key][key2].replies[keyR][keyU].name}</h5>
                                        
                                        <p class="card-text text-muted font-italic">${p[key][key2].replies[keyR][keyU].original}</p>
                                        <p class="card-text">${p[key][key2].replies[keyR][keyU].description}</p>
                                        <p class="card-text">
                                        <form>
                                            <div class="form-group">
                                                <textarea class="form-control" id="edit-${keyR}" rows="3">${p[key][key2].replies[keyR][keyU].description}</textarea>
                                            </div>
                                        </form>
                                    </p>
                                    <p class="card-text"><button type="button" onclick='editReply("${key}","${keyR}","${key2}")' class="btn btn-warning">Edit</button>
                                                        <button type="button" onclick='deleteReply("${key}","${keyR}","${key2}")' class="btn btn-danger">Delete</button></p>
                                        </div>
                                        </div>`);
                                } else {
                                    $("#replies-" + key).append(`
                                        <div class="row card" style="margin-top:5px;margin-left:20px;">
                                        <div class="card-body">
                                        <h5 class="card-title"><img id="thumbnail" style="margin-right:5px;" src="${p[key][key2].replies[keyR][keyU].photoUrl}" class="img-thumbnail">${p[key][key2].replies[keyR][keyU].name}</h5>
                                       
                                        <p class="card-text text-muted font-italic">${p[key][key2].replies[keyR][keyU].original}</p>
                                        <p class="card-text" id="description-${keyR}">${p[key][key2].replies[keyR][keyU].description}</p>
                                        <p id="reply-button-${keyR}" class="card-text"><button type="button" onclick='replyToReply("${key2}","${keyR}","${key}","${p[key][key2].replies[keyR][keyU].name}")' class="btn btn-warning">Reply</button></p>
                                        </div>
                                        </div>`);
                                }
                            }
                        }
                        
                        
                    }
                } else {
                    $("#posts").prepend(`
                    <div class="row card" style="margin-top:5px;">
                    <div class="card-body">
                    <h5 class="card-title"><img id="thumbnail" style="margin-right:5px;" src="${p[key][key2].photoUrl}" class="img-thumbnail">${p[key][key2].name}</h5>
                    <p class="card-text"  id="description-${key}">${p[key][key2].description}</p>
                    <p class="card-text">${up}<img class="vote" style="margin-right:5px;" onclick='vote("${key2}","${key}",1)' src="./images/up.svg"><img class="vote" style="margin-left:5px;" onclick='vote("${key2}","${key}",-1)' src="./images/down.svg">${down}</p>
                    <p id="reply-button-${key}" class="card-text"><button type="button" onclick='reply("${key}","${key2}","${p[key][key2].name}")' class="btn btn-warning">Reply</button></p>
                    </div>
                    </div>
                    <div id="replies-${key}"></div>`);
                    for (var keyR in p[key][key2].replies) {
                        if(p[key][key2].replies.hasOwnProperty(keyR)) {
                            for (var keyU in p[key][key2].replies[keyR]) {
                        if (p[key][key2].replies[keyR][keyU].posterId === id) {
                            $("#replies-" + key).append(`
                                <div class="row card" style="margin-top:5px;margin-left:20px;">
                                <div class="card-body">
                                <h5 class="card-title"><img id="thumbnail" style="margin-right:5px;" src="${p[key][key2].replies[keyR][keyU].photoUrl}" class="img-thumbnail">${p[key][key2].replies[keyR][keyU].name}</h5>
                                
                                <p class="card-text text-muted font-italic">${p[key][key2].replies[keyR][keyU].original}</p>
                                <p class="card-text" >${p[key][key2].replies[keyR][keyU].description}</p>
                                <p class="card-text">
                                <form>
                                    <div class="form-group">
                                        <textarea class="form-control" id="edit-${keyR}" rows="3">${p[key][key2].replies[keyR][keyU].description}</textarea>
                                    </div>
                                </form>
                            </p>
                            <p class="card-text"><button type="button" onclick='editReply("${key}","${keyR}","${key2}")' class="btn btn-warning">Edit</button>
                                                <button type="button" onclick='deleteReply("${key}","${keyR}","${key2}")' class="btn btn-danger">Delete</button></p>
                                </div>
                                </div>`);
                        } else {
                            $("#replies-" + key).append(`
                                <div class="row card" style="margin-top:5px;margin-left:20px;">
                                <div class="card-body">
                                <h5 class="card-title"><img id="thumbnail" style="margin-right:5px;" src="${p[key][key2].replies[keyR][keyU].photoUrl}" class="img-thumbnail">${p[key][key2].replies[keyR][keyU].name}</h5>
                                
                                <p class="card-text text-muted font-italic">${p[key][key2].replies[keyR][keyU].original}</p>
                                <p class="card-text"  id="description-${keyR}">${p[key][key2].replies[keyR][keyU].description}</p>
                                <p id="reply-button-${keyR}" class="card-text"><button type="button" onclick='replyToReply("${key2}","${keyR}","${key}","${p[key][key2].replies[keyR][keyU].name}")' class="btn btn-warning">Reply</button></p>
                                </div>
                                </div>`);
                        }
                    }
                }
                    }
                }

            }
                }
            }

        }
    })
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
            document.getElementById("loggedIn").style.display = "block";
            loggedIn();
            queries[1] = sanitize(queries[1]);
            getPosts(queries[1], uid);
            getBoard(queries[1]);
        } else {
            window.location.href = "index.html"
            // No user is signed in.
        }
    });

});