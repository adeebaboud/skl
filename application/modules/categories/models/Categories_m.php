<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Categories_m extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		$this->enable_cache = true;
		$this->table = 'categories';
		$this->primary_column = 'category_id';

		$this->columns = ['category_id','parent_category_id', 'category_name_en', 'category_name_ar', 'category_description_en', 
		'category_description_ar','category_sort'	];

		$this->joins = [];

		$this->select_columns = ["categories.*"];

		$this->validation_rules = [
			'category_id'    =>	[ 'Category Id','trim|integer'] ,
			'category_name_en'    =>	[ 'Category Name En','trim|required'] ,
			'category_name_ar'    =>	[ 'Category Name Ar','trim|required'] ,
			'category_description_en'    =>	[ 'Description En','trim'] ,
			'category_description_ar'    =>	[ 'Description Ar','trim'] ,
			'sort'    =>	[ 'Sort','trim'],
			
		];
	
	}
	
	public function get_products($id)
	{
		$this->db->cache_off();
		$res = $this->db->select('*')->from('products')->where('category_id',$id)->get()->result();
		$this->db->cache_on();
		return $res;
	}
	
	public function get_products_count($id){
		return $this->db->select()->from('products')->where('category_id',$id)->count_all_results();
	}

	
}
