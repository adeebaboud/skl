<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Sections_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		$this->table = 'sections';
		$this->primary_column = 'section_id';
		$this->order_by = 'sort';
		$this->order_dir = 'ASC'; 

		$this->columns = [	'section_id', 'section_title_en', 'section_title_ar', 'section_description_en', 
							'section_description_ar','main_image','show_in_menu','section_slug','parent_id',
							'section_layout','sort'];

		$this->joins = [];

		$this->select_columns = ["sections.*"];

		$this->validation_rules = [
			'section_id'    =>	[ 'Section Id','trim|integer'] ,
			'section_title_en'    =>	[ 'Section Title En','trim'] ,
			'section_title_ar'    =>	[ 'Section Title Ar','trim|required'] ,
			'section_description_en'    =>	[ 'Description En','trim'] ,
			'section_description_ar'    =>	[ 'Description Ar','trim'] ,
			'main_image'    	=>	[ 'Image', 'trim'] ,
			'show_in_menu'    	=>	[ 'Show in Menu', 'trim'] ,
			'section_slug'    	=>	[ 'Slug', 'trim|required'] ,
			'parent_id'    		=>	[ 'Parent Id', 'trim|integer'] , 
			'section_layout'    =>	[ 'Section Layout', 'trim'] , 
			'sort'    =>	[ 'sort', 'trim|integer'] 
		];
		
		$this->insert_validation_rules = [
			'section_slug'    =>	[ 'Slug','trim|required|is_unique[sections.section_slug]']
		];
		$this->update_validation_rules = [
			'section_slug'    =>	[ 'Slug','trim|required']
			];
	
	
	}
 
	public function validate($entity,$operation = 'any')
	{
		$res = parent::validate($entity,$operation = 'any');
		 
		if(!empty($entity['custom_fields'])){
			$map_unique=array( );
			foreach ($entity['custom_fields'] as $custom_field)
			{ 
				if( empty( $custom_field["label_en"]) ||empty( $custom_field["label_ar"] ))
				{
					$res->success = FALSE;
					$res->errors[] =  'Make sure all custom fields labels are set.' ;
					return $res;
				} 
				if(!array_key_exists("type",$custom_field) || !in_array($custom_field['type'],['text', 'textarea', 'file', 'editor'] ))
				{
					$res->success = FALSE;
					$res->errors[] =  'Make sure all custom fields types are set.' ;
					return $res;
				} 
				if( empty( $custom_field["name"]))
				{
					$res->success = FALSE;
					$res->errors[] =  'Make sure all custom fields names are set.' ;
					return $res;
				}
				if(!array_key_exists(  $custom_field["name"] , $map_unique)  )
				{
					$map_unique[$custom_field["name"]]=1;
				}
				else
				{
					$res->success = FALSE;
					$res->errors[] =  'Make sure all custom fields names are unique.' ;
					return $res;
				}

			}
		}  
		return $res;  
	} 

	protected function on_after_add($inserted_entity, $id, $original_entity)
	{
		if(array_key_exists('custom_fields',$original_entity)) 
		{
			foreach($original_entity['custom_fields'] as $section_custom_field)
			{
				$section_custom_field['section_id'] = $id;
				$this->db->insert('section_custom_fields',$section_custom_field);
			}
		}
	}
	
	protected function on_after_update($updated_entity, $id, $original_entity)
	{
		if(array_key_exists('custom_fields',$original_entity)) 
		{
			$this->db->where('section_id',$id)->delete('section_custom_fields');
			foreach($original_entity['custom_fields'] as $section_custom_field)
			{
				$section_custom_field['section_id'] = $id;
				$this->db->insert('section_custom_fields',$section_custom_field);
			}
		}
	}

	protected function on_after_get($response)
	{
		foreach ($response['results'] as $result)
		{
			$result->custom_fields =$this->get_custom_fields(['section_custom_fields.section_id'=>$result->section_id]);
		}
		return $response;
	}

	public function get_children($parent_section,$include_pages = FALSE){
		if(is_object($parent_section)){
			$filter = ['parent_id'=>$parent_section->section_id];
		}else{
			$filter = ['parent_id'=>$parent_section];
		}
		$sections =  $this->get($filter);
		if($include_pages){
			$this->load->model('pages/pages_m');
			foreach($sections['results'] as $section){
				$section->pages = $this->pages_m->get(['pages.section_id'=>$section->section_id])['results'];
			}
		}
		return $sections;
	}

	public function get_tree($parent_id = NULL,$roots = NULL){
	 
		if(is_null($roots))
	 		$roots = $this->get([],1,100)['results']; 

		$filtered = [];
		foreach($roots as $i=>$value){
			if(is_null($parent_id) && $value->parent_id == 0){
				$filtered[] = $value;
			}elseif($value->parent_id == $parent_id ){
				$filtered[] = $value;
			}
		}  
		  
		 foreach ($filtered as $key => $value) {
		 	 $value->sections = $this->get_tree($value->section_id,$roots);
		 }

		return $filtered;
	}

	public function get_custom_fields ($filter = [] , $select = 'section_custom_fields.*'){
		$custom_fields = $this->db->select($select)->where($filter)
			->from('section_custom_fields')
			->get()->result();
		
		return $custom_fields;
	}














	
}
