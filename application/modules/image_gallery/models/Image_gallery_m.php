<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Image_gallery_m extends DAS_Model
{
	function __construct()
	{
		parent::__construct();
		$this->table = 'image_galleries';
		$this->primary_column = 'id';

		$this->columns = ['id','name', 'title_en', 'title_ar'];

		$this->joins = [];

		$this->select_columns = ["image_galleries.*"];

		$this->validation_rules = [
			'id'    =>	[ 'Id','trim|integer'] ,
			'name'    =>	[ 'Name','trim|required'] ,
			'title_en'    =>	[ 'Title En','trim|required'] ,
			'title_ar'    =>	[ 'Title Ar','trim|required'] ,
		];
	
	}
	
	protected function on_after_add($inserted_entity, $id, $original_entity)
	{
		foreach($original_entity['images'] as $image)
		{
			$details['image_gallery_id'] = $id;
			$details['title_en'] = $image['title_en'];
			$details['title_ar'] = $image['title_ar'];
			$details['description_en'] = $image['description_en'];
			$details['description_ar'] = $image['description_ar'];
			$details['photo_en'] = $image['photo_en'];
			$details['photo_ar'] = $image['photo_ar'];
			$details['sort'] = $image['sort'];
			
			$this->db->insert('image_gallery_images',$details);
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
	
		$this->db->where('image_gallery_id',$id);
		$this->db->delete('image_gallery_images');
		
		foreach($original_entity['images'] as $image)
		{
			$details['image_gallery_id'] = $id;
			$details['title_en'] = $image['title_en'];
			$details['title_ar'] = $image['title_ar'];
			$details['description_en'] = $image['description_en'];
			$details['description_ar'] = $image['description_ar'];
			$details['photo_en'] = $image['photo_en'];
			$details['photo_ar'] = $image['photo_ar'];
			$details['sort'] = $image['sort'];
			
			$this->db->insert('image_gallery_images',$details);
		
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
			$result->images=$this->get_images(['image_gallery_images.image_gallery_id'=>$result->id]);
				
		}
		return $response;
	}

	public function get_images($filter = [],$select='image_gallery_images.*'){
		$this->db->select($select);
		$this->db->where($filter);
		$this->db->from('image_gallery_images');
		$images = $this->db->get()->result();
		
	 	return $images;
	}


}
