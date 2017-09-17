<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Notifications_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		$this->table = 'notifications';
		$this->primary_column = 'notification_id';

		$this->columns = ['notification_id', 'notification_type', 'note_en', 'note_ar', 'is_read',
		'notification_date', 'order_id','is_deleted'];

		$this->joins = [
		'orders'	=>	['orders.order_id = notifications.order_id AND orders.is_deleted = 0',''] ,
		'users'	=>	['users.id = orders.user_id','left'] ,
		'branches'	=>	['branches.branch_id = orders.branch_id','left'] ,
		];

		$this->select_columns = ["notifications.*","orders.order_number","orders.order_status","orders.order_note"
		,"orders.order_total_value","orders.order_date","CONCAT_WS(' ', users.first_name, users.last_name) AS user_fullname"
		,"branches.branch_name_en","branches.branch_name_ar","branches.branch_code"];

		$this->validation_rules = [
			'notification_id'    =>	[ 'Notification Id','trim|integer'] ,
			'notification_type'    =>	[ 'Notification Type','trim|required'] ,
			'note_en'    =>	[ 'Note En','trim'] ,
			'note_ar'    =>	[ 'Note Ar','trim'] ,
			'is_read'    =>	[ 'Is read','trim'] ,
			'notification_date'    =>	[ 'Notification Date','trim'] ,
			'order_id'    =>	[ 'Order Id','trim|required'] ,
			
		];
	
	}
	
	public function update_status ($id,$data)
	{
		$res = $this->db->where('notification_id',$id)->update('notifications',$data);
		return $res;
	}
}