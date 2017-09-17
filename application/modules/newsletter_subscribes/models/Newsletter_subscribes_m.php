<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Newsletter_subscribes_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		$this->table = 'newsletter_subscribes';
		$this->primary_column = 'newsletter_subscribe_id';

		$this->columns = ['newsletter_subscribe_id',  'contact_date', 'sender_email', 'sender_phone', 'sender_name','is_read','city'];
 
		$this->joins = [];

		$this->select_columns = ["newsletter_subscribes.*"];

		$this->validation_rules = [
			'newsletter_subscribe_id'    =>	[ 'Contact us Id','trim|integer'] ,
			'contact_date'    =>	[ 'Date','trim|required'] ,
			'sender_email'    =>	[ lang('email'),'trim|required']
			
		];
	
	}
	
	public function update_status($message_id,$data)
	{
		$res = $this->db->where('newsletter_subscribe_id',$message_id)->update('newsletter_subscribes',$data);
		return $res;
	}
}
