<?php
/**
 * A base model with a series of CRUD functions (powered by CI's query builder),
 * validation-in-model support, event callbacks and more.
 *
 * @link http://github.com/jamierumbelow/codeigniter-base-model
 * @copyright Copyright (c) 2012, Jamie Rumbelow <http://jamierumbelow.net>
 */

class DAS_Model extends CI_Model
{

	/**
	 * @var array
     */
	protected $columns = array();
	/**
	 * @var array
     */
	protected $joins = array();
	/**
	 * @var array
     */
	protected $select_columns = array();

	/**
	 * @var array
	 */
	protected $override_select_columns = array();
	/**
	 * @var string
     */
	protected $table = '';
	/**
	 * @var string
     */
	protected $primary_column  = 'id';
	/**
	 * @var string
     */
	protected $order_by = '';
	/**
	 * @var string
     */
	protected $order_dir = 'DESC'; 

	protected $enable_cache = TRUE;

	/**
	 * @var array Validation rules of the entity
	 */
	protected $validation_rules = [];
	
	/**
	 * @var array Validation rules of the entity when inserting
	 */
	protected $insert_validation_rules = [];
	
	/**
	 * @var array Validation rules of the entity when updating
	 */
	protected $update_validation_rules = [];
	
	/**
	 * DAS_Model constructor.
     */
	public function __construct()
    {
        parent::__construct();
		$this->load->database();
	}


	/**
	 * Get entities
	 * @param array $filter
	 * @param int $page
	 * @param int $items_count
	 * @return array
     */
	public function get($filter=[], $page=1, $items_count=10 )
	{
		if($this->enable_cache)
			$this->start_cache();
		if(intval($page)<=0)
			$page = 1;
		if(intval($items_count)<=0)
			$items_count = 10;


		$columns_to_select = is_array($this->select_columns)? implode(', ',$this->select_columns) : $this->select_columns;

		$this->db->select($columns_to_select) 
			 ->order_by(empty($this->order_by) ? ("{$this->table}.{$this->primary_column}") : $this->order_by, $this->order_dir)
			 ->from($this->table) ;
		foreach($filter as $key => $val){
			if(is_array($val)){
				switch($val[0]){
					case 'in':
						$this->db->where_in($key,$val[1]);
						break;
					default:
						break;
				}
			}else{
				$this->db->where($key,$val);
			}
		}
		//define joins
		foreach($this->joins as $join_table => $join_expr){
			if(is_array($join_expr)){
				$this->db->join($join_table,$join_expr[0],$join_expr[1]);
			}
			else
				$this->db->join($join_table,$join_expr);
		}

		//sorting
		if(in_array($this->order_by,$this->columns))
			$this->db->order_by($this->order_by,$this->order_dir);

		$query_str = $this->db->get_compiled_select('',FALSE);
	 

		$res = $this->db->limit( $items_count,($page -1) * $items_count)->get()->result();


		$total = $this->db->query('select count(*) t from (' . $query_str . ' ) as tt')->row()->t;

		$pages_count = (int)( $total ) / $items_count ;

		$response = [
			'results' => $res,
			'page' => $page,
			'pages_count' => ceil( $pages_count),
			'total' =>(int) $total
		];
		$response = $this->on_after_get($response);
		if($this->enable_cache)
			$this->end_cache();
		return $response;
	}

	public function first($filter = []){
		$res = $this->get($filter,1,1);
		if(count($res['results']) > 0 )
			return $res['results'][0];
		
		return null;
	}

	/**
	 * @param $id
	 * @return null
     */
	public function single($id){
		$filter = [];
		$filter[$this->table . '.' . $this->primary_column] = $id;
		$result = $this->get($filter,1,1);

		return $result['total'] == 1 ? $result['results'][0] : NULL;
	}


	/**
	 * Add Entity
	 * @param $entity
	 * @return array
     */
	public function add($entity){
		$entity = $this->on_before_add($entity);
		$filtered_entity = [];
		foreach($entity as $key => $val){
			if(in_array($key,$this->columns))
				$filtered_entity[$key] = $val;
		}

		if(in_array('created_date',$this->columns) && !array_key_exists('created_date',$entity) )
			$filtered_entity['created_date'] = date('Y-m-d H:i:s');

		$filtered_entity = $this->on_add($filtered_entity,$entity);

		if(!$this->db->insert($this->table, $filtered_entity))
			return FALSE;

		$insert_id = $this->db->insert_id();
		$filtered_entity[$this->primary_column] = $insert_id;

		$this->on_after_add($filtered_entity,$insert_id,$entity);


		$res = $this->single($insert_id);
		if($this->enable_cache){
			$this->db->cache_delete_all();
		}
		return  $res;
	}

	/**
	 * Update Entity
	 * @param $entity
	 * @param $id
	 */
	public function update($entity,$id){
		$entity = $this->on_before_update($entity,$id);
		$filtered_entity = [];
		foreach($entity as $key => $val){
			if(in_array($key,$this->columns))
				$filtered_entity[$key] = $val;
		}

		if(in_array('modified_date',$this->columns) && array_key_exists('modified_date',$entity))
			$filtered_entity['modified_date'] = date('Y-m-d H:i:s');

		$filtered_entity = $this->on_update($filtered_entity,$entity);
		if(!$this->db->where($this->primary_column,$id)->update($this->table, $filtered_entity))
			return FALSE;


		$this->on_after_update($filtered_entity,$id,$entity);

		if($this->enable_cache){
			$this->db->cache_delete_all();
		}
		return  TRUE;
	}

	/**
	 * delete entity by id
	 * @param $id
	 * @return mixed
	 */
	public function delete($id){
		$this->on_delete($id);
		if($this->enable_cache){
			$this->db->cache_delete_all();
		}
		return $this->db->where($this->primary_column,(int)$id)->delete($this->table);
	}
	
	public function soft_delete($id)
	{
		$this->on_delete($id);
		$deleted['is_deleted'] = 1;
		if($this->enable_cache){
			$this->db->cache_delete_all();
		}
		$this->db->where($this->primary_column,(int)$id)->update($this->table,$deleted);
		
	}

	/**
	 * Validate Entity against defined validation rules
	 * @param $entity
	 * @return array [  success : bool (result of validation)
	 * 					errors : array of errors if any ]
	 */
	public function validate($entity,$operation = 'any'){
		$this->load->library('form_validation');


		$this->form_validation->set_data($entity);

		foreach($this->validation_rules as $column => $rule){
			$this->form_validation->set_rules($column,$rule[0],$rule[1]);
		}

		if($operation == 'insert')
			foreach($this->insert_validation_rules as $column => $rule){
				$this->form_validation->set_rules($column,$rule[0],$rule[1]);
			}
			
		if($operation == 'update')
			foreach($this->update_validation_rules as $column => $rule){
				$this->form_validation->set_rules($column,$rule[0],$rule[1]);
			}
		
		$validation_result = $this->form_validation->run();
		$result  = new stdClass();
		$result->success	=  	$validation_result;
		$result->errors = $this->form_validation->error_array();

		return $result;
	}

	protected function start_cache(){

	}

	protected function end_cache(){

	}

	//Events

	/**
	 * @param $original_entity
	 * @return mixed
     */
	protected function on_before_add($original_entity)
	{
		return $original_entity;
	}


	/**
	 * @param $to_be_inserted_entity
	 * @param $original_entity
	 * @return mixed
     */
	protected function on_add($to_be_inserted_entity, $original_entity)
	{
		return $to_be_inserted_entity;
	}

	/**
	 * @param $inserted_entity
	 * @param $id
	 * @param $original_entity
     */
	protected function on_after_add($inserted_entity, $id, $original_entity)
	{
		return  ;
	}


	/**
	 * @param $original_entity
	 * @return mixed
     */
	protected function on_before_update($original_entity,$id)
	{
		return $original_entity;
	}


	/**
	 * @param $to_be_updated_entity
	 * @param $original_entity
	 * @return mixed
     */
	protected function on_update($to_be_updated_entity, $original_entity)
	{
		return $to_be_updated_entity;
	}

	/**
	 * @param $updated_entity
	 * @param $id
	 * @param $original_entity
     */
	protected function on_after_update($updated_entity, $id, $original_entity)
	{
		return  ;
	}


	/**
	 * @param $id
	 */
	protected function on_delete($id){
		return;
	}

	/**
	 * @param $result
	 */
	protected function on_after_get($result){
		return $result;
	}


	/**
	 * @param $rule
	 * @param string $op
	 * @return $this
	 */
	public function filter($rule,$op = 'and'){
		if(strtolower($op) == 'or')
			$this->db->or_where($rule);
		else
			$this->db->where($rule);

		return $this;
	}

	/**
	 * Check if the model has the specified column
	 * @param $column
	 * @return bool
	 */
	public function has_column($column){
		$table = $this->table;
		if(strpos($column,'.') > 0)
		{
			$column = explode('.',$column);
			$table = $column[0];
			$column = $column[1];
		}
		return $table == $this->table && in_array($column,$this->columns) ;
	}

	public function can_filter_column($column)
	{
		return ($this->has_column($column) || in_array($column,$this->select_columns));
	}
}
