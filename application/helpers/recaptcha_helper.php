<?php


function render_captcha(){ 
    $CI = &get_instance();
    $CI->config->load('recaptcha');
    $siteKey = $CI->config->item('siteKey'); 
    echo '<div class="g-recaptcha" data-sitekey="' . $siteKey . '"></div>';
    echo '<script type="text/javascript"  src="https://www.google.com/recaptcha/api.js?hl=ar">  </script>'; 
}

function verify_captcha( ){
    $CI = &get_instance();
    $CI->config->load('recaptcha');
    $secret = $CI->config->item('secret'); 
    require(FCPATH . 'vendor/autoload.php');
    $recaptcha = new \ReCaptcha\ReCaptcha($secret);

    $gRecaptchaResponse = $_POST['g-recaptcha-response'];
    $remoteIp = $_SERVER['REMOTE_ADDR'];

    $resp = $recaptcha->verify($gRecaptchaResponse, $remoteIp);
    if ($resp->isSuccess()) {
        return TRUE;
    } else {
        $errors = $resp->getErrorCodes();
    } 
}