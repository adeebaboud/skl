<?php

/**
 * Created by PhpStorm.
 * User: DasGraphics
 * Date: 2/23/2016
 * Time: 4:15 PM
 */
class DAS_Frontend extends DAS_Controller
{

    protected $data = [];
    protected $logged_in = false;
    protected $user = null;
    protected $layout = 'layout';
    protected $theme = 'theme';


    protected $meta = [];

    function __construct()
    {
        parent::__construct();

        $this->set_bio(); 
        $this->set_user();
		$this->load->helper(['text','form']); 
		$this->load->model('menu/menu_m','menu'); 
		$this->data['main_menu'] = $this->menu->get(['menu.menu_name_en'=>'main menu'],1,1)['results'][0];  
		$this->data['footer_menu'] = $this->menu->get(['menu.menu_name_en'=>'footer_menu'],1,1)['results'][0]; 
         
		  
		$this->load->library('pagination');
	
		 
		$this->load->model('pages/pages_m','pm');

        //
        $banner_slider = slider('banner-slider');
		$this->data['banner_slider'] = $banner_slider; 
 
    }

    protected function meta($arg1,$arg2 = NULL){
        if(is_null($arg2) && is_array($arg1)){
            foreach($arg1 as $meta_key=>$meta_val){
                $this->meta[$meta_key] = $meta_val;
            }
        }else{
            $this->meta[$arg1] = $arg2;
        }
    }


    private function set_user()
    {
        $this->load->library('ion_auth');
        if($this->ion_auth->logged_in())
        {
            $this->user = $this->ion_auth->user()->row();
			
			if(!$this->ion_auth->in_group(4))
			{
				$this->logged_in = false;
				//$this->ion_auth->logout();
				//redirect('','refresh');
			}
			else
			{
				$this->logged_in = true;
				
			}
			
        }
		$this->data['logged_in'] = $this->logged_in;
		$this->data['user'] = $this->user;

        
    }

 

    private function set_bio(){
        $this->load->model('biography/biography_m','bio_m');

        $bio = $this->bio_m->get_biography();
        $this->data['bio'] = new stdClass();
        foreach($bio as $bio_item){
            $this->data['bio']->{$bio_item->name} = $bio_item->value;
        }
    }
	

    protected function render($view = ''){ 
        $this->data['styles'] = [];
        $this->data['theme'] = $this->theme  ;
        $this->data['view'] = $this->theme .'/' . $view;
        $this->data['data'] = $this->data;
        if(empty($this->meta['description'])){
            $this->meta['description'] = loc($this->data['bio'],'about');
        }
        if(empty($this->meta['author'])){
            $this->meta['author'] = 'das-360.com';
        }

        if(empty($this->meta['keywords'])){
            $this->meta['keywords'] = $this->data['bio']->keywords;
        }
        $this->data['meta'] = $this->meta;

		$output = $this->load->view($this->theme .'/' . $view,$this->data,TRUE);
		$this->data['content'] = $output;
        $this->load->view($this->theme .'/' .$this->layout,$this->data);
		
    }
}
