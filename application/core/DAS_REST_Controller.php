<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';


class DAS_REST_Controller extends REST_Controller {

    /**
     * @var DAS_Model
     */

    const GET_SUCCESS_RESPONSE = 1;
    const GET_SINGLE_SUCCESS_RESPONSE = 20;
    const UPDATE_SUCCESS_RESPONSE = 30;
    const INSERT_SUCCESS_RESPONSE = 40;
    const DELETE_SUCCESS_RESPONSE = 50;

    const PAGINATION_PAGE_NUMBER = 'page_number';
    const PAGINATION_PAGE_SIZE = 'page_size';

    protected $filter = [];

    //logged in user info
    protected $user_id = -1;
    protected $user = null;
    protected $user_groups = [];
    protected $is_user_admin = false;
    protected $is_logged_in = false;
    protected $is_cashier = false;
    protected $is_branch_manager = false;
    protected $is_member = false;


    protected $enable_pagination = true;

    function __construct($model)
    {
        // Construct the parent class
        parent::__construct();

        $this->load->database();


        $this->load->model($model,'model');
        $this->load->library('ion_auth');

       $this->init_user();
    }


    private function init_user(){
        if( $this->ion_auth->logged_in()) {
            $this->user = $this->ion_auth->user()->row();
            $this->user_id = $this->user->id;
            $this->user_groups = $this->ion_auth->get_users_groups()->result();
            $this->is_user_admin = $this->ion_auth->is_admin();
            $this->is_logged_in = true;

            //check if cashier or branch manager
            $this->is_cashier = $this->ion_auth->in_group('Cashier');
            $this->is_branch_manager = $this->ion_auth->in_group('Branch Manager');
            $this->is_member = $this->ion_auth->in_group('members');
        }else{

        }
    }


    public function index_get()
    {
        if(!$this->can_read( )){
            $this->response(['success'=>FALSE,'errors'=>'UnAuthorized'],400);
            exit();
        }
        if($this->get('id') != NULL)
        {
            $id = $this->get('id');
            $this->single($id);
        }
        else
        {

            $this->filter = [];
			$hasGroup = false;
            if($this->get('filter')) { 
               $filter_raw = JSON_decode($this->get('filter')); 
			   
                foreach ($filter_raw as $filter_item) {
                    if (!$this->model->can_filter_column($filter_item->field)) {
                        $this->response(['success' => FALSE, 'error' => 'Unknown column ' . $filter_item->field], 400);
                        die();
                    }
                    if (!$this->model->can_filter_column($filter_item->field)) {
                        $this->response(['success' => FALSE, 'error' => 'Unknown column ' . $filter_item->field], 400);
                        die();
                    }
                    if (strtolower($filter_item->op) == 'like') { 
						if(!$hasGroup){
							$this->db->group_start(); 
							$hasGroup = true; 
						}
                        $this->db->like($filter_item->field, $filter_item->value);
                    } elseif (strtolower($filter_item->op) == 'orlike') { 
						if(!$hasGroup){
							$this->db->group_start(); 
							$hasGroup = true; 
						}
                        $this->db->or_like($filter_item->field, $filter_item->value);
                    } elseif (strtolower($filter_item->op) == 'date') {
                        $this->filter['DATE(' . $filter_item->field . ')']= $filter_item->value ;
                    } elseif (strtolower($filter_item->op) == 'noteq') {
                        $this->filter[$filter_item->field . '!='] = $filter_item->value;
					} elseif (strtolower($filter_item->op) == 'gt') {
                        $this->filter[$filter_item->field . '>='] = $filter_item->value;
                    }elseif (strtolower($filter_item->op) == 'ls') {
                        $this->filter[$filter_item->field . '<='] = $filter_item->value;
                    } else
                        $this->filter[$filter_item->field] = $filter_item->value;
                }
				if($hasGroup)
					$this->db->group_end(); 
            }


            $this->on_before_get();

            $page= $this->enable_pagination ? $this->get(DAS_REST_Controller::PAGINATION_PAGE_NUMBER) : 1;
            $items_count = $this->enable_pagination ? $this->get(DAS_REST_Controller::PAGINATION_PAGE_SIZE) : MAX;

            $data = $this->model->get($this->filter,$page,$items_count);
            if($data !=NULL)
            {
                $data['success'] = true;
                $data = $this->on_before_response($data,DAS_REST_Controller::GET_SUCCESS_RESPONSE);
                if(array_key_exists('results',$data))
                    for($i=0;$i<count($data['results']);$i++)
                        $data['results'][$i] = $this->map_to_json($data['results'][$i]);
                $this->response($data,200);
            }
            else
            {
                $this->response(['success'=>FALSE],400);
            }
        }
    }


    protected function single($id)
    {
        $item = $this->model->single($id);
        if(is_null($item)){
            $item = $this->on_before_response($item,DAS_REST_Controller::GET_SINGLE_SUCCESS_RESPONSE);
            $this->response( ['success'=>FALSE, 'errors'=>'Item Not Found'],400);
        }
        else
            $this->response($this->map_to_json($item),200);

    }


    public function index_post()
    {
        $data = $this->post();
        $data = $this->map_from_json($data);
        $validation_result  = $this->model->validate($data,'insert');
        if($validation_result->success === FALSE)
        {
            $this->response([
                'success'=> FALSE,
                'errors'=> $validation_result->errors
            ],400);
        }
        else
        {
            $data['created_by'] = $this->user_id;
            $data = $this->on_before_add($data);
            $data = $this->model->add($data);
            if($data)
            {
                $data = $this->on_before_response($data,DAS_REST_Controller::INSERT_SUCCESS_RESPONSE);
                $data = $this->map_to_json($data);
                $this->response( [
                    'success' => TRUE,
                    'data'	=> $data
                ],200);
            }
            else
            {
                $this->response([
                    'success'=>FALSE,
                    'errors'=> 'Failed To Insert'
                ],400);
            }
        }

    }


    public function update_post($id=NULL)
    {
        if(!$this->can_edit()){
            $this->response(['success'=>FALSE,'errors'=>'UnAuthorized'],400);
            exit();
        }
        $original_data =$this->model->single($id);
        if($original_data == NULL)
            $this->response(['success'=>FALSE,'errors'=>'Item Not Found'],400);
        else
        {
            if($this->post()) {
                $data = $this->post();
                $data = $this->map_from_json($data);
                $validation_result = $this->model->validate($data,'update');

                if ($validation_result->success === FALSE) {
                    $this->response([
                        'success' => FALSE,
                        'errors' => $validation_result->errors
                    ], 400);
                } else {
                    $data['modified_by'] = $this->user_id;
                    $data = $this->on_before_update($data,$original_data,$id);
                    $data = $this->model->update($data, $id);
                    if ($data) {
                        $data = $this->on_before_response($data,DAS_REST_Controller::UPDATE_SUCCESS_RESPONSE);
                        $this->response([
                            'success' => TRUE,
                            'data' => $data
                        ], 200);
                    } else {
                        $this->response([
                            'success' => FALSE,
                            'errors' => 'Failed To Update'
                        ], 400);
                    }
                }
            }
        }
    }

	public function soft_delete_get()
    {
        if(!$this->can_delete()){
            $this->response(['success'=>FALSE,'errors'=>'UnAuthorized'],400);
            exit();
        }
        $id = $this->query('id');

        $original_data =$this->model->single($id);
        if($original_data == NULL)
            $this->response(['success'=>FALSE,'errors'=>'Item Not Found'],400);
        else{
            $this->on_before_delete($original_data,$id);
            $this->response([
                'success'=>$this->model->soft_delete($id),
                'errors'=>'Deleted Successfully'],200);
        }
    }
    public function delete_get()
    {
        if(!$this->can_delete()){
            $this->response(['success'=>FALSE,'errors'=>'UnAuthorized'],400);
            exit();
        }
        $id = $this->query('id');

        $original_data =$this->model->single($id);
        if($original_data == NULL)
            $this->response(['success'=>FALSE,'errors'=>'Item Not Found'],400);
        else{
            $this->on_before_delete($original_data,$id);
            $this->response([
                'success'=>$this->model->delete($id),
                'errors'=>'Deleted Successfully'],200);
        }
    }

    protected function map_to_json($model){
        return $model;
    }

    protected function map_from_json($json_obj){
        return $json_obj;
    }

    protected function on_before_add($data){
        return $data;
    }

    protected function on_before_update($data,$original_data,$id){
        return $data;
    }

    protected function on_before_response($data ,$operation){
        return $data;
    }

    protected function on_before_get(){
        return;
    }

    protected function on_before_delete($original_data,$id){
        return;
    }




    //Authorization callbacks, should be overridden in child classes and return true or false

    //public read
    protected function can_read(){
        return $this->is_logged_in;
    }

    //only admin can add
    protected function can_add(){
        return $this->is_user_admin;
    }

    protected function can_edit(){
        return $this->is_user_admin;
    }

    protected function can_delete(){
        return $this->is_user_admin;
    }


}
