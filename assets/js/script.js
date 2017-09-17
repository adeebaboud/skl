$(function(){
    $('[data-secroll]').each(function (index, div){
         $(this).css('max-height',$(this).data('maxheight'));
         $(this).css('max-width', $(this).data('maxwidth'));
         $(this).niceScroll({
            cursorcolor:        ($(this).data('cursorcolor')) ? $(this).data('cursorcolor')           : '#F39C12',
            cursorwidth:        ($(this).data('cursorwidth')) ? $(this).data('cursorwidth')           : '7px',
            cursorborder:       ($(this).data('cursorborder')) ? $(this).data('cursorborder')         : "0px solid transparent",
            cursorborderradius: ($(this).data('cursorradius')) ? $(this).data('cursorradius')         : "5px",
            scrollspeed:        ($(this).data('scrollspeed')) ? $(this).data('scrollspeed')           : 60,
            autohidemode:       ($(this).data('autohidemode')) ? $(this).data('autohidemode')         :false,
            horizrailenabled:   ($(this).data('horizrailenabled')) ? $(this).data('horizrailenabled') : true,
            smoothscroll:       ($(this).data('smoothscroll')) ? $(this).data('smoothscroll')         : true,
            smoothscroll:       ($(this).data('smoothscroll')) ? $(this).data('smoothscroll')         : "auto",

         });
       $(window).resize(function(){
            $(div).getNiceScroll().resize();
       })
    });



});
