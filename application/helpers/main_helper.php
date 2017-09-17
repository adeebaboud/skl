<?php


function loc($class,$property = '',$encodehtml = TRUE ){
	$CI = &get_instance();
	
	$lang = $CI->lang->lang;
	$out = ($class->{$property . '_' . $lang});
	return  $encodehtml ? htmlspecialchars($out) : $out;
	
}

function thumb($url=''){
	return  str_replace('uploads/','thumbs/',$url);
}

function lang($word = ''){
	$CI = &get_instance();
	if(empty($word))
		return $CI->lang->lang;
	 
	return $CI->lang->line($word) ? $CI->lang->line($word) : $word;
}
function enar($en = '',$ar = ''){
	$CI = &get_instance();	
	return $CI->lang->lang=='en'?$en:$ar;		
}
 
function get_first($str = '',$del='',$limit=1){
	$res=explode($del, $str ,$limit+1);
	
	if(count( $res )>1 )
	{
		 array_pop($res);
	
	}
	$res=implode( $del, $res) ;
	return $res;
}
 
 
 function slugify($str = ''){
	 //remove symbols (non-words)
	$str = preg_replace('/\W/', ' ', $str);
	//remove multiple spaces
	$str = preg_replace('/\s\s+/', ' ', $str);
	
	return strtolower( str_replace(' ','-', $str));
 }
 
 function slider($slider_name)
 {
	$CI = &get_instance();
	$CI->load->model('sliders/sliders_m','sliders_m');
	$slider = $CI->sliders_m->get(['slider_name'=>$slider_name]);
	return count( $slider["results"]) > 0 ? $slider["results"][0] : NULL; 
 }
 
 function menu($menu_id)
 {
	$CI = &get_instance();
	$CI->load->model('menu/menu_m' );
	$menu = $CI->menu_m->first(['menu_name_en'=>$menu_id]);
	if(is_null($menu)){
		$menu = $CI->menu_m->first(['menu_id'=>$menu_id]);
	}
	return $menu;
 }
 
 function section($slug)
 {
	$CI = &get_instance();
	$CI->load->model('sections/sections_m');
	$CI->load->model('pages/pages_m');
	$filter = is_numeric($slug) ? 'sections.section_id' : 'section_slug';
	$section = $CI->sections_m->get(["$filter"=>$slug]);
	if(count($section['results'])==0)
		return null;
	
	$section = $section["results"][0]; 
	$section->pages = $CI->pages_m->get(['pages.section_id'=>$section->section_id])['results'];
	return $section; 
 }
 
 function is_url($url ='', $return = 'active')
 {
	$CI = &get_instance();
	$cr_url = str_replace(lang() .'/','',$CI->router->uri->uri_string);
	 $reg = "/".$url ."/i";
	preg_match($reg,$cr_url,$matches,PREG_OFFSET_CAPTURE);
	
	if(count($matches)>0 ) 
		return $return;
	
	
	return '' ;
 }
 
 function theme_data($key,$data='',$is_push = FALSE){
	 $CI = &get_instance();  
	 if(!empty($data)){
		if($is_push)
		{
			if(empty($CI->load->publics_vars[$key]))
				$CI->load->publics_vars[$key] = [];
			$CI->load->publics_vars[$key][]=$data;  
		}
		else
			$CI->load->publics_vars[$key]=$data; 
	 }
	else
		return empty($CI->load->publics_vars[$key]) ? '' : $CI->load->publics_vars[$key];
	 
 }
 function ob_handler2($string ){
	$CI = &get_instance(); 
	$level_info = array_pop($CI->load->publics_vars['output_level']);
	 
	
	theme_data($level_info['key'] ,$string,$level_info['is_push'] );
 }
 function begin_theme_data($key,$is_push=FALSE){
	 ob_start( );
	 $CI = &get_instance();  
	 if(empty($CI->load->publics_vars['output_level']))
		$CI->load->publics_vars['output_level'] = [];
	array_push($CI->load->publics_vars['output_level'],['key'=>$key, 'is_push'=>$is_push]);
	 
 }
 
 function end_theme_data(){ 
  
	ob_handler2(ob_get_clean());
	//ob_end_flush();
 }

 function page_url($page){
	 if(is_object($page))
		 $url = (empty($page->page_slug) ? $page->page_id : $page->page_slug);
	 else
		 $url = $page;
	 return site_url('page/' . $url );
 } 
 
 function section_url($section){
	 if(is_object($section))
		 $url = (empty($section->section_slug) ? $section->section_id : $section->section_slug);
	 else
		 $url = $section;
	 return site_url('section/' . $url );
 } 
 
 function menu_link($menu_item){
	if($menu_item->link_type == 'section')
		return section_url($menu_item->link_value);		
	else if($menu_item->link_type == 'page')
		return page_url($menu_item->link_value);
	else
		return site_url($menu_item->link_value);
 }
 
 function das_filter($arr,$filter){
	 $out = [];
	 foreach($arr as $key=>$val){
		 $pass =	true;
		 foreach($filter as $fkey =>$fval)
			if($val->{$fkey} != $fval)
				$pass = false;
		if($pass)
			$out[] = $val;
	 }
	 return $out;
 } 

function ArabicMonth($name) {
    $months = array("Jan" => "يناير", "Feb" => "فبراير", "Mar" => "مارس", "Apr" => "أبريل", "May" => "مايو", "Jun" => "يونيو", "Jul" => "يوليو", "Aug" => "أغسطس", "Sep" => "سبتمبر", "Oct" => "أكتوبر", "Nov" => "نوفمبر", "Dec" => "ديسمبر");
     return $months[$name];
}

function e($text){
	return htmlspecialchars($text);
}

function menu_link_active($menu_link){
	$url = menu_link($menu_link);
	$CI = &get_instance();
	$currentUrl = base_url() . $CI->router->uri->uri_string ;
	 if($currentUrl ==  $url)
	 	return 'active';
	return '';
}