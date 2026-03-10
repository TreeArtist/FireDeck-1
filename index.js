tauth = function() {
  var user = firebase.auth().currentUser;
  if (user == null) {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("Authenticated successfully:", result.user.displayName);
      location.assign("/dashboard/teach#welcome");
    }).catch(function(error) {
      console.error("Auth error:", error);
    });
  } else {
    location.assign("./dashboard/teach");
  }
};
sauth = function() {
  var user = firebase.auth().currentUser;
  if (user == null) {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("Authenticated successfully:", result.user.displayName);
      location.assign("./dashboard/learn#welcome");
    }).catch(function(error) {
      console.error("Auth error:", error);
    });
  } else {
    location.assign("./dashboard/learn");
  }
};
if (location.hash == "#l") {
  $('#main').prepend("<div class=\"alert alert-warning alert-dismissible\" id=\"wAlert\" role=\"alert\"><button type=\"button\" class=\"close\" data-ui=\"Q\" data-uiQCl=\"#wAlert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Please log in with the buttons in the navigation bar above.</div>");
  attachUiEvents();
}
