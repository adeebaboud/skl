
var app = new Framework7({
    init: false,
    tapHold: true,
    tapHoldDelay: 250,
    material: true,
    fastClicksDelayBetweenClicks : 100,
    preloadPreviousPage: true,
    materialRipple: true,
    materialPageLoadDelay: 100,
    cache: false,
    uniqueHistory: true,
    showBarsOnPageScrollTop: true,
    showBarsOnPageScrollEnd: true,
    template7Pages: true,
    precompileTemplates: true,
    dynamicPageUrl: '{{name}}',
    modalTitle: " ",
    sortable :false,
    swipeout:false,
    modalButtonOk: lang.ok,
    modalButtonCancel: lang.cancel,
    modalPreloaderTitle: lang.load,
    notificationCloseButtonText: lang.close,
    notificationCloseOnClick: true,
    notificationHold: 2000,
    cacheIgnore : [setting.cartPage],
    scrollTopOnNavbarClick: true,
    pushState : false,
    onAjaxStart: function (xhr) {
        app.showIndicator()
    },
    onAjaxComplete: function (xhr) {
        app.hideIndicator()
    }
});

var api = "http://www.shawermatac.com/mobapi/api/";
//var api = "http://das-360.net/shawermatac/mobapi/api/";
//var api = "http://192.168.1.80/Shawermatac-New/src/mobapi/api/";
var $$ = Dom7,
    quranData ;
var mainView = app.addView('.view-main',{
    dynamicNavbar: true,
    domCache: false
});

$$(document).on('pageAfterAnimation', function (e) {
    $$('a[target="_blank"]').each(function(i,v){
         if(!$$(v).hasClass('external'))
             $$(v).addClass('external')
    })
    var page = e.detail.page;
    if(page.name !="index"){
        setTimeout(function(){
            $$('.page-on-center #link-back').removeClass('hidden');
        },150)

    }
})


function initialize() {
    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
        center: new google.maps.LatLng(setting.latitude,setting.longitude),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions)
    var image = setting.map_pin;
    var mapMarker = new google.maps.Marker({
        position: {lat: setting.latitude, lng: setting.longitude},
        map: map,
        icon: image
    });
}

var branchLat,branchLong,branchTitle;
function initMap(branchTitle,branchLat,branchLong) {
    var myLatLng = {lat:parseFloat(branchLat),lng:parseFloat( branchLong)};

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        scrollwheel: false,
        zoom: 12
    });

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
        map: map,
        position: myLatLng,
        title: branchTitle,
        icon: setting.map_pin
    });
}

//==  contactus  ===========>
app.onPageBeforeInit('contactus',function(){
    google.maps.event.addDomListener(window, 'load', initialize);
})
app.onPageInit('contactus',function(){
    google.maps.event.trigger(window, 'load', initialize);

    $$('#contactFormm').on('submitted', function (e) {

        var xhr = e.detail.xhr;
        var data = e.detail.data;

        $$('#contactFormm input , #contactFormm textarea').each(function(i,v){
            $$(v).val('')
        })

        app.addNotification({
            message: lang.contact_message,
            button: {
                text: lang.close,
                color: 'green'
            }
        });
    });
});
//



app.onPageInit('branches',function(){
    $$('.readmore').on('click',function(){
        branchLat =   $$(this).data('lat');
        branchLong =  $$(this).data('long');
        branchTitle =$$(this).attr('title') ;

    });
});


$$(document).on("pageInit", '.page[data-page^="branch-"]', function (e) {
    initMap(branchTitle,branchLat,branchLong);
});


app.onPageInit('bettcher',function(){
    var bSwiper = app.swiper('.swiper-container', {
        autoplay : 2500,
        speed: 400,
        spaceBetween: 50,
        slidesPerView:1,
        loop :true
    });
});


//keyword

$$(document).on('keyup','.form-search ',  function (e) {
    if(e.keyCode == 13 ){
        $$('.form-search .button').click();
    }
});

$$('.form-search .button').on('click', function (e) {
    var formData = app.formToJSON('.form-search');
    if(formData.keyword.length < 3){
        if(!$$('.notifications .notification-item').length){
            app.addNotification({
                message: lang.length_error,
                button : {
                    text: lang.close,
                    color: 'yellow',
                    close: true
                }
            });
        }

    }else{
        app.closePanel();
        $$.post(setting.site+'/search', formData, function (data) {
            if(mainView.activePage.name == "search_results"){
                mainView.router.reloadContent(data)
            }else{
                mainView.router.loadContent(data);
            }
            setTimeout(function(){
                $$('.form-search input').val('');
            },200)
        });
    }
});


app.onPageInit('index',function(){




    var homeSwiper = app.swiper('.swiper-container', {
        autoplay : 2500,
        speed: 400,
        spaceBetween: 0,
        autoHeight :false,
        slidesPerView:3,
        loop :true,
        breakpoints: {
            // when window width is <= 320px
            320: {
                slidesPerView: 1,
                spaceBetweenSlides: 10
            },
            // when window width is <= 480px
            480: {
                slidesPerView: 1,
                spaceBetweenSlides: 20
            },
            // when window width is <= 640px
            640: {
                slidesPerView: 3,
                spaceBetweenSlides: 30
            }
        }
    });
});



app.onPageAfterAnimation('competition',function(){
	if(window.grecaptcha)
		grecaptcha.render( $$('#g-recaptcha')[0],{
			'sitekey' 	: $$('#g-recaptcha').attr('data-sitekey'),
			'size'	: 'compact'
		});

}); ;
app.onPageInit('login-page',function(){


    $$('#login_form').on('submitted', function (e) {
        var xhr = e.detail.xhr;
        var data = JSON.parse(e.detail.data) ;

        if(data.flag){

            mainView.router.back({url:setting.site, force: true});
            document.location.reload();
        }else{
            app.addNotification({
                custom: '<div class="note">'+data.msg+'</div>'
            });
        }

    });

});

$$(document).on('click','.btn-logout',function(){
    document.location.reload()
});


app.onPageInit('forgot_password',function(){
    $$('.form-forgot_password').on('submitted', function (e) {
        console.log(e);
        var xhr = e.detail.xhr;
        var data = e.detail.data;
        console.log(xhr);
        console.log(data);
    });
});



app.onPageAfterAnimation('register',function(){
    var userinput = $$('#signup-form input[name="user_name"]');
    if(userinput.val().length == 0){
        $$('.btn-submit').addClass('disabled')
    }
    userinput.on('change',function(){
        $$('.btn-submit').removeClass('disabled')
    })
});
app.onPageInit('register',function(){

    $$('.btn-submit').click(function(){
        var formData = app.formToJSON('#signup-form');

        $$.ajax({
            url : api+ 'member/signup?lang='+setting.lang,
            data: formData,
            method : 'POST',
            error : function(xhr, status){

                app.modal({
                    title: '',
                    afterText: JSON.parse(xhr.response).error ,
                    buttons: [
                        {
                            text: lang.close,
                        }]
                });


            },
            success : function(data, status, xhr){
                app.addNotification({
                    message: lang.account_creation_successful,
                    button : {
                        text: lang.close,
                        color: 'yellow',
                        close: true
                    }
                })
                setTimeout(function(){
                    document.location.reload()
                },1000)
            }
        })
    });
});


app.onPageInit('profile',function(){
    $$('.btn-update').click(function(){
        var formData = app.formToJSON('#profile-form');
        $$.ajax({
            url : api+ 'member/profile?lang='+setting.lang,
            data: formData,
            method : 'POST',
            error : function(xhr, status){

                app.modal({
                    title: '',
                    afterText: JSON.parse(xhr.response).error ,
                    buttons: [
                        {
                            text: lang.close,
                        }]
                });

            },
            success : function(data, status, xhr){

               setTimeout(function(){
                mainView.router.refreshPage()
                app.addNotification({
                    message: lang.update_successful,
                    button : {
                        text: lang.close,
                        color: 'yellow',
                        close: true
                    }
                })
               },100)
            }
        })
    })
});
//method="POST" action="<?= site_url('/member/forgot_password') ?>"
app.onPageInit('forgot_password',function(){
    $$('.btn-submit').click(function(){
        var formData = app.formToJSON('#forgot_password-form');
        $$.ajax({
            url : api+ 'member/forgot_password?lang='+setting.lang,
            data: formData,
            method : 'POST',
            error : function(xhr, status){
                console.log(xhr);
                app.modal({
                    title: '',
                    afterText: JSON.parse(xhr.response).errors ,
                    buttons: [
                        {
                            text: lang.close,
                        }]
                });
            },
            success : function(data, status, xhr){
                app.addNotification({
                    message: JSON.parse(data).message,
                    button : {
                        text: lang.close,
                        color: 'yellow',
                        close: true
                    }
                })
            }
        })
    })
})
;
var menuCategories;
$$.getMenu = function(callback){
    $$.getJSON(api + "menu/menu?lang=" + setting.lang, function (data) {
        menuCategories = data;
        if (callback, typeof (callback) == 'function') {
            callback(menuCategories)
        }
    });
}
app.onPageInit('menu',function(page){
    $$.getMenu(function(data){
        $$.each(data,function(i,category){
            category.index = i;
            var html = app.templates.categories(category);
            $$(html).insertBefore('.ymy-box');
            if(i == (data.length -1))
                $$('.ymy-box').removeClass('hidden');
        });
        categoriesList(data,function(cates){
            if(page.query.pro_id && page.query.cate_id){
                $$('.card-link[data-id="'+page.query.cate_id+'"]').trigger('click');
                setTimeout(function(){
                    var offTop = $$('.item-card[data-id="'+page.query.pro_id+'"]').offset().top -250;
                    setTimeout(function(){
                        $$('.popup .page-content').scrollTop(offTop,500)
                    },200)
                },300);
            }
        });
    })
});
var count = cartItems.length | 0;
var yuumylist={};
yuumylist.items = [];
function incCounter(){
    var counter =  $$('.shopCart .items_counter');
    count++;
    counter.text(count)
}
function decCounter(){
    var counter =  $$('.shopCart .items_counter');
    if(count > 0)
        count--;
    counter.text(count);
}
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
function getItem(id) {
    if(typeof menuCategories == 'undefined'){
        $$.getMenu(function(data){return  findItem(id);});
    }else{return findItem(id)}
    function findItem(id){
        for (var i = 0; i < menuCategories.length; i++)
            for (var j = 0; j < menuCategories[i].items.length; j++)
                if (item = menuCategories[i].items[j], item.product_id == id) return item;
        return {}
    }
}
/// --------------- addToCard ---------------------------------------------------------
/// -----------------------------------------------------------------------------------
function addToCard(id,callback) {
    var item = getItem(id);
    item.in_cart = true;
    item.quantity = 1;
    item.opts = {}
    cartItems.push({
        product_id : item.product_id,
        quantity : item.quantity,
        options:	(item.opts) ? item.opts : {},
        note:	(item.note)  ? item.note : ''
    });
    //cartItems.push(item);

    item.total = item.quantity * item.product_price;
    if (callback, typeof (callback) == 'function') {
        callback(item)
    }
}
/// --------------- removeFromCard ----------------------------------------------------
/// -----------------------------------------------------------------------------------
function removeFromCard(id,callback){
    var item = getItem(id);
    item.in_cart = false;
    item.quantity = 1;

     cartItems.splice(cartItems.indexOf(item),1);
    var tmpOrder = [] ;
    var mc = menuCategories;
    for(var i =0; i<mc.length;i++){
        for(var c = 0; c < mc[i].items.length;c++){
            var itm = mc[i].items[c];
            if(itm.in_cart){
                tmpOrder.push({
                    product_id : itm.product_id,
                    quantity : itm.quantity,
                    options:	(itm.opts) ? itm.opts : {},
                    note:	(itm.note)  ? itm.note : ''
                });
            }
            if(i == (mc.length -1) && c == (mc[i].items.length -1)){
                setTimeout(function(){

                    $$.post(setting.base_url + '/order/cart', {data: tmpOrder },function(response){
                    });
                },100);
            }
        }
    }
    item.total = item.quantity * item.product_price;
    if (callback, typeof (callback) == 'function') {
        callback(item)
    }
}
/// --------------- increaseCard ------------------------------------------------------
/// -----------------------------------------------------------------------------------
function increaseItem(id,callback) {
    var item = getItem(id);
    item.quantity += 1;
    item.total = item.quantity * item.product_price;
    if (callback, typeof (callback) == 'function') {
        callback(item)
    }
}
/// --------------- decreaseCard ------------------------------------------------------
/// -----------------------------------------------------------------------------------
function decreaseItem(id, callback) {
    var item = getItem(id);
    if (item.quantity > 1) {
        item.quantity -= 1;
        item.total = item.quantity * item.product_price;
    }
    if (callback, typeof (callback) == 'function') {
        callback(item)
    }
}
/// --------------- resetCard ---------------------------------------------------------
/// -----------------------------------------------------------------------------------
function resetCard(id,callback){
    var item = getItem(id);
    item.opts = {};
    item.note = "";
    var card =  $$('.card[data-id="'+id+'"]');
    card.find('.buttons-box,.options').addClass('hidden');
    card.find('.addtoCart').removeClass('hidden');
    card.find('.productQty').val('1');
    card.find('textarea.order_note').val('');
    if(card.find('.accordion-item').hasClass('accordion-item-expanded')){
        app.accordionClose(card.find('.accordion-item')) ;
    }
    card.find('.options-list li').each(function(i,v){
        $$(v).find('input').prop('checked',false);
    })
    if (callback, typeof (callback) == 'function') {
        callback(item)
    }
}
/// --------------- addToyummy ---------------------------------------------------------
/// -----------------------------------------------------------------------------------
function  addToYummy(id,callback) {
    var item = getItem(id);
    var yummyKey = "yummy-"+item.category_id +"-"+ item.product_id;
    localStorage.setItem(yummyKey,"yes");
    item.isYummy = true;
    if (callback, typeof (callback) == 'function') {
        callback(item)
    }
};
/// --------------- removeFromYummy ---------------------------------------------------
/// -----------------------------------------------------------------------------------
function  removeFromYummy(id,callback) {
    var item = getItem(id);
    var yummyKey = "yummy-" +item.category_id +"-"+ item.product_id;
    localStorage.removeItem(yummyKey);
    item.isYummy = false;
    yuumylist.items.splice(yuumylist.items.indexOf(item),1);
    if (callback, typeof (callback) == 'function') {
        callback(item)
    }
};
/// --------------- isYummy ----------------------------------------------------------
/// -----------------------------------------------------------------------------------
function isYummy(category,id){
    var yummyKey = "yummy-"+category +"-"+ id;
    var item = localStorage.getItem(yummyKey)
    if(item == "yes") return 'active';
    else return '';
}
/// --------------- sendOrder ----------------------------------------------------------
/// -----------------------------------------------------------------------------------
function sendOrder(){
    app.showIndicator()
    var orderDTO = [] ;
    var mc = menuCategories;
    for(var i =0; i<mc.length;i++){
        for(var c = 0; c < mc[i].items.length;c++){
            var itm = mc[i].items[c];
            if(itm.in_cart){
                orderDTO.push({
                    product_id : itm.product_id,
                    quantity : itm.quantity,
                    options:	(itm.opts) ? itm.opts : {},
                    note:	(itm.note)  ? itm.note : ''
                });
            }
            if(i == (mc.length -1) && c == (mc[i].items.length -1)){

                setTimeout(function(){
                    $$.post(setting.base_url + '/order/cart', {data: orderDTO },function(response){

                        app.hideIndicator();
                        mainView.router.load({
                            "url" :  setting.cartPage ,
                            "ignoreCache" :   true
                        });
                        app.closeModal('.popup');
                    });
                },100);
            }
        }
    }

}
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function categoriesList(data,callback){
    var cates = data;
    if(cartItems.length > 0){
        for(var c = 0; c < cates.length; c++){
            var cy = cates[c].items;
            for(var i =0;i< cy.length;i++){
                for(var x=0; x < cartItems.length; x++ ){
                    if(cartItems[x].product_id == cy[i].product_id){
                        var ci = cartItems[x];
                        var it = cy[i];
                        it.in_cart = true;
                        it.note = (ci.note) ? ci.note : '';
                        it.quantity = parseInt(ci.quantity) ;
                        it.opts = (ci.options) ?ci.options : {};
                        for(var j=0;j<it.options.length;j++){
                            if(ci.options){
                                var opt = ci.options[it.options[j].option_id];
                                if(opt){
                                     it.options[j].checked = opt ==='true';
                                }
                            }
                        }
                        //  break;
                    }
                }
            }
        }
    }
    $$('.categories_list .card-link').on('click',function(){
        var cateID = $$(this).data('id');
        var index = $$(this).data('index');
        var hasYummy = false;
        if(cateID == '00'){
            yuumylist.category_name_ar = $$(this).find('span').text();
            yuumylist.category_name_en = $$(this).find('span').text();
            yuumylist.category_id = cateID;
            for (var i = 0; i < localStorage.length; i++){
                var x = localStorage.key(i);
                if(x.indexOf('yummy') >=0){
                    hasYummy=true;
                    var key = x.split("-");
                    $$.each(cates,function(i,category){
                        if(category.category_id == key[1]){
                            $$.each(category.items,function(x,item){
                                if(item.product_id == key[2]){
                                    yuumylist.items.push(item)
                                }
                            })
                        }
                    })
                }
            }
            if(!hasYummy){
                app.addNotification({
                    custom: '<div class="note">'+lang.empty_yummy+'</div>'
                });
            }
            setTimeout(function(){
                if( yuumylist.items.length > 0 ){
                    var popupHTML = app.templates.categoryItems(yuumylist);
                    app.popup(popupHTML);
                    popUpopend(yuumylist);
                }
            },250)
        }else{
            var cy = cates[index].items;
            for(var i =0;i< cy.length;i++){
                for(var x=0; x < cartItems.length; x++ ){
                    if(cartItems[x].product_id == cy[i].product_id){
                        var ci = cartItems[x];
                        var it = cy[i];
                        it.in_cart = true;
                        it.note = (ci.note) ? ci.note : '';
                        it.quantity = parseInt(ci.quantity) ;
                        it.opts = (ci.opts) ?ci.opts : {};
                        for(var j=0;j<it.opts.length;j++){
                            if(ci.opts){
                                var opt = ci.opts[it.opts[j].option_id];
                                if(opt){
                                    it.opts[j].checked = opt ==='true';
                                }
                            }
                        }
                        //  break;
                    }
                }
            }
            var popupHTML = app.templates.categoryItems(cates[index]);
            app.popup(popupHTML);
            popUpopend(cates[index]);
        }
    })
    if (callback, typeof (callback) == 'function') {
        callback(cates)
    }
}
function popUpopend(data){
    $$('.popup').on('opened', function () {
        $$('.shopCart .items_counter').text(cartItems.length);
    });
    ///------------------
    // btn add To Card
    ///--------------------
    $$('.link.addtoCart').on('click',function(){
        var Card = $$(this).parents('.item-card');
        var cardId = parseInt(Card.data('id'));
        if(!setting.loggedIn){
            mainView.router.load({
                url: setting.site+'/member/login',
            });
            setTimeout(function(){
                app.closeModal('.popup');
            },325)
        }else{
            $$(this).addClass('hidden');
            var btnOptions =  Card.find('.options');
            btnOptions.removeClass('hidden');
            addToCard(cardId,function(item){
                incCounter();
                $$('.card[data-id="'+item.product_id+'"]').find('.buttons-box').removeClass('hidden')
            })
        }
    });
    $$('.options').click(function(){
        var Card = $$(this).parents('.item-card');
        var itemId =  Card.data('id');
        app.accordionToggle('.card[data-id="'+itemId+'"] [data-item="'+itemId+'"]');
        return false;
    });
    ///---------------------
    // btn remove from Card
    ///---------------------
    $$('.btn-remove').click(function(){
        var Card = $$(this).parents('.item-card');
        removeFromCard(Card.data('id'),function(item){
            resetCard(item.product_id);
            decCounter();
        })
    });
    ///---------------------
    // increaseItem
    ///---------------------
    $$('.btn-plus').click(function(){
        var card = $$(this).parents('.item-card');
        var itemId =  card.data('id');
        increaseItem(itemId,function(item){
            card.find('.productQty').val(item.quantity);
        });
    })
    ///---------------------
    // decreaseItem
    ///---------------------
    $$('.btn-minus').click(function(){
        var card = $$(this).parents('.item-card');
        var itemId =  card.data('id');
        decreaseItem(itemId,function(item){
            card.find('.productQty').val(item.quantity);
        })
    })
    ///---------------------
    // order note
    ///---------------------order_note
    $$('.order_note').on('change',function(){
        var card = $$(this).parents('.item-card');
        var itemId =  card.data('id');
        var item = getItem(itemId);
        item.note = $$(this).val();
    });
    $$('.label-switch input[type="checkbox"]').on('change',function(){
        var itemID = $$(this).data('itemid');
        var optionID =  $$(this).data('id');
        var item = getItem(itemID);
        item.opts[optionID] = $$(this).prop('checked');
    });
    $$('.add_to_yummy').click(function(){
        var card = $$(this).parents('.item-card');
        var itemId =  card.data('id');
        if($$(this).hasClass('active')){
            removeFromYummy(itemId);
            $$(this).removeClass('active');
            if($$(this).parents('.popup ').hasClass('popup-items-00')){
                $$(this).parents('.card').remove();
                if($$('.popup-items-00 .card').length == 0 )
                    app.closeModal('.popup-items-00')
                    }
        }else{
            addToYummy(itemId)
            $$(this).addClass('active');
        }
    })

    $$('.popup .shopCart').click(function(){
        sendOrder();
    });


}
;
app.onPageInit('cart',function(){

    $$('.order_cancel').on('click',function(){
        $$.get(setting.site + '/order/cancel', {}, function (data) {

            cartItems = [];
            count  = 0;
            cart = [];
            orderDTO = [];
            mainView.router.back({url:setting.site+ '/menu', force: true});
        });
    });




    $$('form.order-form').on('submitted', function (e) {
        var xhr = e.detail.xhr; // actual XHR object
        var data = e.detail.data;
        cartItems = [];
        count  = 0;
        cart = [];
        orderDTO = [];

        mainView.router.load({url:setting.site+ '/order/orders'});
    });


});

;
app.onPageAfterAnimation('orders',function(){
  setTimeout(function(){
      if($$('.alert.alert-success').length > 0){


          app.modal({
              title: '' ,
              text: $$('.alert.alert-success').html(),
              buttons: [
                  {
                      text: setting.ok,
                      bold: true,
                      onClick : function(){
                         document.location.reload();

                      }
                  },
              ]
          })

      }
  },150)
    })
;
app.init();
