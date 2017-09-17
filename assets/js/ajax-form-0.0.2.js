/*!
 * ajax-form.js v0.0.2
 *
 * Copyright 2017
 *
 * Auther Mhamd Mreash
 */

(function($) {
    $.fn.ajaxform = function(options) {
        var settings = $.extend({
            loader: '.loader',
            mesSuccess: '.success',
            mesError: '.error',
            beforesend: null,
            onstart: null,
            success: null,
            error: null,
            complete: null,
            onsubmit: null
        }, options);
         $(this).each(function() {
            $(this).submit(function(event){

                event.preventDefault();
				if($.isFunction( settings.onsubmit)){
					 if(settings.onsubmit()==false)
						{
							return;
						}
				}
                var form=$(this);
                var action = form.attr("action");
                var formData = new FormData();

                $.each(form.serializeArray(), function (i, field) {
                    formData.append(field.name, field.value);
                });

                form.find('[type="file"]').each(function(){
                    if($(this)[0].files && $(this)[0].files.length>0)
                    {
                        formData.append($(this).attr('name'), $(this)[0].files[0]);
                    }
                });

                form.find( settings.loader).show();
                form.find( settings.mesSuccess).hide();
                form.find( settings.mesError).hide();
                form.find('[type="submit"]').prop("disabled",true);

                var ajaxdata={
                    type: "POST",
                    url: action,
                    data: formData,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success: function (result) {
                       if($.isFunction( settings.success))
                       {
                            settings.success(result);
                       }else
                       {
                            if(result.state==true)
                            {
                                form.find( settings.mesSuccess).show().html(result.message);
                            }
                            else
                            {
                                form.find( settings.mesError).show().html(result.message);
                            }
                        
                       }
                    },
                    error: function (result) {
                        if($.isFunction( settings.error))settings.error(result);
                        form.find( settings.mesError).show();
                    },
                    complete: function (result) {
                        form.find( settings.loader).hide();
                        form.find('[type="submit"]').prop("disabled",'');
                       if($.isFunction( settings.complete)) settings.complete(result);
                    }
                };
                if($.isFunction( settings.beforesend)){
                     ajaxdata['data'] =settings.beforesend(formData);
                     delete ajaxdata['contentType'];
                     delete ajaxdata['processData'];
                    }
                if($.isFunction( settings.onstart)){
                     settings.onstart();
                    }
                $.ajax(ajaxdata);
            });
         });

    }
}(jQuery));
