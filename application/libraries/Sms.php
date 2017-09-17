<?php
/*
 *
 * @package SMS (SMS sender)
 * @copyright (c) 2016 Das-360
 * info: library for sending SMS messages using Infobip provider 
 *
 */

class Sms {
	protected $authEncoded = '';
	protected $apiSendAddress = ''; 
	protected $apiUser = ''; 
	protected $apiPass = ''; 
	protected $recepients = array();
	protected $message = '';
	protected $title = '';
	protected $from = '';
    protected $payload = array();


	public $status = array();
	public $messagesStatuses = array();
	public $responseData = null;
	public $responseInfo = null;


	protected $errorStatuses = array(
		 //TODO:
	);

	/**
	 * Constructor
	 */
	public function __construct() {

		$ci =& get_instance();
		$ci->load->config('sms',true);
        $this->payload['to']= array();

		$this->from = $ci->config->item('sms_from','sms');
		$this->apiUser = $ci->config->item('sms_user','sms');
		$this->apiPass = $ci->config->item('sms_pass','sms');
		$this->apiSendAddress = $ci->config->item('sms_api_send_address','sms');

		if (!$this->apiUser) {
			show_error('SMS: Needed API Key');
		}

		if (!$this->apiPass) {
			show_error('SMS: Needed API Send Address');
		}
		
		$this->authEncoded = base64_encode($this->apiUser . ":" . $this->apiPass);
	}


	

	/**
	 * Setting SMS message
	 *
	 * @param <string> $message
	 */
	public function setMessage($message = '', $from = '')
    {
        if(!empty($from))
        {
            $this->$from = $from;
            $this->payload['from'] = $from;
        }
		$this->message = $message;
		$this->payload['text'] = $message;
	}
	    

	/**
	 * Adding one recepient
	 *
	 * @param <string> $group
	 */
	public function addRecepient($phoneNumber) {

		$this->payload['to'][] = $phoneNumber;
	}


	/**
	 * Setting all recepients
	 *
	 * @param <string> $group
	 */
	public function setRecepients($phoneNumber) {

		$this->payload['to'] = $phoneNumber;
	}


	/**
	 * Clearing group of messages
	 */
	public function clearRecepients() {

		$this->payload['to'] = array();
	}


	/**
	 * Senging messages to Google Cloud Messaging
	 *
	 * @param <string> $group
	 */
	public function send()
	{
		$this->payload['from'] = $this->from;
		$this->payload['to'] = array_unique($this->payload['to']);
		sort($this->payload['to']);
  
		$data = json_encode($this->payload);
		return $this->request($data);
	}

	protected function request($data)
	{

		$headers[] = 'Content-Type:application/json';
		$headers[] = 'Authorization: Basic '.$this->authEncoded;

		$curl = curl_init();

		curl_setopt($curl, CURLOPT_URL, $this->apiSendAddress);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($curl, CURLOPT_FOLLOWLOCATION, false);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_HEADER, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

		$this->responseData = curl_exec($curl);

		$this->responseInfo = curl_getinfo($curl);

		curl_close($curl);

		//var_dump($this->responseInfo);

		return $this->parseResponse();
	}


	protected function parseResponse()
	{
		if ($this->responseInfo['http_code'] == 200)
		{ 
			$response = explode("\n",$this->responseData);
			$responseBody = json_decode($response[count($response)-1]);  
			//var_dump($responseBody);
			if (count($responseBody->messages) >0 && $responseBody->messages[0]->status)
			{
				$message = $responseBody->messages[0]->status->description;
				$error = $responseBody->messages[0]->status->name=='MESSAGE_ACCEPTED';
			}
			else 
			{
				$message = 'Error';
				$error = 1;
			} 

			$this->status = array(
				'error' => $error,
				'message' => $message
			);

			return !$error;
		}
		elseif ($this->responseInfo['http_code'] == 400)
		{
			$this->status = array(
				'error' => 1,
				'message' => 'Request could not be parsed as JSON'
			);
			return false;
		}
		elseif ($this->responseInfo['http_code'] == 401)
		{
			$this->status = array(
				'error' => 1,
				'message' => 'There was an error authenticating the sender account'
			);
			return false;
		}
		elseif ($this->responseInfo['http_code'] == 500)
		{
			$this->status = array(
				'error' => 1,
				'message' => 'There was an internal error in the SMS server while trying to process the request'
			);
			return false;
		}
		elseif ($this->responseInfo['http_code'] == 503)
		{
			$this->status = array(
				'error' => 1,
				'message' => 'Server is temporarily unavailable'
			);
			return false;
		}
		else
		{
			$this->status = array(
				'error' => 1,
				'message' => 'Status undefined'
			);
			return false;
		}
	}

}
