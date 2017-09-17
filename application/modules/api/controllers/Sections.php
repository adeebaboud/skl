<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Sections extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('sections/sections_m','sm');
		
    }
	
		/**
      * @api {get} /Sections Get all Sections
      * @apiName index
      * @apiGroup Sections
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"results":[
						{
							"section_id":"2",
							"section_title_en":"events",
							"section_title_ar":"\u0645\u0646\u0627\u0633\u0628\u0627\u062a",
							"section_description_en":"events events",
							"section_description_ar":"\u0645\u0646\u0627\u0633\u0628\u0627\u062a \u0648\u0627\u062d\u062f\u0627\u062b",
							"main_image":"event.jpg"
						},
						{
							"section_id":"1",
							"section_title_en":"news",
							"section_title_ar":"\u0623\u062e\u0628\u0627\u0631",
							"section_description_en":"news news news news",
							"section_description_ar":"\u0623\u062e\u0628\u0627\u0631 \u0623\u062e\u0628\u0627\u0631 \u0623\u062e\u0628\u0627\u0631",
							"main_image":"news.jpg"
						}
					],
					"page":1,
					"pages_count":1,
					"total":2,
					"success":true
				}
            ]
      *
      * @apiError InternalError Internal Error Happened
      *
      * @apiErrorExample Error-Response:
      *     HTTP/1.1 400 Not Found
      *     {
      * 	  }
      */

	public function index_get()
    {
		parent::index_get();
				
    }
	
	
	
	/**
	* @api {post} /sections Add New Section
      * @apiName index
      * @apiGroup sections
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"success":true,
					"data":{
						"section_id":"3",
						"section_title_en":"test",
						"section_title_ar":"\u062a\u064a\u0633\u062a",
						"section_description_en":"test test test",
						"section_description_ar":"",
						"main_image":"test.jpg"
					}
				}
            ]
      *
      * @apiError InternalError Internal Error Happened
      *
      * @apiErrorExample Error-Response:
      *     HTTP/1.1 400 Not Found
      *     {
      * 	  }
      */
	
	public function index_post()
	{
		parent::index_post();
		
	}
	
	/**
      * @api {post} /sections/update/1 Update section by id
      * @apiName update
      * @apiGroup sections
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
				  "success":true,
				  "data":true
				 }
			  
            ]
      *
      * @apiError InternalError Internal Error Happened
      *
      * @apiErrorExample Error-Response:
      *     HTTP/1.1 400 Not Found
      *     {
      * 	  }
      */
	  
	public function update_post($id=NULL)
	{
		parent::update_post($id);
		
	}
	
	
	/**
      * @api {delete} /sections/?id=7 Delete section by id
      * @apiName index
      * @apiGroup sections
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"success":true,
					"errors":"Deleted Successfully"
				}
            ]
      *
      * @apiError InternalError Internal Error Happened
      *
      * @apiErrorExample Error-Response:
      *     HTTP/1.1 400 Not Found
      *     {
      * 	  }
      */
	public function delete_get()
	{
		parent::delete_get(); 
	}


      public function layouts_get(){
              $layouts = scandir(VIEWPATH .'theme'); 
            $sections_layouts = array_filter(array_values($layouts),function($item){
                  return strpos( $item,'section') === 0 ;
            }); 
            $sections_layouts_obj = [];
            foreach( $sections_layouts as $key => $obj ){
                 $sections_layouts_obj[] = [
                       'name'       =>   $obj  
                 ];
            } 
            $this->response(['results'    =>   $sections_layouts_obj  ]);
      }

	public function tree_get(){
            $this->response($this->model->get_tree());
      }

	protected function map_to_json($model){
		
		$model->show_in_menu = floatval($model->show_in_menu);
		$model->section_id = intval($model->section_id);
		if(!empty($model->parent_id))
			$model->parent_id = intval($model->parent_id);

		foreach ($model->custom_fields as $custom_field)
		{
			$custom_field->is_required =intval($custom_field->is_required);
		}
		
		return $model;
	}
}