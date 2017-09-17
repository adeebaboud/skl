<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';


class Groups extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

        $this->load->database();
		$this->load->library('form_validation');
		$this->load->library('ion_auth');
	}
	
	
	
	/**
      * @api {get} /groups Get all users groups
      * @apiName index
      * @apiGroup groups
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"id":"1",
					"name":"admin",
					"description":"Administrator"
				},
				{
					"id":"2",
					"name":"members",
					"description":"General User"
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
		  
		  $groups = $this->ion_auth->groups()->result();
		  if($groups != NULL)
		  {
			  $results = new stdClass();
			  $results->results = $groups;
			  $this->response($results,200);
		  }
		  else
		  {
			  $group = new stdClass();
			  $group->success = false;
			  $this->response($group,400);
				
		  }
		  
	  }
	  
	  
	  
	  	/**
      * @api {post} /groups create new group
      * @apiName index
      * @apiGroup groups
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{"success":true}
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
		  
		if($this->post())
		{
			$this->form_validation->set_data($this->post());

			$this->form_validation->set_rules('name', 'Group Name', 'trim|required|min_length[2]');
			$this->form_validation->set_rules('description', 'Group Description', 'trim|min_length[2]');
			
			if($this->form_validation->run() === FALSE)
			{
				$group = new stdClass();
				$group->success = false;
				$group->msg = validation_errors();
				$this->response($group,400);
			}
			else
			{
	
				  $data  = $this->post();
				  $group_name = $data['name'];
				  $group_description = $data['description'];
				  
				  $res = $this->ion_auth->create_group($group_name, $group_description);
				  if($res != false)
				  {
					  $group = new stdClass();
					  $group->success = true;
					  $group_id = $res;
					  $group->data = $this->ion_auth->group($group_id)->result()[0];
						$this->response($group);  
				  }
				  else
				  {
					  $group = new stdClass();
					  $group->success = false;
					  $this->response($group);  
				  }
				  
			}
		}
		else
		{
			$group = new stdClass();
			$group->success = false;
			$group->msg = 'Please Fill in Required Fields';
			$this->response($group,400);
		}
	  }
	  
	  
	  	/**
      * @api {post} /groups/update/4 Update group by id
      * @apiName update
      * @apiGroup groups
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{"success":true}
            ]
      *
      * @apiError InternalError Internal Error Happened
      *
      * @apiErrorExample Error-Response:
      *     HTTP/1.1 400 Not Found
      *     {
      * 	  }
      */
	
	public function update_post($id)
	{
		if($this->post())
		{
			$this->form_validation->set_data($this->post());

			$this->form_validation->set_rules('name', 'Group Name', 'trim|required|min_length[2]');
			$this->form_validation->set_rules('description', 'Group Description', 'trim|min_length[6]');
			
			if($this->form_validation->run() === FALSE)
			{
				$group = new stdClass();
				$group->success = false;
				$group->msg = validation_errors();
				$this->response($group,400);
			}
			else
			{
				$group = new stdClass();
				
				$data = $this->post();
				$group_name = $data['name'];
				$group_description = $data['description'];
				$res = $this->ion_auth->update_group($id, $group_name, $group_description);

				if(!$res)
				{
					$group->success = false;
					$group->msg = $this->ion_auth->messages();
				}
				else
				{
				$group->success = True ;
				$this->response($group,200);
				}
			}
		}else
		{
			$group = new stdClass();
			$group->success = false;
			$group->msg = 'Please Fill in Required Fields';
			$this->response($group,400);
		}
	
	}
	

	  	/**
      * @api {delete} /groups/?id=1 Delete group by id
      * @apiName index
      * @apiGroup groups
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"msg": "Deleted Successfully",
					"success" : true
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

	public function delete_get()
	{
		$id = $this->query('id');
		
		$this->ion_auth->delete_group($id);

		$group = new stdClass();
		$group->success = true;
		$group->msg = 'Deleted Successfully';
		$this->response($group,200);
	
	}

	protected function can_read(){
        return ($this->is_cashier || $this->is_branch_manager || $this->is_user_admin);
    }
	
}
	
	