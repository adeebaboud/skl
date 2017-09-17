<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Pages_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		$this->table = 'pages';
		$this->primary_column = 'page_id';

		$this->columns = ['page_id','section_id','page_slug','page_title_en','page_title_ar','page_description_en'
		,'page_description_ar','page_content_en','page_content_ar','page_image_en','page_image_ar','created_date',
		'page_subtitle_en','page_subtitle_ar','created_by','is_searchable','page_layout','date'];

		$this->joins = [
		'sections'	=>	['sections.section_id = pages.section_id','left'] ,
		'users'	=>	['users.id = pages.created_by','left'] 
		];

		$this->select_columns = ["pages.*","sections.section_title_en","sections.section_title_ar",
		"sections.main_image","CONCAT_WS(' ', users.first_name, users.last_name) AS created_by_name"];

		$this->validation_rules = [
			'page_id'    =>	[ 'Page Id','trim|integer'] ,
			'page_slug'    =>	[ 'Page Slug','trim|required'] ,
			'page_title_en'    =>	[ 'Page Title En','trim'] ,
			'page_title_ar'    =>	[ 'Page Title Ar','trim|required'] ,
			'page_description_en'    =>	[ 'Description En',''] ,
			'page_description_ar'    =>	[ 'Description Ar','trim'] ,
			'page_content_en'    =>	[ 'Content En','trim'] ,
			'page_content_ar'    =>	[ 'Content Ar','trim|required'] ,
			'page_image_en'    =>	[ 'Image En','trim'],
			'page_image_ar'    =>	[ 'Image Ar','trim|required'],
			'created_date'    =>	[ 'Created Date','trim'],
			'created_by'    =>	[ 'Created By','trim'],
			'section_id'    =>	[ 'Section Id','trim|integer|required'],
			'page_subtitle_en'    =>	[ 'Subtitle En','trim'],
			'page_subtitle_ar'    =>	[ 'Subtitle Ar','trim'],
			'is_searchable'    =>	[ 'Is Searchable','trim'],
			'page_layout'		=>	['Page Layout','trim']
			
		];
		
		$this->insert_validation_rules = [
			'page_slug'    =>	[ 'Page Slug','trim|required|is_unique[pages.page_slug]']
		];
		$this->update_validation_rules = [
			'page_slug'    =>	[ 'Page Slug','trim|required']
			];
	
	}
	public function validate($entity,$operation = 'any')
	{
		$res = parent::validate($entity,$operation = 'any');
		 
		if(!empty($entity['custom_field_values']))
		{

		$custom_fields =$this->get_custom_fields(['section_custom_fields.section_id'=>$entity['section_id']]);

			for( $i= 0 ; $i< count($entity['custom_field_values']) ; $i++ )
			{
				$custom_field_value=$entity['custom_field_values'][$i];

				if(array_key_exists($i,$custom_fields) )
				{
					if($custom_fields[$i]->is_required==TRUE && empty( $custom_field_value["value"]) )
					{
						$res->success = FALSE;
						$res->errors[] =  'Make sure all custom field ' . $custom_fields[$i]->label_en .'|' . $custom_fields[$i]->label_ar . ' are set.' ;
						return $res;
					} 
				}
			}
		}  
		return $res;  
	} 

	protected function on_after_add($inserted_entity, $id, $original_entity)
	{
		if(array_key_exists('custom_field_values',$original_entity)) 
		{
			$custom_fields =$this->get_custom_fields(['section_custom_fields.section_id'=>$inserted_entity['section_id']]);

			for( $i= 0 ; $i< count($original_entity['custom_field_values']) ; $i++ )
			{
				$custom_field_value=$original_entity['custom_field_values'][$i];
				if(array_key_exists($i,$custom_fields) && $custom_fields[$i]['id']==$custom_field_value['custom_field_id'])
				{
					$custom_field_value['page_id'] = $id;
					$this->db->insert('page_custom_field_values',$custom_field_value);
				}
			}			
		}
	}

	protected function on_after_update($updated_entity, $id, $original_entity)
	{
		if(array_key_exists('custom_field_values',$original_entity)) 
		{
			$this->db->where('page_id',$id)->delete('page_custom_field_values');

		$custom_fields =$this->get_custom_fields(['section_custom_fields.section_id'=>$updated_entity['section_id']]);

		for( $i= 0 ; $i< count($original_entity['custom_field_values']) ; $i++ )
		{
			$custom_field_value=$original_entity['custom_field_values'][$i];
			if(array_key_exists($i,$custom_fields) && $custom_fields[$i]->id==$custom_field_value['custom_field_id'])
			{
				$custom_field_value['page_id'] = $id;
				$this->db->insert('page_custom_field_values',$custom_field_value);
			}
		}			
		}
	}

	protected function on_after_get($response)
	{
		$this->start_cache();
		foreach ($response['results'] as $result)
		{
			$result->custom_field_values =$this->get_custom_field_values(['page_custom_field_values.page_id'=>$result->page_id]);
			$result->custom_fields =$this->get_object_custom_fields(['section_custom_fields.section_id'=>$result->section_id]);
		}
		$this->end_cache();
		return $response;
	}


	public function get_custom_field_values ($filter = [] , $select = 'page_custom_field_values.*'){
		$this->start_cache();
		$custom_field_values = $this->db->select($select)->where($filter)
			->from('page_custom_field_values')
			->join('section_custom_fields','section_custom_fields.id = page_custom_field_values.custom_field_id')
			->get()->result();
		$this->end_cache();
		return $custom_field_values;
	}





			


	public function get_custom_fields ($filter = [] , $select = 'section_custom_fields.*,page_custom_field_values.value as value'){
		$this->start_cache();
		$custom_fields = $this->db->select($select)->where($filter)
			->from('section_custom_fields')
			->join('page_custom_field_values','section_custom_fields.id = page_custom_field_values.custom_field_id', 'left')
			->get()->result();
		$this->end_cache();
		return $custom_fields;
	}

	public function get_object_custom_fields ($filter = [] ){
		$this->start_cache();
		$custom_fields = $this->get_custom_fields($filter);
		$object_custom_fields= array();

		foreach ($custom_fields as $custom_field)
		{
			$object_custom_fields[$custom_field->name] =  $custom_field;
		}
		$object_custom_fields = (object)$object_custom_fields;
		$this->end_cache();
		return $object_custom_fields;
	}








	
	
}