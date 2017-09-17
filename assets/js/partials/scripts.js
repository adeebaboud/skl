var wow = new WOW(
	{
		boxClass:     'animate',
		animateClass: 'animated',
		offset:       0,
		mobile:       true,
		live:         true,

	}
);
wow.init();
$(document).ready(function(){
	///nivoSlider
	if($('#homeSlider').length > 0 ){
		$('#homeSlider').nivoSlider({
			effect: 'random',
			prevText : "",
			nextText: "",
		});
	}
	// user-btn
	if($('#user-btn').length > 0){
		$('#user-btn').click(function(){
			$('.userbox').toggleClass('show');
		});
		$('.close_box').click(function(){
			$('.userbox').removeClass('show');
		})
	}
	if ($("[data-background]") && $("[data-background]").length > 0) {
		$("[data-background]").each(function () {
			var src = $(this).attr('data-background');
			$(this).css("background-image", 'url(' + src + ')');
		});
	}

});
