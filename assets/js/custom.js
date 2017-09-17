 $(document).ready(function () {
	 
	$("#search-form").submit(function( event ) {
		if($("#search").val().length<3)
		{
			$(".err-msg").html('<span >'+(lang == 'ar' ? 'يجب كتابة 3 أحرف على الأقل':'Search field must contain 3 characters at least')+'</span>');
			return false;
		}

	});

 $('.btn-login').click(function (event) {
    event.preventDefault();
	var email = $('#email').val();
	var password = $('#password').val();
	if(email == '' || password == '')
	{
		 $('.resp').html('<div class="alert alert-danger">' + (lang == 'ar' ? 'يرجى ادخال معلومات الدخول' : 'Please enter your login info')+'</div>');
		return;
	}

	$.ajax({
	  type: "POST",
	  url: base_url+ lang +"/member/login",
	  data: {'email':email,'password':password},
		success: function(response)
	  {
		  
			if(response.flag == false)
			{
				$('.resp').html('<div class="alert alert-danger">'+response.msg+'</div>');
				
			}
			  else
			  {
				  if($('#login_form').attr('data-redirect')=='true')
					  window.location.href= base_url+lang;
				  else{
				  $('.member_cube').addClass('rotatein');
				  $('#logged_user').html(response.user);
				  $('.not_logged_in').addClass('hide');
				  $('.logged_in').removeClass('hide');
				  
				  }
			  }
	  },
	 
	});
	
 });
 
      $('#tp-banner').revolution({
        delay:9000,
         startwidth:960,
         startheight: 950,
         startWithSlide:0,
      });

		$('#camera_random').camera({
		rows: 4,
		minHeight: '400px',
		height: '38%',
		pagination: true,
		thumbnails: false,
		time: 5000,
		playPause:false,
	});
	
	$('.layer-slider').appendTo($('.camera_fakehover'));


 });

	