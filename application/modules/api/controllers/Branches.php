<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Branches extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('branches/branches_m','bm');
		
    }
	
	
	public function countries_get()
	{
		$this->response($this->model->get_countries());
		
	}
	
	 protected function map_to_json($model){
		
		$model->is_featured = intval($model->is_featured);
		$model->is_enabled = intval($model->is_enabled);
		$model->branch_sort = intval($model->branch_sort);
		return $model;
	}
}
