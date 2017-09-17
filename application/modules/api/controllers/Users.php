<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Users extends DAS_REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct('users/users_m','sm');

       $this->load->library('form_validation');
		$this->load->library('ion_auth');
	}
		/**
      * @api {get} /users Get all users
      * @apiName index
      * @apiGroup users
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
              
			  {
				  "id":"1",
				  "username":"administrator",
				  "email":"admin@admin.com",
				  "active":"1",
				  "first_name":"Admin",
				  "last_name":"istrator",
				  "company":"ADMIN",
				  "phone":"0"
			  },
			  {
				  "id":"6",
				  "username":"hanan",
				  "email":"hanan@das-360.com",
				  "active":"1",
				  "first_name":"hanan",
				  "last_name":null,
				  "company":null,
				  "phone":null
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

	

		/**
      * @api {get} /Users/user_by_id/1 Get user by id
      * @apiName user_by_id
      * @apiGroup users
      *
      * @apiSuccess 200 OK.
      * 
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
              
				{
					"id":"1",
					"username":"administrator",
					"email":"admin@admin.com",
					"active":"1",
					"first_name":"Admin",
					"last_name":"istrator",
					"company":"ADMIN",
					"phone":"0",
					"groups":[
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
	  
	protected function user_by_id($id)
	{
		$user = $this->ion_auth->user($id)->row();
		$user->groups = $this->ion_auth->get_users_groups($id)->result();
		if($user == NULL)
		{
			$user = new stdClass();
			$user->success = false;
			return $user;
		}	
		else
		{
			$temp = new stdClass();
		
			$temp->id = $user->id;
			$temp->username = $user->username;
			$temp->email = $user->email;
			$temp->active = $user->active;
			$temp->first_name = $user->first_name;
			$temp->last_name = $user->last_name;
			$temp->company = $user->company;
			$temp->phone = $user->phone;	
			$temp->group_id = $user->groups[0]->id;	
			$temp->group_name = $user->groups[0]->name;	
			return $temp;
		}
	}
	
		/**
      * @api {post} /users New User
      * @apiName index
      * @apiGroup users
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
				  "success":true,
				  "id":4
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
	
	public function index_post()
	{
		if($this->post())
		{
			$this->form_validation->set_data($this->post());

			$this->form_validation->set_rules('username', 'User Name', 'trim|required|min_length[2]');
			$this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[4]');
			$this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email|is_unique[users.email]');
			$this->form_validation->set_rules('first_name', 'First Name', 'trim|required|min_length[2]');
			
			if($this->form_validation->run() === FALSE)
			{
				$error =  $this->form_validation->error_array();
				$this->response([
                'success'=> FALSE,
                'errors'=>$error
				],400);
				
			}
			else
			{
				$data = $this->post();
				
				$username = $data['username'];
				
				$password = $data['password'];
				unset($data['password']);
				
				$email = $data['email'];
				unset($data['email']);
				
				$group_id = $data['group'];
				$group = array($group_id);
				unset($data['group']);
				
				
				$user_id = $this->ion_auth->register($email, $password, $email, $data, $group);
				$user = new stdClass();
				//$this->response($users);
				$user->data = $this->user_by_id($user_id);
				
				$this->response($this->map_to_json($user),200);
				
			
			}
		}else
		{
			
			$error = new stdClass();
				$this->response([
                'success'=> FALSE,
                'errors'=> 'Failed To Insert'
				],400);
		}
	
	}


	
		/**
      * @api {post} /users/update/4 Update User by id
      * @apiName update
      * @apiGroup users
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
	
	public function update_post($id=NULL)
	{
		if($this->post())
		{
			$this->form_validation->set_data($this->post());

			$this->form_validation->set_rules('username', 'User Name', 'trim|required|min_length[2]');
			$this->form_validation->set_rules('password', 'Password', 'trim');
			$this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email');
			$this->form_validation->set_rules('first_name', 'First Name', 'trim|required|min_length[2]');
			
			if($this->form_validation->run() === FALSE)
			{
				$user = new stdClass();
				$user->success = false;
				$user->msg = validation_errors();
				$this->response($user,400);
			}
			else
			{
				$data = $this->post();
				if($data['group_id']!=2 && $data['group_id']!=3 )
					$data['branch_id'] = NULL;
				$res = $this->ion_auth->update($id, $data);
				$user = new stdClass();
				$user->success = $res ;
				$this->response($user,200);
			
			}
		}else
		{
			$user = new stdClass();
			$user->success = false;
			$user->msg = 'Please Fill in Required Fields';
			$this->response($user,400);
		}
	
	}
	
	
	  
	  
	  	/**
      * @api {post} /users/assign_group assign user to group
      * @apiName assign_group
      * @apiGroup users
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
	  public function assign_group_post()
	  {
		  $data  = $this->post();
		  $user_id = $data['id'];
		  $groups= $data['selected'];
		  
		  $this->ion_auth->remove_from_group(NULL, $user_id);
		  $res = $this->ion_auth->add_to_group($groups, $user_id);
		  if($res != false)
		  {
			  $group = new stdClass();
			  $group->success = true;
			 $this->response($group);  
		  }
		  else
		  {
			  $group = new stdClass();
			  $group->success = false;
			  $this->response($group);  
		  }
		  
		  
	  }
	
	  
	  
		/**
      * @api {delete} /users/?id=1 Delete user by id
      * @apiName index
      * @apiGroup users
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
		parent::soft_delete_get();
	
	}

	protected function can_read(){
        return ($this->is_cashier || $this->is_branch_manager || $this->is_user_admin);
    }
}

