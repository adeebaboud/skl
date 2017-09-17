<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Biography_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
	
	}
	
	public function get_biography()
	{
		$this->start_cache();
		$bio = $this->db->select()->from('biography')->get()->result();
		$this->end_cache();
		return $bio;
	}
	
	public function add_biography($bio)
	{
		foreach($bio as $b)
		{
			$res = $this->db->select('*')->from('biography')->where('name', $b->name)->get()->result();
			if(count($res) == 0){
				$this->db->insert('biography',array('name'=> $b->name,'value' => $b->value));
			}else{
				$this->db->where('name', $b->name);
				$this->db->update('biography',array('value' => $b->value));
			}
			$this->db->cache_delete_all();
		}
	}
	
}
