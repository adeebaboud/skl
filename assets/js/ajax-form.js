/*!
 * ajax-form.js v0.0.1 
 *
 * Copyright 2016, Mhamd Mreash
 * Released under mreash
 * 
 * Auther Mhamd Mreash
 */
function ajaxform(opt) {
    opt.event.preventDefault();
    // if (!opt.form.valid()) {
    //     return;
    // }
    try {
        var action = opt.form.attr("action");
        var formData = new FormData();
        $.each(opt.form.serializeArray(), function (i, field) {
            formData.append(field.name, field.value);
        });
        var fileelement = document.getElementById(opt.filename);
        if (fileelement!=null) {
            var totalFiles = fileelement.files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = fileelement.files[i];

                formData.append(opt.filename, file);
            }
        }
        $("#" + opt.LoadingElementId).show();
        $.ajax({
            type: "POST",
            url: action,
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (result) {
                opt.success(result);
                $("#" + opt.LoadingElementId).hide();
            },
            error: function (result) {
                opt.error(result);
                $("#" + opt.LoadingElementId).hide();
            },
            complete: function (result) {
                opt.complete(result);
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}