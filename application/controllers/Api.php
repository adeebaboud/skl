<?php
 

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';

 
class Api extends REST_Controller {
 
    function __construct()
    {
        // Construct the parent class
        parent::__construct(); 
	 
    }

	 
	/**
    * @api {get} /api/test test
	* @apiName test
    * @apiGroup test 
    * @apiSuccess 200 OK. 
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *      
		 
		   
    *
    * @apiError InternalError Internal Error Happened
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 400 HTTP_BAD_REQUEST
    *     {
	*			success: false
	*	  } 
    */
    public function test_get()
    {   
		$this->response(['result'=>'success']);  
    }
	
	 
	
}
