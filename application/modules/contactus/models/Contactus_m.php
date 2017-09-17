<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Contactus_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		$this->table = 'contact_us';
		$this->primary_column = 'contactus_id';

		$this->columns = ['contactus_id', 'title', 'contact_date', 'sender_name','sender_email',
		'sender_phone','message','is_read','type'];

		$this->joins = [];

		$this->select_columns = ["contact_us.*"];

		$this->validation_rules = [
			'contactus_id'    =>	[ 'Contact us Id','trim|integer'] ,
			'title'    =>	[ 'Title','trim|required'] ,
			'contact_date'    =>	[ 'Date','trim|required'] ,
			'sender_name'    =>	[ 'Sender Name','trim|required'] ,
			'sender_phone'    =>	[ 'Sender Phone','trim'] ,
			'sender_email'    =>	[ 'Sender Email','trim|required'] ,
			'message'    =>	[ 'Message','trim'] ,
			
		];
	
	}
	
	public function update_status($message_id,$data)
	{
		$res = $this->db->where('contactus_id',$message_id)->update('contact_us',$data);
		return $res;
	}
}
