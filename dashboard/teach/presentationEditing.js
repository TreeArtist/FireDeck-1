(function() {
  var iN = 0;
  window.initEditor = function() {
    $('#presentBtn').removeAttr("disabled");
    $('#mainDash').slideUp(300);
    $('#mainEdit').slideDown(300);
    $('#sL').html("");
    $('#logoLink').attr("href", "#");
    if (window.history && window.history.pushState) {
      window.history.pushState('forward', null, './#editor');
      $(window).on('popstate', function(e) {
        $(window).off('popstate');
        unInitEditor();
        clearInterval(iN);
      });
    }
  };
  window.unInitEditor = function() {
    $('#mainDash').slideDown(300);
    $('#mainEdit').slideUp(300);
    $('#logoLink').attr("href", "/#");
  };
  window.editPresentation = function(isNew, arg2) {
    var user = firebase.auth().currentUser;
    var key = "";
    var name = "";
    var currentSlide = "";
    var presData = {};
    if (isNew) {
      var nName = arg2;
      var presRef = firebase.database().ref("presentations/" + user.uid).push({
        name: nName
      });
      presRef.child("slides").push({
        type: "text",
        html: "<h1>An Excellent Slideshow</h1> <p>By " + user.displayName + "</p>"
      });
      name = nName;
      key = presRef.key;
      var ref2 = firebase.database().ref("users/" + user.uid + "/presentations");
      ref2.child(key).set({
        name: name
      });
    } else {
      key = arg2;
    }
    var pushChanges = function(cB) {
      firebase.database().ref("presentations/" + user.uid + "/" + key).set(presData, cB);
    };
    var getSlide = function(sK, push) {
      if (push) {
        quill.setHTML(presData.slides[sK].html);
      }
      return presData.slides[sK];
    };
    var setSlide = function(sK, obj) {
      presData.slides[sK] = obj;
      pushChanges();
    };
    var setSlideHTML = function(sK, str) {
      var s = getSlide(sK);
      s.html = str;
      setSlide(sK, s);
    };
    var getSlideList = function() {
      return presData.slides;
    };
    var getSlideNumber = function(sK) {
      var n = 0;
      for (var k in getSlideList()) {
        if (k == sK) {
          return n;
        }
        n++;
      }
      return -1;
    };
    $('#imageForm').hide();
    $('#imageBtn').click(function() {
      $('#imageForm').slideToggle();
    });
    $('#imageSubmitBtn').click(function() {
      quill.focus();
      if ($('#imageURL').val() != "") {
        quill.insertEmbed(quill.getSelection().end, 'image', $('#imageURL').val());
      }
    });
    $('#presentBtn').attr("href", "./present#" + key);
    var presentation = firebase.database().ref("presentations/" + user.uid + "/" + key);
    var renderList = function() {
      var sN2 = getSlideNumber(currentSlide) + 1;
      $('#sL').html("");
      for (var k in getSlideList()) {
        var slideTitle = $(getSlide(k).html).filter('div').get(0);
        var titleText = slideTitle ? $('<span>').text(slideTitle.innerText || slideTitle.textContent || 'Untitled').html() : "Untitled";
        $('#sL').append("<li class=\"list-item slideCl\" data-slide=\"" + k + "\">" + (currentSlide == k ? "<b>" : "") + titleText + (currentSlide == k ? "</b>" : "") + "<span class=\"badge deleter\"></span></li>");
      }
      $('#currentSlide').text("Slide " + sN2);
      console.log(getSlideList());
      if (getSlideList()) {
        if (sN2 == 1) {
          $('#prevSlide').attr("disabled", "true");
        } else {
          $('#prevSlide').removeAttr("disabled");
        }
        if (sN2 >= Object.keys(getSlideList()).length) {
          $('#nextSlide').attr("disabled", "true");
        } else {
          $('#nextSlide').removeAttr("disabled");
        }
      }
    };
    var saveSlide = function(sK, cB) {
      $('span#loading').text("Saved.");
      $('span#loading').show();
      $('span#loading').fadeOut(1000);
      var slC = quill.getHTML();
      setSlideHTML(sK, slC);
      pushChanges(cB);
      renderList();
    };
    renderList();
    iN = setInterval(function() {
      saveSlide(currentSlide);
    }, 10000);
    $('#newSlide').click(function() {
      _modal({
        "title": "New Slide",
        "body": "<div class=\"form-group\"><select id=\"type\" class=\"btn btn-default form-control\"><option value=\"text\">Text</option><option value=\"query\">Question</option></select></div>",
        "footer": "<span class=\"btn btn-success\" id=\"newSlideB\">Create</span>."
      });
      $('#newSlideB').click(function() {
        $('#newSlideB').off("click");
        var slC = "<div><span style=\"font-size: 56px;\"><span style=\"font-family: Montserrat, sans-serif;\"><b>Title.</b></span></span></div><span style=\"font-size: 45px;\"><span style=\"font-family: Roboto, sans-serif;\">Subtitle.</span></span><div>";

        var nSRef = presentation.child("slides").push({
          type: $('#type').val(),
          html: slC
        });
        var nSKey = nSRef.key;
        setSlide(nSKey, {
          type: $('#type').val(),
          html: slC
        });
        currentSlide = nSKey;
        getSlide(nSKey, true);
        renderList();
        _modal({
          "close": "true"
        });
      });
    });
    $('.delSlide').click(function() {
      //todo
    });
    var sessionLock = false;
    var slidesLoadedOnce = false;
    presentation.once("value", function(s) {
      presData = s.val();
      name = presData.name;
      $('.presName').text(name);
      currentSlide = Object.keys(presData.slides)[0];
      renderList();
      getSlide(currentSlide, true);
    });

    quill.on("selection-change", function(range) {
      if (range == null) {
        saveSlide(currentSlide);
      }
    });
    $(window).on('popstate', function(e) {
      saveSlide(currentSlide);
      $(window).off('popstate');
      unInitEditor();
      clearInterval(iN);
    });

    $('#nextSlide').click(function() {
      saveSlide(currentSlide, function() {
        var slideNumber = getSlideNumber(currentSlide);
        if (slideNumber < Object.keys(getSlideList()).length) {
          currentSlide = Object.keys(getSlideList())[slideNumber + 1];
          getSlide(currentSlide, true);
          renderList();
        }
      });
    });

    $('#prevSlide').click(function() {
      saveSlide(currentSlide, function() {
        var slideNumber = getSlideNumber(currentSlide);
        if (slideNumber > 0) {
          currentSlide = Object.keys(getSlideList())[slideNumber - 1];
          getSlide(currentSlide, true);
          renderList();
        }
      });
    });
  };
  window.editNewPresentation = function(name) {
    editPresentation(true, name);
  };
})();
