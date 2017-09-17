<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends DAS_Frontend {

	function __construct(){
		parent::__construct();
		
	}

	public function index()
	{ 
		
		
		$home_slider = slider('home-slider');
		$this->data['home_slider'] = $home_slider; 
		

	
		$news = $this->pm->get(['pages.section_id'=>42],1,8);
		$this->data['news'] = $news;
		$this->layout="layout_home";
		$this->render('home');
	}
	public function aboutus()
	{
		$this->render('about-us');
	}

 
	public function page($id=NULL)
	{
		
		if($id == NULL)
			show_404();
		
		if(intval($id)){
			$pages = $this->pm->get(['page_id'=>$id]);
			if(count($pages['results']) == 0)
				show_404();
		}
		else
		{
			$pages = $this->pm->get(['page_slug'=>$id]);
			if(count($pages['results']) == 0)
				show_404();
		}
		$page = $pages['results'][0];
		
		$this->data['page'] = $page;
		$this->data['page_class'] = ' page '   ;
	
		if(file_exists("application/views/theme/page-".$id.".php"))
			$this->render('page-'.$id);
		
		else
			$this->render('page');
		
	}
	
	
	public function section($id=NULL,$page_num=1)
	{
		

		$this->load->model('pages/pages_m','pm');
		$this->load->model('sections/sections_m','sm');//
		
		if($id==NULL)
			show_404();
		
		$per_page = 6; 
		$page_num = intval($page_num);
			
		if(intval($id))
		{
			$sections = $this->sm->get(['section_id'=>$id]);

			if(count($sections['results']) == 0)
				show_404();

			
			$pages = $this->pm->get(['pages.section_id'=>$id],$page_num,$per_page);

		}
		else
		{
			$sections = $this->sm->get(['section_slug'=>$id]);

			if(count($sections['results']) == 0)
				show_404();

			$pages = $this->pm->get(['pages.section_id'=>$sections['results'][0]->section_id],$page_num,$per_page);
			
		}
		
		$config['base_url'] = site_url($id);
		$config['total_rows'] =$pages['total'];
		$config['per_page'] = $per_page;  


		$this->pagination->initialize($config);  
		$section = $sections['results'][0];

		$this->data['section'] = $section;
		$this->data['pages'] = $pages;
		
		if(file_exists("application/views/theme/section-".$id.".php"))
			$this->render('section-'.$id);
		
		else
			$this->render('section');
	}
	

	
	
	public function contactus()
	{
		$this->load->model('branches/branches_m','branches_m');
        $branches = $this->branches_m->get()['results'];

        $this->data['branches'] = $branches;

		$this->render('contactus');
	}
 

	

	public function kitchens()
	{


		$this->render('kitchens');
	}

    public function news_subscriptions()
    {
        if($this->input->post())
        {
            $this->load->model('newsletter_subscribes/Newsletter_subscribes_m','newsletter_subscribes');
            $data = $this->input->post();
            $data['contact_date'] = date('Y-m-d H:i:s');
            $validation_result = $this->newsletter_subscribes->validate($data, 'insert');
            if ($validation_result->success === FALSE) {
                $error='';
                foreach ($validation_result->errors as $key => $value)
                {
                    $error .=$value .' <br>' ;
                }
                $this->session->set_flashdata('error', $error);
                redirect();
            }
            else
            {
                $this->newsletter_subscribes->add($data);
                $subscribes_ok = lang('subscribes_ok');
                $this->session->set_flashdata('subscribes_ok',$subscribes_ok);
                redirect();
            }
        }

    }
 
 
	
 
	
 

 
	public function about($page = NULL)
	{
		$about = array("awards", "milestone", "mission", "vision", "us");
		if($page == NULL)
			show_404();
		if(!in_array($page , $about))
			show_404();
			if($page=="awards")
			{
				$id=45;
				$this->load->model('sections/sections_m','sm');
				$this->load->model('pages/pages_m','pm');
				$sections = $this->sm->get(['section_id'=>$id]);
				if(count($sections['results']) == 0)
					show_404();
				$section = $sections['results'][0];
				$pages = $this->pm->get(['pages.section_id'=>$id],1,100);

				$this->data['section'] = $section;
				$this->data['pages'] = $pages;
			}

		$this->render('about/'.$page);
	}
 

	
 

}
