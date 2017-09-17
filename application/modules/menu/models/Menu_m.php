<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Menu_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		
		$this->table = 'menu';
		$this->primary_column = 'menu_id';

		$this->columns = ['menu_id','menu_name_en', 'menu_name_ar'];

		$this->joins = [];

		$this->select_columns = ["menu.*"];

		$this->validation_rules = [
			'menu_id'    =>	[ 'Menu Id','trim|integer'] ,
			'menu_name_en'    =>	[ 'Menu Name En','trim|required'] ,
			'menu_name_ar'    =>	[ 'Menu Name Ar','trim|required'] 
		];
	
	}
	

	
	protected function on_after_add($inserted_entity, $id, $original_entity)
	{ 
		foreach($original_entity['menu_items'] as $item)
		{ 
			$details = [];
			$details['menu_id'] = $id;
			$details['item_name_en'] = $item['item_name_en'];
			$details['item_name_ar'] = $item['item_name_ar'];
			$details['link_type'] = $item['link_type'];
			$details['link_value'] = $item['link_value'];
			$details['item_sort'] = $item['item_sort'];
			$details['icon'] = $item['icon'];  
			$details['submenu_id'] = $item['submenu_id'];  
			$item_id = $this->db->insert('menu_items',$details); 
		}
		
		if ($this->db->trans_status() === FALSE)
		{
			$this->db->trans_rollback();
		}
		else
		{
			$this->db->trans_commit();
		}
		
	}
	
	protected function on_after_update($updated_entity, $id, $original_entity)
	{
		$this->db->trans_begin();
	
		$this->db->where('menu_id',$id);
		$this->db->delete('menu_items');
		
		foreach($original_entity['menu_items'] as $item)
		{ 
			$details = [];
			$details['menu_id'] = $id;
			$details['item_name_en'] = $item['item_name_en'];
			$details['item_name_ar'] = $item['item_name_ar'];
			$details['link_type'] = $item['link_type'];
			$details['link_value'] = $item['link_value'];
			$details['item_sort'] = empty($item['item_sort']) ? 0 : $item['item_sort'];
			$details['icon'] = $item['icon'];  
			$details['submenu_id'] = $item['submenu_id'];  
			$item_id = $this->db->insert('menu_items',$details);
			  
		}
	
		if ($this->db->trans_status() === FALSE)
		{
			$this->db->trans_rollback();
		}
		else
		{
			$this->db->trans_commit();
		}
	}

	
	protected function on_after_get($response)
	{
		
		foreach ($response['results'] as $result)
		{
			
			$result->menu_items=$this->get_menu_items(['menu_items.menu_id'=>$result->menu_id ]);
			
			foreach($result->menu_items as $item)
			{
				if(!empty($item->submenu_id)){
					$item->submenu = $this->single($item->submenu_id);
				}
				if($item->link_type == 'page')
				{
					$page_info = $this->db->select()->from('pages')->where('page_id',$item->link_value)->get()->result();
					if(count($page_info)){
						$item->section_id = $page_info[0]->section_id;
						$item->page_slug = $page_info[0]->page_slug; 
					}
				}
				else if($item->link_type == 'section')
				{
					$section_info = $this->db->select()->from('sections')->where('section_id',$item->link_value)->get()->result();
					if(count($section_info))
						$item->section_slug = $section_info[0]->section_slug;
				}
			}
				
		}
		
		return $response;
	}

	public function get_menu_items($filter = [],$select='menu_items.*'){
		$this->db->select($select);
		$this->db->where($filter);
		$this->db->from('menu_items')
		->order_by('item_sort','ASC');
		$menu_items = $this->db->get()->result();
		
	 	return $menu_items;
	}
}