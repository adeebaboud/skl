<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Pages extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('pages/pages_m','pm');
		
    }
	
		/**
      * @api {get} /pages Get all pages
      * @apiName index
      * @apiGroup pages
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"results":[
						{
							"page_id":"1",
							"section_id":"1",
							"page_title_en":"page 1",
							"page_title_ar":"\u0627\u0644\u0635\u0641\u062d\u0629 1",
							"page_description_en":"test test test test",
							"page_description_ar":"\u062a\u064a\u0633\u062a \u062a\u064a\u0633\u062a \u062a\u064a\u0633\u062a \u062a\u0633\u062a",
							"page_content_en":"page content here",
							"page_content_ar":"\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u0635\u0641\u062d\u0629 \u0647\u0646\u0627",
							"page_image":"image.jpg",
							"created_date":"2016-02-16 04:11:15",
							"created_by":"1",
							"section_title_en":"news",
							"section_title_ar":"\u0623\u062e\u0628\u0627\u0631",
							"main_image":"news.jpg",
							"created_by_name":"Admin istrator"
						}
					],
					"page":1,
					"pages_count":1,
					"total":1,
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
	* @api {post} /pages Add New Page
      * @apiName index
      * @apiGroup pages
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
               {
				   "success":true,
				   "data":{
						"page_id":"2",
						"section_id":"2",
						"page_title_en":"who we are",
						"page_title_ar":"\u0645\u0646 \u0646\u062d\u0646",
						"page_description_en":"desc desc desc",
						"page_description_ar":"\u0646\u0635 \u0646\u0635 \u0646\u0635 \u0646\u0635",
						"page_content_en":" text texttext texttext text text",
						"page_content_ar":"\u062a\u064a\u0633\u062a \u062a\u064a\u0633\u062a \u062a\u064a\u0633\u062a \u062a\u064a\u0633\u062a",
						"page_image":"newssss.jpg",
						"created_date":"2016-02-16 00:00:00",
						"created_by":"1",
						"section_title_en":"events",
						"section_title_ar":"\u0645\u0646\u0627\u0633\u0628\u0627\u062a",
						"main_image":"event.jpg",
						"created_by_name":"Admin istrator"
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
      * @api {post} /pages/update/1 Update page by id
      * @apiName update
      * @apiGroup pages
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
      * @api {delete} /pages/?id=7 Delete page by id
      * @apiName index
      * @apiGroup pages
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
            $pages_layouts = array_filter(array_values($layouts),function($item){
                  return strpos( $item,'page') === 0 ;
            }); 
            $pages_layouts_obj = [];
            foreach($pages_layouts as $key      =>    $obj){
                 $pages_layouts_obj[] = [
                       'name'       =>   $obj  
                 ];
            }

            $this->response(['results'    =>   $pages_layouts_obj  ]);
      }

	protected function map_to_json($model){
		
		$model->is_searchable = intval($model->is_searchable);
		
		return $model;
	}

}