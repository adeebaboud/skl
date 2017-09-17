<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Biography extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('biography/biography_m','sm');
		
    }
	
		/**
      * @api {get} /Biography Get Biography
      * @apiName index
      * @apiGroup Biography
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"name":"Shawermatec22",
					"slogan":"Shawermatec slogan",
					"logo":"http:\/\/localhost\/Shawermatac-New\/src\/uploads\/new-years-day-2016-5637619880820736-5764640680181760-ror.gif",
					"about":"about shawermatec about shawermatec about shawermatec about shawermatec",
					"mission":"shawermatec mission shawermatec mission shawermatec mission",
					"vision":"vision vision vision vision",
					"message":"message message message message message message",
					"values":"values values values values values",
					"zipcode":"zipcode zipcode zipcode zipcode zipcode",
					"phone1":"9625487232",
					"phone2":"9651520011",
					"phone3":"11111",
					"mobile1":"222222",
					"mobile2":"3333333",
					"mobile3":"",
					"email":"info@shawermatec.com",
					"website":"wwww.shawermatec.com",
					"facebook":"www.facebook.com\/shawermatec",
					"twitter":"www.twitter.com\/shawermatec",
					"linkedin":"www.linkedin.com\/shawermatec",
					"google":"www.google.com\/shawermatec",
					"youtube":"www.youtube.com\/shawermatec",
					"instagram":"www.instagram.com\/shawermatec",
					"foursquar":"www.foursquar.com\/shawermatec",
					"map":"map map"
				}
            ]
      *
      * @apiError InternalError Internal Error Happened
      *
      * @apiErrorExample Error-Response:
      *     HTTP/1.1 400 Not Found
      *     {
      * 	  }
      */

	public function index_get()
    {
		$bio = $this->model->get_biography(); 
		$biography  = [];
		foreach ($bio as $b)
		{
			$biography[$b->name] = $b->value;
		}
		$this->response($biography);  
				
    }
	
	
	
	/**
	* @api {post} /Biography Add Biography
      * @apiName index
      * @apiGroup Biography
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
            ]
      *
      * @apiError InternalError Internal Error Happened
      *
      * @apiErrorExample Error-Response:
      *     HTTP/1.1 400 Not Found
      *     {
      * 	  }
      */
	
	public function index_post()
	{
		$bio = $this->post();
		$biography = [];
		foreach ($bio as $key=>$value)
		{$temp = new stdClass();
		
			$temp->name = $key;
			$temp->value = $value;
			array_push($biography,$temp);
		}
		$this->model->add_biography($biography);
		
	}
	
		
}