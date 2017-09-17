<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Products extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('products/products_m','cm');
		
    }
	
	

    protected function map_to_json($model){
		
		$model->product_price = floatval($model->product_price);
		$model->thumb_en = str_replace('uploads','thumbs',$model->product_image_en);
		$model->thumb_ar = str_replace('uploads','thumbs',$model->product_image_ar);
		return $model;
	}
}