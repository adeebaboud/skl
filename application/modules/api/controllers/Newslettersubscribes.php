<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Newslettersubscribes extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('newsletter_subscribes/Newsletter_subscribes_m');
		
    }
	
		/**
      * @api {get} /Newslettersubscribes Get all Newslettersubscribes
      * @apiName index
      * @apiGroup Newslettersubscribes
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

	public function index_get()
    { 
		parent::index_get();
				
    }
	
	
	public function index_post()
	{
		$this->response('this method is not supported',400);
		
	}
	
	  
	public function update_post($id=NULL)
	{
		$this->response('this method is not supported',400);
	}
	
	
	public function delete_get()
	{
		parent::delete_get();
		//$this->response('this method is not supported',400);
	}
	
	
	public function update_status_post($id)
	{
		$original_data =$this->model->single($id);
        if($original_data == NULL)
            $this->response(['success'=>FALSE,'errors'=>'Item Not Found'],400);
        else
        {
            if($this->post()) {
                $data = $this->post();
                $data = $this->map_from_json($data);
				
				$this->model->update_status($id,$data);
				$this->response('updated successfully',200);
			}

		}
	}
	
	 //public read
    protected function can_read(){
        return ($this->is_logged_in  || $this->is_user_admin);
    }
	
}