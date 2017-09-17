<?php
defined('BASEPATH') OR exit('No direct script access allowed');

  class Menu_model extends CI_Model{
	
	function get_all_products(){
		return $this->db->select('*')->from('products')->get()->result();
	}
	
	
	function get_categorized_menu( ){
		 
		 $categories = $this->get_categories();
		foreach( $categories as $category){
			$category->items = $this->get_category_items($category->category_id);  
		}
		return  $categories;
	}
	
	function get_category_items($category_id){
		$products = $this->db->select('*')
		->from('products')  
		->where([ 'products.category_id'=>$category_id])
		->get()->result();
		foreach($products as $product){
			$product->options = $this->get_product_ordering_options($product->product_id);
		}
		return $products;
	}
	
	function get_product_ordering_options($product_id=null){
		$res = $this->db->select("*")->from('product_ordering_options')
		->join('ordering_options','ordering_options.ordering_option_id = product_ordering_options.option_id')
		->where('product_id',$product_id)->get()->result(); 
		
		return $res;
	}
	
	function get_categories( ){ 
		 
		$results = $this->db->select('*')->from('categories')->get()->result();
		//die(var_dump($results));
		foreach($results as $result){
			$result->category_image_en = strpos($result->category_image_en,'http')===0 ? $result->category_image_en : BASE_WEBSITE . ($result->category_image_en);
			$result->category_image_ar =   strpos($result->category_image_ar,'http')===0 ? $result->category_image_ar : BASE_WEBSITE . ($result->category_image_ar);
		}
		return $results;
	}
}