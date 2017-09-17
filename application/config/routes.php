<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'home';

$route['(ar|en)/?'] = $route['default_controller'];
$route['(ar|en)/career'] = 'home/page/career';
$route['(ar|en)/careers'] = 'home/careers';
$route['(ar|en)/about-us'] = 'home/aboutus';
$route['(ar|en)/kitchens'] = 'home/kitchens';
$route['(ar|en)/contact-us'] = 'home/contactus';
$route['(ar|en)/page/(:any)'] = 'home/page/$2'; 
$route['(ar|en)/search'] = 'search';
$route['(ar|en)/malls'] = 'home/malls';
$route['(ar|en)/section/(:any)/(:num)'] = 'home/section/$2/$3'; 
$route['(ar|en)/section/(:any)'] = 'home/section/$2'; 

$route['(ar|en)/archive/(:any)/(:num)'] = 'home/archive/$2/$3'; 
$route['(ar|en)/archive/(:any)'] = 'home/archive/$2'; 
$route['(ar|en)/upcoming/(:any)/(:num)'] = 'home/upcoming/$2/$3'; 
$route['(ar|en)/upcoming/(:any)'] = 'home/upcoming/$2'; 

$route['(ar|en)/contactpart/(:any)'] = 'home/contactpart/$2';
$route['(ar|en)/branchinfo/(:any)'] = 'home/branchinfo/$2';
$route['(ar|en)/about/(:any)'] = 'home/about/$2';
$route['(ar|en)/kitchens/(:any)'] = 'home/kitchens/$2';

//$route['(ar|en)/image_gallery/(:any)/(:num)'] = 'home/image_gallery/$2/$3';
$route['(ar|en)/image_gallery/(:any)'] = 'image_gallery/index/$2';

//$route['(ar|en)/image_gallery'] = 'home/image_gallery';
$route['(ar|en)/shops/(:any)'] = 'shops/index/$2';

$route['(ar|en)/video_gallery/(:any)/(:num)'] = 'home/video_gallery/$2/$3';
$route['(ar|en)/video_gallery/(:any)'] = 'home/video_gallery/$2';
$route['(ar|en)/video_gallery'] = 'home/video_gallery';

$route['(ar|en)/leasing'] = 'home/leasing'; 

$route['(ar|en)/blog_entry/(:any)'] = 'home/blog_entry/$2'; 


$route['(ar|en)/(.+)'] = '$2';

$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
