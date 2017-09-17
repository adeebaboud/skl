<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Attributes_model extends DAS_Model
{
	
	function __construct()
	{
		parent::__construct();
		
		$this->table = 'attributes';
		$this->primary_column = 'attribute_id';

		$this->columns = ['attribute_id', 'label_en','label_ar', 'type', 'name','sort'	];

		$this->joins = [];

		$this->select_columns = ["attributes.*"];

		$this->validation_rules = [
			'attribute_id'    =>	[ 'Attribute Id','trim|integer'] ,
			'label_en'    =>	[ 'Label En','trim|required'] ,
			'label_ar'    =>	[ 'Label Ar','trim|required'] ,
			'type'    =>	[ 'Type','trim|required'] ,
			'name'    =>	[ 'Name','trim|required'] , 
			'sort'    =>	[ 'Sort','integer|trim'] 
		];
	
	}
	
}
