<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

/* load the MX_Router class */
require APPPATH."third_party/MX/Config.php";

class DAS_Config extends MX_Config {
	
	
	function site_url($uri = '', $protocol = NULL){
		$uri = CI::$APP->lang->lang . '/' . $uri;
		return parent::site_url($uri, $protocol);
	}
}