<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Users_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		$this->table = 'users';
		$this->primary_column = 'id';

		$this->columns = ['id', 'ip_address', 'username', 'password',
		'salt','email','activation_code','forgotten_password_code','forgotten_password_time','remember_code',
		'created_on','last_login','active','first_name','last_name','company','phone','device_id','is_deleted'];

		$this->joins = [
			'users_groups'	=>	['users_groups.user_id = users.id',''] ,
			'groups'	=>	['groups.id = users_groups.group_id','']
		];

		$this->select_columns = ["users.id","users.username","users.email","users.active","users.first_name",
		"users.last_name","users.company","users.phone","users_groups.group_id","users.branch_id","groups.name as group_name"];

		$this->validation_rules = [
			'id'    =>	[ 'User Id','trim|integer'] ,
			'username'    =>	[ 'User Name','trim|required'] ,
			'password'    =>	[ 'Password','trim|required'] ,
			'first_name'    =>	[ 'First Name','trim|required'] ,
			'last_name'    =>	[ 'Last Name','trim'] ,
			'email'    =>	[ 'Email','trim|required'] ,
			'company'    =>	[ 'Company','trim'] ,
			'phone'    =>	[ 'Phone','trim'] ,
		];

	}
	
	
	protected function on_after_get($response)
	{ 
		foreach ($response['results'] as $result)
		{ 
			$result->full_name = $result->first_name . ' ' . $result->last_name;
		}
		return $response;
	}
	public function get_user_by_email($email)
	{
		$res = $this->db->select('id,is_deleted,active')->from('users')->where('email',$email)->get()->result();
		if(count($res)>0)
			return $res[0];
		else
			return false;
	}
	

}
