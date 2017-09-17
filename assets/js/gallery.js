 
 $(document).ready(function() {
 
  var sync1 = $("#gallery-sync1");
  var sync2 = $("#gallery-sync2");
 
 if(sync1.length == 0 || sync2.length == 0)
 {
	 console.log('Missing Gallery div');
	 return;
 }
  sync1.owlCarousel({
	items : 1, 
	loop:false, 
    slideSpeed : 1000,
    nav: true,
      navText : "",
    pagination:true, 
    responsiveRefreshRate : 200,
  });
 sync1.on('changed.owl.carousel', function(event) {
    syncPosition(event);
})

  sync2.owlCarousel({
    items : 7,
    responsive:{
        0:{
            items:2,

        },
        600:{
            items:3,

        },
        1000:{
            items:5,

        }
    },
    pagination:false,
    responsiveRefreshRate : 100,
	center:true,
    afterInit : function(el){
      el.find(".owl-item").eq(0).addClass("synced");
    }
  });
 
  function syncPosition(event ){ 
    var current = sync1.data().owlCarousel.current();
    $("#gallery-sync2")
      .find(".owl-item")
      .removeClass("synced")
      .eq(current)
      .addClass("synced")
    if($("#gallery-sync2").data("owlCarousel") !== undefined){
      center(current)
    }
  }
 
  $("#gallery-sync2").on("click", ".owl-item", function(e){
    e.preventDefault();
     
    sync1.trigger("to.owl.carousel",$(e.currentTarget).index());
  });
 
  function center(number){ 
	sync2.trigger("to.owl.carousel", number); 
  }
 
});
