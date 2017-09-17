//=================
var direction = 'ltr';
//=================
(function ($) {
    $.fn.makecube = function (options) {
        var parent, w, h, zx, zy, m, parentCss, sideCss, styles, dir, windoWidth;
        var settings = $.extend({
            class: ".side",
            minus: 19,
            left: 10,
            top: 8,
            vertical : false,
            zm: false,
            dir: 'ltr',
            sides: ["front", "back", "top", "bottom", "left", "right"]  ,
        }, options);
        try {
            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
            $(this).parent().addClass('cubeWrap');
            $(this).addClass('cube');
            $(this).find(settings.class).addClass('cubeSide');
            parent = $(this).parent().parent();
            m = settings.minus;
            dir = settings.dir;
            var vw = $(window).width();
            switch (true) {
            case (vw >= 320 && vw < 768):
                w = parent.width();
                h = parent.height();
                parentCss = {
                    'padding': 0
                };
                $(this).parent().css('perspective', 'none');
                break; 
            case (vw >= 768 && vw < 1024):
                w = parent.width() - parseFloat(m / 2) + 1;
                h = parent.height() - parseFloat(m / 2) + 1;
                if (dir == 'rtl') {
                    parentCss = {
                        'padding-top': parseInt(settings.top / 2) + 'px',
                        'padding-right': parseInt(settings.left / 2) + 'px'
                    };
                } else {
                    parentCss = {
                        'padding-top': parseInt(settings.top / 2) + 'px',
                        'padding-left': parseInt(settings.left / 2) + 'px'
                    };
                }
                break;
            case (vw >= 1024 && vw < 1200):
                w = parent.width() - parseFloat(m / 2) - parseFloat(settings.left / 2) + parseInt(settings.top / 4.1);
                h = parent.height() - parseFloat(m / 2) - parseFloat(settings.left / 2) + parseFloat(settings.top / 4.1) + 2;
                if (dir == 'rtl') {
                    parentCss = {
                        'padding-top': parseInt(settings.top / 2) + 'px',
                        'padding-right': parseInt(settings.left / 2) + 2 + 'px'
                    };
                } else {
                    parentCss = {
                        'padding-top': parseInt(settings.top / 2) + 'px',
                        'padding-left': parseInt(settings.left / 2) + 2 + 'px'
                    };
                }
                break;
            case (vw >= 1200):
                w = parent.width() - m;
                h = parent.height() - m + parseFloat(settings.top / 2.5);
                if (dir == 'rtl') {
                    parentCss = {
                        'padding-top': settings.top + 'px',
                        'padding-right': settings.left + 'px'
                    };
                } else {
                    parentCss = {
                        'padding-top': settings.top + 'px',
                        'padding-left': settings.left + 'px'
                    };
                }
                break;
            }
            zx = Math.round(w / 2) - settings.zm + 'px';
            zy = Math.round(h / 2) + 'px';
            sideCss = {
                'width': w,
                'height': h
            }
            styles = {}
            if(settings.vertical){
               styles.back= {
                    '-webkit-transform': 'translateZ(-' + zx + ') rotateX(180deg) ',
                    'transform': 'translateZ(-' + zx + ') rotateX(180deg) '
                };
                styles.bottom={
                    '-webkit-transform': 'rotateX(-90deg) translateY(' + zy + ')',
                    'transform': 'rotateX(-90deg) translateY(' + zy + ')',
                    '-webkit-transform-origin': 'bottom center',
                    'transform-origin': 'bottom center'
                };
                styles.top= {
                    '-webkit-transform': 'rotateX(90deg) translate3d(0,-' + zy + ', 0px)',
                    'transform': 'rotateX(90deg) translate3d(0,-' + zy + ', 0px)',
                    '-webkit-transform-origin': ' top center',
                    'transform-origin': ' top center'
                };
              }else{
                styles.back= {
                    '-webkit-transform': 'translateZ(-' + zx + ') rotateY(180deg) ',
                    'transform': 'translateZ(-' + zx + ') rotateY(180deg) '
                };
                styles.bottom={
                    '-webkit-transform': 'rotateX(90deg) translateY(' + zy + ')',
                    'transform': 'rotateX(90deg) translateY(' + zy + ')',
                    '-webkit-transform-origin': 'bottom center',
                    'transform-origin': 'bottom center'
                };
                  styles.top= {
                    '-webkit-transform': 'rotateX(90deg) translate3d(0,-' + zy + ',-' + m + 'px)',
                    'transform': 'rotateX(90deg) translate3d(0,-' + zy + ',-' + m + 'px)',
                    '-webkit-transform-origin': ' top center',
                    'transform-origin': ' top center'
                };
              }


                 styles.right= {
                    '-webkit-transform': 'rotateY(-270deg) translateX(' + zx + ')',
                    'transform': 'rotateY(-270deg) translateX(' + zx + ')',
                    '-webkit-transform-origin': 'top right',
                    'transform-origin': 'top right'
                };
                 styles.left= {
                    '-webkit-transform': 'rotateY(270deg) translateX(-' + zx + ')',
                    'transform': 'rotateY(270deg) translateX(-' + zx + ')',
                    '-webkit-transform-origin': 'center left',
                    'transform-origin': 'center left'
                };


                 styles.front= {
                    'transform': 'translateZ(' + zx + ')'
                };

            parent.css(parentCss);
            $(this).css(sideCss);
            $(settings.class).css(sideCss);
            var side = $(this).find(settings.class);
            $.each(settings.sides, function (i, sideClass) {
                $(side[i]).addClass(sideClass).css(styles[sideClass]);
            });
        } catch (e) {
        }
    };
}(jQuery));
//-------------------------------------------------------
var nice = false;
$(document).ready(function () {
    nice = $("html").niceScroll({
        cursorcolor: "#26a5ba",
        cursorwidth: "10px",
        cursorborder: "0 solid transparent",
        cursorborderradius: "0",
        cursorminheight: 32,
        mousescrollstep: 70,
        autohidemode: false,
        background: "rgba(00,00,00,0.5)",
        railalign: (direction == 'ltr') ? 'right' : 'left',
    });
    //---/----------------------
    if ($.fn.cssOriginal != undefined)
        $.fn.css = $.fn.cssOriginal;
    var banner = $('#mainslider').revolution({
        delay: 9000,
        startwidth: 1170,
        startheight: 550,
        lazyLoad: "on",
        hideTimerBar: "on",
        fullWidth: "on",
        touchenabled: "off",
        navigationStyle: "round",
        forceFullWidth: "on",
        navigationVAlign: "bottom",
        navigationVOffset: "80",
        navigationHOffset: "-10",
        parallax: "mouse",
        parallaxBgFreeze: "on",
        parallaxLevels: [10, 7, 4, 3, 2, 5, 4, 3, 2, 1]
    });
    banner.bind("revolution.slide.onchange", function (e, data) {
    });
    var mealslider = $('#mealslider').revolution({
        delay: 9000,
        startwidth: 600,
        startheight: 600,
        navigationType: "none",
        lazyLoad: "on",
        fullWidth: "off",
        touchenabled: "off",
        hideTimerBar: "on",
        navigationStyle: "round",
        navigationArrows: "solo",
        navigationVAlign: "top",
        autoHeight: "off",
        forceFullWidth: "off",
        parallax: "mouse",
        parallaxBgFreeze: "on",
        parallaxLevels: [8, 7, 4, 3, 2, 5, 4, 3, 2, 1]
    });
    //---/----------------------parallax
    $('.navbar-toggle').click(function () {
        $('.main-overflow').toggleClass('slideOut');
    });
    //---/----------------------
    $('.grid').masonry({
        isFitWidth: false,
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        isOriginLeft: (direction == 'ltr') ? true : false
    });
    //---/----------------------
    function makeNewPosition() {
        var h = $('.aboutbox').height() / 4 - 100;
        var w = $('.aboutbox').width() / 4 - 100;
        var newPosY = Math.floor(Math.random() * h);
        var newPosX = Math.floor(Math.random() * w);
        $('.aboutbox').animate({
            backgroundPositionX: newPosX + '%',
            backgroundPositionY: newPosY + '%'
        }, 1500)
    }
    var aboutCar = $("#aboutCarousel");
    aboutCar.owlCarousel({
        items: 1,
        loop: true,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 3500,
        autoplayHoverPause: true,
        autoplaySpeed: 5000,
        animateOut: "fadeOutDown",
        animateIn: "fadeInUp",
        mouseDrag: false,
        smartSpeed: 550,
        rtl: (direction == 'ltr') ? false : true
    });
    aboutCar.on('changed.owl.carousel', function (event) {
        makeNewPosition();
    });


    //---/----------------------
    function rotate() {
        var el = document.getElementById('shadow');
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "FAIL";
        var values = tr.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];
        var scale = Math.sqrt(a * a + b * b);
        var sin = b / scale;
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        angle = angle + 45;
        if (angle == 360)
            angle = 0;
        el.style.transform = ("rotate(" + angle + "deg)");
    }
    var owl = $("#mealsCarousel");
    owl.owlCarousel({
        items: 1,
        loop: true,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 3500,
        autoplayHoverPause: true,
        autoplaySpeed: 500,
        lazyLoad: true,
        nav: true,
        dots: false,
        navText: ["", ""]
    });
    owl.on('changed.owl.carousel', function (event) {
        try {
            rotate();
        } catch (e) {}

//        var colors = ["#d8354a", "#90b510", "#26a5ba", "#FFBC00", "#808080", "#ed4e62", "#aed32d"];
        var color = var color = $($("#mealsCarousel li")[event.item.index]).data("color");;

        $('.boxMeals').css('background-color',color);
    });
    //---/----------------------
    $('.appcube').makecube({
        class: ".face",
        dir: direction,
        sides: ["front", "back", "left", "right"],
    });
    //---/----------------------
    var ofst = $('.main-header').offset().top ;
        ofst =  ($(window).height() > 700  ) ? ofst + 10 : ofst + 120;
    $("body").prepend("<div id='move-to-top' class='animate '><i class='glyphicon glyphicon-chevron-up'></i></div>");
    var scrollDes = 'html,body';
    //    opera fix
    if (navigator.userAgent.match(/opera/i)) {
        scrollDes = 'html';
    }
    //show ,hide
    $(window).scroll(function () {
        if ($(this).scrollTop() >= ofst) {
            $('#move-to-top').css('display', 'inline-block');
            $('.main-header').addClass('fixed');
            $('.container.page-border').css('margin-top',$('.main-header').height() + 50);
            $('.grid-box').css('margin-top', $('.main-header').height() + 50);
        } else {
            $('.main-header').removeClass('fixed');
            $('.grid-box').css('margin-top', '15px');
            $('#move-to-top').css('display', 'none');
              $('.page-border').css('margin-top','auto');
        }
    });
    // scroll to top when click
    $('#move-to-top').click(function () {
        $(scrollDes).animate({
            scrollTop: 0
        }, {
            duration: 500
        });
    });
    //---------------------------------------------
    var sid = ["front", "top", "back", "bottom", "left", "right"];
    var annClass = [ "treesides", "foursides", "fivesides", "sixsides"];
    var aSides=[];
    var annLength =  $('.announc-slider').find('.slide').length;
    function annSides(){
        for (var i=0; i< annLength; i++){
            aSides.push(sid[i]);
          }
            return aSides;
        }
      var timer;
     function start() {
        $('.announc-slider').toggleClass('activerotat');
//        $('.announc-slider,.titles').toggleClass('activerotat');
        $('.titlecap').toggleClass('rot');
        timer = setTimeout(start, 4000);
    };

    if( annLength > 1){
            $('.announc-slider').makecube({
            top: 9,
            left: 7,
            dir: direction,
            minus: 9,
            zm: 17,
            vertical :true,
            class: ".slide",
            sides: annSides()
           });
        if(annLength > 2){
           $('.announc-slider,.titles').toggleClass(annClass[ annLength - 3]);
        }else{
              start();
             $('.sb-slider').mouseover(function () {
             clearTimeout(timer);
             }).mouseleave(start);
        }


    }
//--------------------------------------------------
var Btimer;
 function startbranch() {
    $('.featuredBranch').toggleClass('activerotat');
    Btimer = setTimeout(startbranch, 4000);
};
var fsid = [];
var feasid = ["front", "left", "back", "right", "top", "bottom"];
var fClass = [ "htreesides", "hfoursides", "hfivesides", "hsixsides"];
var feaLength =  $('.featuredBranch').find('.side').length;
function fSides(){
        for (var i=0; i< feaLength; i++){
            fsid.push(feasid[i]);
          }
            return fsid;
        }
    if( feaLength > 1){
           $('.featuredBranch').makecube({
            class: ".side",
            dir: direction,
            sides: fSides(),
        });
        if(feaLength > 2){
             $('.announc-slider').toggleClass(fClass[ feaLength - 3]);

        }else{
              startbranch();
        }

    }


    //----------------------------------------
     var branchLength =  $('#branchbox').find('.branchbox').length;
     var tr;
    function stb(){
        $('#branchbox').find('.branchbox').eq(1).toggleClass('invisible')
       tr =  setTimeout(stb, 4000);
    }
    switch (branchLength) {
  case 1:
      $('#branchbox').addClass('opacity');
      break;
  case 2:
      $('#branchbox').addClass('opacity'); stb();
      break;
  case 3:
      $('#branchbox').addClass('three-items');
      break;
  case 4:
      $('#branchbox').addClass('four-items');
      break;
  }


    //------------------------------------------------------
    $('.member_cube').makecube({
        dir: direction,
        sides: ["front", (direction == 'ltr') ? "left" : "right"]
    });
//    $('.btn-login').click(function (event) {
//       // event.preventDefault();
//        $('.member_cube').addClass('rotatein');
//    });
//    $('.btn-logout').click(function (event) {
//       // event.preventDefault();
//        $('.member_cube').removeClass('rotatein');
//    });
});

