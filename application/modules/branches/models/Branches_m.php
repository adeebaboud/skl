<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Branches_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		$this->table = 'branches';
		$this->primary_column = 'branch_id';
		$this->order_by = 'branch_sort';
		$this->order_dir = 'ASC'; 

		$this->columns = ['branch_id', 'branch_name_en','branch_code', 'branch_name_ar', 'branch_address_en', 'branch_address_ar',
						'branch_latitude', 'branch_longitude', 'branch_phone','branch_mobile','branch_sort','country_id','is_featured',
						'description_ar','description_en','is_enabled','image_ar','image_en','fax','email'
						];

		$this->joins = [
			'countries'	=>	['countries.country_id = branches.country_id','left'] ,
		];

		$this->select_columns = ["branches.*","countries.country_name_en","countries.country_name_ar"];

		$this->validation_rules = [
			'branch_id'    =>	[ 'Branch Id','trim|integer'] ,
			'branch_code'    =>	[ 'Branch Code','trim|required'] ,
			'branch_name_en'    =>	[ 'Branch Name En','trim|required'] ,
			'branch_name_ar'    =>	[ 'Branch Name Ar','trim|required'] ,
			'branch_address_ar'    =>	[ 'Address Ar','trim'] ,
			'branch_address_en'    =>	[ 'Address En','trim'] ,
			'branch_latitude'    =>	[ 'Latitude','trim'] ,
			'branch_longitude'    =>	[ 'Longitude','trim'] ,
			'branch_phone'    =>	[ 'Phone','trim|required'],
			'branch_mobile'    =>	[ 'Mobile','trim'],
			'branch_sort'    =>	[ 'Sort','trim'],
			'country_id'    =>	[ 'country','trim|integer|required'],
			'is_featured'    =>	[ 'Is Featured','trim|integer'],
			'is_enabled'    =>	[ 'Is Enabled','trim|integer'],
			'description_ar'    =>	[ 'Description AR','trim'],
			'description_en'    =>	[ 'Description EN','trim'],
			
			
		];
	
	}
	
	public function get_countries()
	{
		$countries= $this->db->select()->from('countries')->get()->result();
		return $countries;
	}
	
	protected function on_after_add($inserted_entity, $id, $original_entity)
	{
		if(array_key_exists('branch_images',$original_entity)) 
		{
			foreach ($original_entity['branch_images'] as $extra)
			{
				$insert = [];
				$insert['branch_id'] = $id;
				$insert['title_en'] = $extra['title_en'];
				$insert['title_ar'] = $extra['title_ar'];
				$insert['description_en'] = $extra['description_en'];
				$insert['description_ar'] = $extra['description_ar'];
				$insert['photo_en'] = $extra['photo_en'];
				$insert['photo_ar'] = $extra['photo_ar'];
				$insert['sort'] = $extra['sort'];
				$this->db->insert('branch_images',$insert);
			}
		}
	
	}
	protected function on_after_update($updated_entity, $id, $original_entity)
	{
		if(array_key_exists('branch_images',$original_entity)) 
		{
			$this->db->where('branch_id',$id)->delete('branch_images');
			foreach ($original_entity['branch_images'] as $extra)
			{
				$insert = [];
				$insert['branch_id'] = $id;
				$insert['title_en'] = $extra['title_en'];
				$insert['title_ar'] = $extra['title_ar'];
				$insert['description_en'] = $extra['description_en'];
				$insert['description_ar'] = $extra['description_ar'];
				$insert['photo_en'] = $extra['photo_en'];
				$insert['photo_ar'] = $extra['photo_ar'];
				$insert['sort'] = $extra['sort'];
				$this->db->insert('branch_images',$insert);
			}
		}
	
	}

	protected function on_after_get($response)
	{
		$this->start_cache();
		foreach ($response['results'] as $result)
		{
			$result->branch_images = $this->db->select()->from('branch_images')->where('branch_id',$result->branch_id)->get()->result();
		}
		$this->end_cache();
		return $response;
	}

}
