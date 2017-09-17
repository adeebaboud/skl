<?php
 
class Mailsender { 
	public $errors = [];
	public $data = [];
	 
	function __construct( ){
		$this->ci =& get_instance();
		$this->ci->load->config('email', TRUE); 
		$this->ci->load->library(array('email'));
		$email_config = $this->ci->config->item('email_config', 'email'); 
		$this->ci->email->initialize($email_config);
		$this->ci->load->model('biography/biography_m','bio_m');

		$bio = $this->ci->bio_m->get_biography();
		$data['bio'] = new stdClass();
		foreach($bio as $bio_item){
			$data['bio']->{$bio_item->name} = $bio_item->value;
		}	
		$this->data = $data;		
	}
	
	public function send($subject,$msg,$to)
	{ 
		$this->data['content'] = $msg;
		$this->data['header'] = $subject;
		//$message = $this->ci->load->view($this->ci->config->item('email_templates', 'email').$template , $this->data, true);
        $message =$msg;
        $this->ci->email->clear();
		$this->ci->email->from($this->ci->config->item('admin_email', 'email'), $this->ci->config->item('site_title', 'email'));
		$this->ci->email->to($to);
		$this->ci->email->subject($this->ci->config->item('site_title', 'email') . ' - ' .  $subject);
		$this->ci->email->message($message);
		if ($this->ci->email->send())
		{
			return TRUE;
		}
		else
		{
            //echo $this->ci->email->print_debugger();
			return FALSE;
		}

	}
}
