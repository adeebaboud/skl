<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/core/DAS_REST_Controller.php';


class Dashboard extends DAS_REST_Controller{

    function __construct()
    {
        // Construct the parent class
        parent::__construct('dashboard/dashboard_m','dm');
        $this->model = new Dashboard_m();
		
       
    }

    function stats_get(){
		$this->load->library('ion_auth');
		$user = $this->ion_auth->user()->row();
         
        $this->response([
                'orders_per_branch' => $this->model->get_orders_count_per_branch($this->is_cashier || $this->is_branch_manager? ['orders.branch_id'=>$user->branch_id]: [] ),
                'today_orders_count' => $this->model->get_today_orders_count($this->is_cashier || $this->is_branch_manager? ['orders.branch_id'=>$user->branch_id]: []),
                'today_subscription_amount' => $this->model->today_subscription_amount(),
                'top_products' => $this->model->get_top_products($this->is_cashier || $this->is_branch_manager? ['orders.branch_id'=>$user->branch_id]: []),
                'monthly_sales' => $this->model->get_year_monthly_sales($this->is_cashier || $this->is_branch_manager? ['orders.branch_id'=>$user->branch_id]: []),
                'hourly_sales' => $this->model->get_hourly_sales($this->is_cashier || $this->is_branch_manager? ['orders.branch_id'=>$user->branch_id]: []),
                'workshops_count' => $this->model->get_workshops_count(),
                'subscriptions_count'   =>  $this->model->get_workshops_subscriptions_count(),
                'members_count' => $this->model->get_members_count(),
                'orders_count_per_status'    => $this->model->get_orders_count_per_status($this->is_cashier || $this->is_branch_manager? ['orders.branch_id'=>$user->branch_id]: [])
        ]);
    }
}