"use strict";
var XY = XY || {
  log: function(message) {
    if (document.location.href.indexOf("dev") != -1) {
      console.log(message);
    }
  },

  logError: function(message) {
    console.error(message);
  }
}
XY.Loader = XY.Loader || {
  pendingJSCount: 0,
  pendingCSSCount: 0,
  getCSS: function(url, closure) {
    XY.log("XY.Loader.getCSS: " + url);
    $.ajax(url, {
      complete: function(xhr) {
        XY.log("XY.Loader.getCSS[complete]: " + url);
        $("<style>" + xhr.responseText + "</style>").appendTo('head');
        if (closure) {
          closure();
        }
      }
    });
  },
  loadCSS: function(url) {
    XY.log("XY.Loader.loadCSS: " + url);
    $('<link>', {
      rel: 'stylesheet',
      type: 'text/css',
      href: url
    }).appendTo('head');
  },
  httpSync: function(url) {
      var xhrObj = new XMLHttpRequest();
      xhrObj.open('GET', url, false);
      xhrObj.send('');
      return xhrObj.responseText;
  },
  loadJS: function(file, closure) {
    XY.log("XY.Loader.loadJS: " + file);
    $.getScript(file, closure);
  },
  preloadImage: function(url) {
    var img = new Image();
    img.src = file;
  },
  loadBootStrap: function(complete) {
    XY.log("XY.Loader.loadBootStrap");
    XY.Loader.loadCSS("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
    XY.Loader.loadCSS("https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css", complete);
    XY.Loader.loadJS("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js");
  },
  loadCalendly: function() {
    XY.log("XY.Loader.loadCalendly");
    XY.Loader.loadCSS("https://calendly.com/assets/external/widget.css");
    XY.Loader.loadJS("https://calendly.com/assets/external/widget.js");
  },
  loadFonts: function() {
    XY.log("XY.Loader.loadFonts");
    XY.Loader.loadCSS("https://fonts.googleapis.com/css?family=Quicksand:300italic,400italic,600italic,700italic,800italic,400,600,700,300,800");
  },
  load: function() {
    XY.log("XY.Loader.load");
    $("#xy-load-header").load("/header.html", function() {
      XY.log("XY.Loader.load - Header Loaded");
      $("#xy-load-body").show();
      $("#xy-load-footer").load("/footer.html");
    });
  }
};

(function() {
  XY.log("XY - Loading Files");
  XY.Loader.loadBootStrap();
  XY.Loader.loadFonts();
  XY.Loader.getCSS("/css/responsive.css");
  XY.Loader.getCSS("/css/main.css");
  XY.Loader.getCSS("/css/site.css");
  XY.Loader.loadJS("/js/xy-utilities.js");
  XY.Loader.loadCalendly();
})();

$( document ).ready(function() {
  XY.log("XY - Document Ready");

});
