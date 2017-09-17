<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Search extends DAS_Frontend {

	function __construct(){
		parent::__construct();
		$this->load->model('pages/pages_m','pp');
		$this->load->model('branches/branches_m','pm');
		$this->load->library('form_validation');
		$this->load->helper(array('form', 'url'));

	
	}
	 
	public function index()
	{
		
		$this->form_validation->set_rules('keyword', lang('search_keyword'), 'required|trim|min_length[3]');
		
		if ($this->form_validation->run() == FALSE)
		{
				$this->data['err_keyword'] = validation_errors(); 
				$this->data['keyword'] = '';
				$this->data['results'] = [];
				
		}
		else
		{			
			$keyword = trim($this->input->post('keyword'));
			$keyword = htmlspecialchars($keyword);
			
			if($keyword=='' && strlen($keyword)==0 )
			{
				$search = [];
			}
			else
			{
			
			$results = $this->db->like('pages.page_title_en',$keyword)->
			or_like('pages.page_title_ar',$keyword)->
			or_like('pages.page_description_en',$keyword)->
			or_like('pages.page_description_ar',$keyword)->
			or_like('pages.page_content_en',$keyword)->
			or_like('pages.page_content_ar',$keyword)->
			or_like('pages.page_subtitle_en',$keyword)->
			or_like('pages.page_subtitle_ar',$keyword)->
			from('pages')->get()->result();
			$search = [];
			
			foreach ($results as $res )
			{
				
				
				$temp = new StdClass();
				$temp->title_en = $res->page_title_en;
				$temp->title_ar = $res->page_title_ar;
				$temp->image_en = $res->page_image_en;
				$temp->image_ar = $res->page_image_en;
				$temp->id = $res->page_id;
				$temp->type = 'page';
				
				array_push($search,$temp);
				
				/* $search[] = [
					'title_en'	=> $res->page_title_en,
					'title_ar'	=> $res->page_title_ar,
					'image_en'	=> $res->page_image_en,
					'image_ar'	=> $res->page_image_ar,
					'id'	=> $res->page_id,
					'type'	=> 'page'
				 ];
				 */
			}
			
			}
			$this->data['keyword'] = $keyword;
			$this->data['results'] = $search;
			
		}
		$this->render('search_results');
	}
}
