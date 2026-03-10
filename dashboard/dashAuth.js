(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user == null) {
      location.assign("/#l");
      return;
    }
    var isGoogle = user.providerData.some(function(p) { return p.providerId === 'google.com'; });
    if (!isGoogle) {
      location.assign("/#l");
      return;
    }
    window.currentUser = user;
    //UI stuff
    $('.usName').text(user.displayName);
    //Logout behaviour
    $('.btn#logout').click(function() {
      firebase.auth().signOut().then(function() {
        location.assign("/#");
      });
    });
    //Username behaviour
    var userDataPath = firebase.database().ref("users").child(user.uid);
    userDataPath.once("value", function(snap) {
      userData = snap.val();
    });
  });
})();
