<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Notifications extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('notifications/notifications_m','cm');
		
    }
	
		/**
      * @api {get} /Notifications Get all Notifications
      * @apiName index
      * @apiGroup Notifications
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"results":[
						{
							"notification_id":"1",
							"notification_type":"2",
							"note_en":"test",
							"note_ar":"\u062a\u064a\u0633\u062a",
							"is_read":"0",
							"notification_date":"2016-02-16 04:12:10",
							"order_id":"1",
							"order_number":"",
							"order_status":"0",
							"order_note":"with extra potatoes",
							"order_total_value":"25",
							"order_date":"2016-02-17 04:11:18",
							"user_fullname":"Admin istrator",
							"branch_name_en":"Aziziah Street",
							"branch_code":"",
							"branch_name_ar":"\u0634\u0627\u0631\u0639 \u0627\u0644\u0639\u0632\u064a\u0632\u064a\u0629"
						}
					],
					"page":1,
					"pages_count":1,
					"total":1,
					"success":true
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
		$this->response('this method is not supported',400);
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
				$update_data = [];
				$update_data['is_read'] = $data['is_read'];
				
				$this->model->update_status($id,$update_data);
				$this->response('updated successfully',200);
			}

		}
	}
	
	protected function can_read(){
        return ($this->is_cashier || $this->is_branch_manager || $this->is_user_admin);
    }
	
	 protected function can_edit(){
        return ($this->is_cashier || $this->is_branch_manager || $this->is_user_admin);
    }
	
	protected function on_before_get(){
		 if($this->is_cashier || $this->is_branch_manager)
		 {
			$this->load->library('ion_auth');
			$user = $this->ion_auth->user()->row();
        
			$this->filter = ['orders.branch_id'=>$user->branch_id];
		 }
		 
        return;
    }
}