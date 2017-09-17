<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Sliders_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		
		$this->table = 'sliders';
		$this->primary_column = 'slider_id';

		$this->columns = ['slider_id','slider_name', 'slider_title_en', 'slider_title_ar'];

		$this->joins = [];

		$this->select_columns = ["sliders.*"];

		$this->validation_rules = [
			'slider_id'    =>	[ 'Slider Id','trim|integer'] ,
			'slider_name'    =>	[ 'Slider Name','trim|required'] ,
			'slider_title_en'    =>	[ 'Slider Title En','trim|required'] ,
			'slider_title_ar'    =>	[ 'Slider Title Ar','trim|required'] ,
		];
	
	}
	

	
	protected function on_after_add($inserted_entity, $id, $original_entity)
	{
	
		foreach($original_entity['slides'] as $slide)
		{
			$details['slider_id'] = $id;
			$details['slide_title_en'] = $slide['slide_title_en'];
			$details['slide_title_ar'] = $slide['slide_title_ar'];
			$details['slide_description_en'] = $slide['slide_description_en'];
			$details['slide_description_ar'] = $slide['slide_description_ar'];
			$details['slide_photo_en'] = $slide['slide_photo_en'];
			$details['slide_photo_ar'] = $slide['slide_photo_ar'];
			$details['slide_link'] = $slide['slide_link'];
			
			$details['slide_sort'] = $slide['slide_sort'];
			
			$this->db->insert('slider_slides',$details);
		
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
	
		$this->db->where('slider_id',$id);
		$this->db->delete('slider_slides');
		
		foreach($original_entity['slides'] as $slide)
		{
			$details['slider_id'] = $id;
			$details['slide_title_en'] = $slide['slide_title_en'];
			$details['slide_title_ar'] = $slide['slide_title_ar'];
			$details['slide_description_en'] = $slide['slide_description_en'];
			$details['slide_description_ar'] = $slide['slide_description_ar'];
			$details['slide_photo_en'] = $slide['slide_photo_en'];
			$details['slide_photo_ar'] = $slide['slide_photo_ar'];
			$details['slide_sort'] = $slide['slide_sort'];
			$details['slide_link'] = $slide['slide_link'];
			
			$this->db->insert('slider_slides',$details);
		
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
			
			$result->slides=$this->get_slides(['slider_slides.slider_id'=>$result->slider_id]);
				
		}
		
		return $response;
	}

	public function get_slides($filter = [],$select='slider_slides.*'){
		$this->db->select($select);
		$this->db->where($filter);
		$this->db->from('slider_slides');
		$slides = $this->db->get()->result();
		
	 	return $slides;
	}
}