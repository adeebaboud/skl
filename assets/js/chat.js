
$(document).ready(function(){ 

$('.chat-box .chat-title').click(function(){
    if($('.chat-box').hasClass('chat-started')){
        $('.chat-box').toggleClass('opened');
    }else{ 
        $('#chatModal').modal('show');
    } 
});

$('#start-chat-btn').click(function(){ 
    $('#chatModal').modal('hide');
    initChat(); 
});
 
var socket = io('192.168.1.50:3000');
socket.on('message',function(msg){
    $('.chat-conversation').append( 
        '<span class="message '+(msg.is_admin =='1' ? 'admin-msg' : '')+'">'+
            '<b>'+msg.message+'</b>'+
            '<small class="date">'+msg.date+'</small>'+
        '</span>');
    $('.chat-conversation').animate({scrollTop : $('.chat-conversation span:last').offset().top}); 
});
function sendMessage(){
    if(!$('#msg-box').val() || $('#msg-box').val().length == 0)
        return;
    var sessionId;
    var cookies = document.cookie.split(';');
    for(var i = 0;i<cookies.length;i++){
        if(cookies[i].indexOf('das360') == 0)
        sessionId = decodeURIComponent(cookies[i]).split("s:32")[1].split('"')[1];
    }
    socket.emit('message', $('#msg-box').val(),$('#sesid').val());
    $('#msg-box').val('');
}
function initChat(){  
    $('.chat-box').toggleClass('opened');
    socket.emit('init', $('#chat-name').val(),$('#sesid').val()); 
}
$('#chat-send-btn').click(function(e){
    e.preventDefault();
    sendMessage();
    return false;
});

$('#msg-box').keyup(function(e){
    if(e.keyCode == 13){
        sendMessage();
        $('#msg-box').focus();
    }
});

});
