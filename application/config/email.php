<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
      
	  
$config['site_title']  = "HijjazMall.com";       // Site Title, example.com
$config['admin_email'] = "info@hijjazmall.com"; // Admin Email, admin@example.com
     
 
$config['email_config'] = array(
	'mailtype' => 'html', 
	'protocol' => 'smtp',
  'smtp_host' => 'mail.das-360.net',
  'smtp_port' => '2345',
  'smtp_user' => 'test@das-360.net', // change it to yours
  'smtp_pass' => 'testtest', // change it to yours 
  'charset' => 'utf-8',
  'wordwrap' => TRUE
);

/*
 | -------------------------------------------------------------------------
 | Email templates.
 | -------------------------------------------------------------------------
 | Folder where email templates are stored.
 | Default: /email
 */
$config['email_templates'] = 'email/';
   
/*
 | -------------------------------------------------------------------------
 | Message Delimiters.
 | -------------------------------------------------------------------------
 */
$config['delimiters_source']       = 'config'; 	// "config" = use the settings defined here, "form_validation" = use the settings defined in CI's form validation library
$config['message_start_delimiter'] = '<p>'; 	// Message start delimiter
$config['message_end_delimiter']   = '</p>'; 	// Message end delimiter
$config['error_start_delimiter']   = '<p>';		// Error message start delimiter
$config['error_end_delimiter']     = '</p>';	// Error message end delimiter
 