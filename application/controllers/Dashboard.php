<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends DAS_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->library('ion_auth');
		if (!$this->ion_auth->logged_in() ||  !($this->ion_auth->is_admin() ||  $this->ion_auth->in_group('Branch Manager') ||  $this->ion_auth->in_group('Cashier')))
		{
			// redirect them to the login page if not logged in or not member
			redirect('auth/login', 'refresh');
		}
	}

	public function index()
	{
		$user = $this->ion_auth->user()->row();
		$userInfo = new stdClass();
		$userInfo->name = $user->first_name . ' ' .$user->last_name;
		$userInfo->id = $user->id;
		$userInfo->lastLogin = date('Y-m-d H:i:s', $user->last_login);
		$userInfo->groups = $this->ion_auth->get_users_groups()->result();
		$userInfo->is_admin = $this->ion_auth->is_admin();
		$userInfo->is_manager = $this->ion_auth->in_group('Branch Manager');
		$userInfo->is_cashier = $this->ion_auth->in_group('Cashier');
		$userInfo->branch_id = $user->branch_id;
		$this->load->view('partials/_layout',
			[
				'user'	=>	$userInfo
			]);
	}
}
