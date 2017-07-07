/*global
navigator, $, window, document, jQuery
*/
(function () {
  'use strict';
  var isiPad, isiPhone, gotToNextSection, loaderPage, fullHeight, toggleBtnColor,
    scrollNext, mobileMenuOutsideClick, offcanvasMenu, burgerMenu, testimonialFlexslider, goToTop, contentWayPoint;
  // iPad and iPod detection
  isiPad = function () {
    return (navigator.platform.indexOf("iPad") !== -1);
  };

  isiPhone = function () {
    return (
      (navigator.platform.indexOf("iPhone") !== -1) ||
      (navigator.platform.indexOf("iPod") !== -1)
    );
  };

  // Go to next section
  gotToNextSection = function () {
    var el = $('.fh5co-learn-more'),
      w = el.width(),
      divide = -w / 2;
    el.css('margin-left', divide);
  };

  // Loading page
  loaderPage = function () {
    $(".fh5co-loader").fadeOut("slow");
  };

  // FullHeight
  fullHeight = function () {
    if (!isiPad() && !isiPhone()) {
      $('.js-fullheight').css('height', $(window).height() - 49);
      $(window).resize(function () {
        $('.js-fullheight').css('height', $(window).height() - 49);
      });
    }
  };

  toggleBtnColor = function () {
    if ($('#fh5co-hero').length > 0) {
      $('#fh5co-hero').waypoint(function (direction) {
        if (direction === 'down') {
          $('.fh5co-nav-toggle').addClass('dark');
        }
      }, {
        offset: -$('#fh5co-hero').height()
      });

      $('#fh5co-hero').waypoint(function (direction) {
        if (direction === 'up') {
          $('.fh5co-nav-toggle').removeClass('dark');
        }
      }, {
        offset: function () {
          return -$(this.element).height();
        }
      });
    }
  };

  // Scroll Next
  scrollNext = function () {
    $('body').on('click', '.scroll-btn', function (e) {
      e.preventDefault();

      $('html, body').animate({
        scrollTop: $($(this).closest('[data-next="yes"]').next()).offset().top
      }, 1000, 'easeInOutExpo');
      return false;
    });
  };

  // Click outside of offcanvass
  mobileMenuOutsideClick = function () {
    $(document).click(function (e) {
      var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('offcanvas-visible')) {
          $('body').removeClass('offcanvas-visible');
          $('.js-fh5co-nav-toggle').removeClass('active');
        }
      }
    });
  };

  // Offcanvas
  offcanvasMenu = function () {
    $('body').prepend('<div id="fh5co-offcanvas" />');
    $('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
    $('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');
    $('.left-menu li, .right-menu li').each(function () {
      var $this = $(this);
      $('#fh5co-offcanvas ul').append($this.clone());
    });
  };

  // Burger Menu
  burgerMenu = function () {
    $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
      var $this = $(this);
      $('body').toggleClass('fh5co-overflow offcanvas-visible');
      $this.toggleClass('active');
      event.preventDefault();
    });

    $(window).resize(function () {
      if ($('body').hasClass('offcanvas-visible')) {
        $('body').removeClass('offcanvas-visible');
        $('.js-fh5co-nav-toggle').removeClass('active');
      }
    });

    $(window).scroll(function () {
      if ($('body').hasClass('offcanvas-visible')) {
        $('body').removeClass('offcanvas-visible');
        $('.js-fh5co-nav-toggle').removeClass('active');
      }
    });
  };

  testimonialFlexslider = function () {
    var $flexslider = $('.flexslider');
    $flexslider.flexslider({
      animation: "fade",
      manualControls: ".flex-control-nav li",
      directionNav: false,
      smoothHeight: true,
      useCSS: false /* Chrome fix*/
    });
  };

  goToTop = function () {
    $('.js-gotop').on('click', function (event) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: $('html').offset().top
      }, 500);
      return false;
    });
  };

  // Animations
  contentWayPoint = function () {
    $('.animate-box').waypoint(function (direction) {
      if (direction === 'down' && !$(this.element).hasClass('animated')) {
        $(this.element).addClass('item-animate');
        setTimeout(function () {
          $('body .animate-box.item-animate').each(function () {
            var el = $(this);
            setTimeout(function () {
              el.addClass('fadeInUp animated');
              el.removeClass('item-animate');
            }, 200, 'easeInOutExpo');
          });
        }, 100);
      }
    }, {
      offset: '95%'
    });
  };

  // Document on load.
  $(function () {
    gotToNextSection();
    loaderPage();
    fullHeight();
    toggleBtnColor();
    scrollNext();
    mobileMenuOutsideClick();
    offcanvasMenu();
    burgerMenu();
    testimonialFlexslider();
    goToTop();

    // Animate
    contentWayPoint();
  });
}());

$(document).ready(function () {
  'use strict';
  (function (g) {
    var j = null,
      b = null,
      h = null,
      o = null,
      f = 5,
      d;

    function n(p) {
      h.html(g.trim(p));
    }

    function k(p) {
      o.html(p);
    }

    function m() {
      n("");
      k("");
    }

    function e(p) {
      b.css({
        width: p + (f * 2)
      });
    }

    function l(q, p) {
      return ["//www.youtube.com/embed/", q, "?rel=0&showsearch=0&autohide=", p.autohide, "&autoplay=", p.autoplay, "&controls=", p.controls, "&fs=", p.fs, "&loop=", p.loop, "&showinfo=", p.showinfo, "&color=", p.color, "&theme=", p.theme, "&wmode=transparent"].join("");
    }

    function a(q, r, p) {
      return ['<iframe title="YouTube video player" width="', r, '" height="', p, '" ', 'style="margin:0; padding:0; box-sizing:border-box; border:0; -webkit-border-radius:5px; -moz-border-radius:5px; border-radius:5px; margin:', (f - 1), 'px;" ', 'src="', q, '" frameborder="0" allowfullscreen seamless></iframe>'].join("");
    }

    function c(q) {
      var p = ["https://gdata.youtube.com/feeds/api/videos/", q, "?v=2&alt=json"].join("");
      g.ajax({
        url: p,
        dataType: "jsonp",
        cache: true,
        success: function (r) {
          n(r.entry.title.$t);
        }
      });
    }

    function i(p) {
			var r, q;
      r = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
      q = p.match(r);
      if (q && q[2].length === 11) {
        return q[2];
      }
			return false;
    }
    d = {
      init: function (p) {
        p = g.extend({}, g.fn.YouTubeModal.defaults, p);
        if (j === null) {
          j = g('<div class="modal fade ' + p.cssClass + '" id="YouTubeModal" role="dialog" aria-hidden="true">');
          var q = '<div class="modal-dialog" id="YouTubeModalDialog"><div class="modal-content" id="YouTubeModalContent"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title" id="YouTubeModalTitle"></h4></div><div class="modal-body" id="YouTubeModalBody" style="padding:0;"></div></div></div>';
          j.html(q).hide().appendTo("body");
          b = g("#YouTubeModalDialog");
          h = g("#YouTubeModalTitle");
          o = g("#YouTubeModalBody");
          j.modal({
            show: false
          }).on("hide.bs.modal", m);
        }
        return this.each(function () {
					var s, r, v, u;
          s = g(this);
          r = s.data("YouTube");
          if (!r) {
            s.data("YouTube", {
              target: s
            });
            g(s).bind("click.YouTubeModal", function () {
							var w, t;
              w = p.youtubeId;
              if (g.trim(w) === "" && s.is("a")) {
                w = i(s.attr("href"));
              }
              if (g.trim(w) === "" || w === false) {
                w = s.attr(p.idAttribute);
              }
              t = g.trim(p.title);
              if (t === "") {
                if (p.useYouTubeTitle) {
                  c(w);
                } else {
                  t = s.attr("title");
                }
              }
              if (t) {
                n(t);
              }
              e(p.width);
              v = l(w, p);
              u = a(v, p.width, p.height);
              k(u);
              j.modal("show");
              return false;
            });
          }
        });
      },
      destroy: function () {
        return this.each(function () {
          g(this).unbind(".YouTubeModal").removeData("YouTube");
        });
      }
    };
    g.fn.YouTubeModal = function (p) {
      if (d[p]) {
        return d[p].apply(this, Array.prototype.slice.call(arguments, 1));
      }
      if (typeof p === "object" || !p) {
        return d.init.apply(this, arguments);
      }
			g.error("Method " + p + " does not exist on Bootstrap.YouTubeModal");
    };
    g.fn.YouTubeModal.defaults = {
      youtubeId: "",
      title: "",
      useYouTubeTitle: true,
      idAttribute: "rel",
      cssClass: "YouTubeModal",
      width: 640,
      height: 480,
      autohide: 2,
      autoplay: 1,
      color: "red",
      controls: 1,
      fs: 1,
      loop: 0,
      showinfo: 0,
      theme: "light"
    };
  }(jQuery));

  (function () {
    var isMobile = false, prepVideo;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true;
      if ($("#top-video").length) {
        $("#top-video").get(0).preload = "none";
      }

    }

    if (!isMobile) {
      prepVideo = function () {
				var videoPlayer, justStarted;
        videoPlayer = document.getElementById("top-video");

        if (videoPlayer === undefined || videoPlayer === null) {
          setTimeout(prepVideo, 1);
          return;
        }

        justStarted = true;

        videoPlayer.onsuspend = function () {
          if (justStarted) {
            videoPlayer.style.opacity = 1;
            //document.getElementById("top-image").style.opacity = 0;
            setTimeout(function () {
              videoPlayer.play();
            }, 300);
            justStarted = false;
          }
        };
      };
			prepVideo();
    }
  }());
  if (navigator.userAgent.indexOf("iPad") !== -1 || navigator.userAgent.indexOf("iPhone") !== -1) {
    $(".play-store").remove();
  }
});
