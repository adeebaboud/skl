<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Menu extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('menu/menu_m','sm');
		
    }
	
		/**
      * @api {get} /menu Get all menu
      * @apiName index
      * @apiGroup menu
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
				{
					"results":[
						{
							"slider_id":"1",
							"slider_name":"slider1",
							"slider_title_en":"home slider",
							"slider_title_ar":"\u0633\u0644\u0627\u064a\u062f\u0631 \u0627\u0644\u0635\u0641\u062d\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
							"slides":[
								{
									"slide_id":"1",
									"slide_title_en":"latest offers",
									"slide_title_ar":"\u0627\u062e\u0631 \u0627\u0644\u0639\u0631\u0648\u0636",
									"slide_description_en":"new offers has come ",
									"slide_description_ar":"\u0639\u0631\u0648\u0636 \u062c\u062f\u064a\u062f\u0629",
									"slide_photo_en":"offers.jpg",
									"slide_photo_ar":"offers_ar.jpg",
									"slide_sort":"1",
									"slider_id":"1"
								},
								{
									"slide_id":"2",
									"slide_title_en":"latest products",
									"slide_title_ar":"\u0627\u062e\u0631 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
									"slide_description_en":"new products coming by",
									"slide_description_ar":"\u0645\u0646\u062a\u062c\u0627\u062a \u062c\u062f\u064a\u062f\u0629",
									"slide_photo_en":"new_products.jpg",
									"slide_photo_ar":"new_products_ar.jpg",
									"slide_sort":"2",
									"slider_id":"1"
								}
							]
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
	* @api {post} /menu Add New Slider
      * @apiName index
      * @apiGroup menu
      *
      * @apiSuccess 200 OK.
      *
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     [
               {
				   "success":true,
				   "data":{
					   "slider_id":"2",
					   "slider_name":"slider2",
					   "slider_title_en":"products_slider",
					   "slider_title_ar":"\u0633\u0644\u0627\u064a\u062f\u0631 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
					   "slides":[
							{
								"slide_id":"3",
								"slide_title_en":"teset",
								"slide_title_ar":"\u062a\u064a\u0633\u062a",
								"slide_description_en":" test desc",
								"slide_description_ar":"\u062a\u064a\u0633\u062a \u062f\u064a\u0633\u0643",
								"slide_photo_en":"photo.jpg",
								"slide_photo_ar":"test.jpg",
								"slide_sort":"1",
								"slider_id":"2"
							}
						]
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
      * @api {post} /menu/update/1 Update slider by id
      * @apiName update
      * @apiGroup menu
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
      * @api {delete} /menu/?id=7 Delete slider by id
      * @apiName index
      * @apiGroup menu
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
		
	protected function map_to_json($model){
		
		foreach ($model->menu_items as $item)
		{
				$item->item_sort = intval($item->item_sort);
		
		}
		return $model;
	}
	
}