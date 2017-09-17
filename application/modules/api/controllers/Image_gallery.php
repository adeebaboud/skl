<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';

class Image_gallery extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('Image_gallery/Image_gallery_m','sm');		
    }

	
}