<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Categories extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('categories/categories_m','cm');
		
    }
	
	public function delete_get()
	{
		$id = $this->query('id');

		$res = $this->model->get_products_count($id);
		if($res >0)
		{
			$resp = new stdClass();
			$resp->success = false;
			$resp->msg = 'you cant delete this category because it contains products';
			$this->response($resp);
		}else{
			parent::delete_get();
		}
		
	}
	
	
	  protected function map_to_json($model){
		
		$model->category_sort = intval($model->category_sort);
		
		return $model;
	}
}
