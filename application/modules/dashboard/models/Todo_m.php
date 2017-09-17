<?php

/**
 * Created by PhpStorm.
 * User: DasGraphics
 * Date: 2/18/2016
 * Time: 2:00 PM
 */
class Todo_m extends DAS_Model{

    function __construct()
    {
        parent::__construct();

        $this->table = 'todos';
        $this->primary_column = 'todo_id';

        $this->columns = ['todo_id','content','created_date','is_done','user_id' ];

        $this->joins = [
            'users'	=>	'users.id = todos.user_id'
        ];

        $this->select_columns = ["todos.*" , "CONCAT_WS(' ', users.first_name, users.last_name) AS created_by_name"];

        $this->validation_rules = [
            'todo_id'    =>	[ 'Todo Id','trim|integer'] ,
            'content'    =>	[ 'Todo text','trim|required|min_length[3]'] ,
            'is_done'    =>	[ 'Is Done','trim']
        ];
    }

}