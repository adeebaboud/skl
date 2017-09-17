<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Products_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		$this->enable_cache = true;
		$this->table = 'products';
		$this->primary_column = 'product_id';

		$this->columns = ['product_id','product_name_en','product_name_ar','product_description_en','product_description_ar'
		,'product_image_en','product_image_ar','product_price','product_sort','category_id'];

		$this->joins = [
		'categories'	=>	['categories.category_id = products.category_id','left'] ,
		];

		$this->select_columns = ["products.*","categories.category_name_en","categories.category_name_ar"];

		$this->validation_rules = [
			'product_id'    =>	[ 'Product Id','trim|integer'] ,
			'product_name_en'    =>	[ 'Product Name En','trim|required'] ,
			'product_name_ar'    =>	[ 'Product Name Ar','trim|required'] ,
			'product_description_en'    =>	[ 'Description En','trim'] ,
			'product_description_ar'    =>	[ 'Description Ar','trim'] ,
			'product_image_en'    =>	[ 'Image En','trim|required'] ,
			'product_image_ar'    =>	[ 'Image Ar','trim|required'] ,
			'product_price'    =>	[ 'Price','trim|required'],
			'product_sort'    =>	[ 'Sort','trim'],
			'category_id'    =>	[ 'Category Id','trim|integer|required']
			
		];
	
	}
	

		
	protected function on_after_add($inserted_entity, $id, $original_entity)
	{
		if(array_key_exists('product_images',$original_entity)) 
		{
			foreach ($original_entity['product_images'] as $extra)
			{
				$insert = [];
				$insert['product_id'] = $id;
				$insert['title_en'] = $extra['title_en'];
				$insert['title_ar'] = $extra['title_ar'];
				$insert['description_en'] = $extra['description_en'];
				$insert['description_ar'] = $extra['description_ar'];
				$insert['photo_en'] = $extra['photo_en'];
				$insert['photo_ar'] = $extra['photo_ar'];
				$insert['sort'] = $extra['sort'];
				$this->db->insert('product_images',$insert);
			}
		}
	
	}
	protected function on_after_update($updated_entity, $id, $original_entity)
	{
		if(array_key_exists('product_images',$original_entity)) 
		{
			$this->db->where('product_id',$id)->delete('product_images');
			foreach ($original_entity['product_images'] as $extra)
			{
				$insert = [];
				$insert['product_id'] = $id;
				$insert['title_en'] = $extra['title_en'];
				$insert['title_ar'] = $extra['title_ar'];
				$insert['description_en'] = $extra['description_en'];
				$insert['description_ar'] = $extra['description_ar'];
				$insert['photo_en'] = $extra['photo_en'];
				$insert['photo_ar'] = $extra['photo_ar'];
				$insert['sort'] = $extra['sort'];
				$this->db->insert('product_images',$insert);
			}
		}
	
	}

	protected function on_after_get($response)
	{
		$this->start_cache();
		foreach ($response['results'] as $result)
		{
			$result->product_images = $this->db->select()->from('product_images')->where('product_id',$result->product_id)->get()->result();
		}
		$this->end_cache();
		return $response;
	}
	
}