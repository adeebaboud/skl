<?php


class Dashboard_m extends CI_Model{


    function get_workshops_count(){
        return $this->db->count_all_results('workshops');
    }

    function get_workshops_subscriptions_count(){
         return $this->db->count_all_results('workshop_subscriptions');
    }

    function get_orders_count_per_branch($filter=[])
    {
        $res = $this->db->select('branches.branch_id,branches.branch_name_en,branches.branch_name_ar,count(orders.order_id) as orders_count')
            ->from('branches')
            ->join('orders','orders.branch_id = branches.branch_id')
            ->where('YEAR(orders.order_date)','YEAR(NOW())',FALSE)
            ->where($filter)
			->where('orders.is_deleted',0)
            ->group_by('branches.branch_id')
            ->get()
            ->result();

        return $res;
    }

    function get_hourly_sales($filter=[])
    {
        $res = $this->db->select('DATE(created_date)   as tt, HOUR(created_date) as hour,SUM(order_total_value) as sum')
            ->from('orders')
            ->where('DATE(created_date) = DATE(NOW())',NULL,FALSE)
            ->where('order_status ','2')
            ->where($filter)
			->where('orders.is_deleted',0)
            ->group_by('HOUR(created_date)')
            ->get()->result();
        return $res;
    }

    function get_year_monthly_sales($filter=[])
    {
        $res = $this->db->select('MONTH(created_date) as month,SUM(order_total_value) as sum')
            ->from('orders')
            ->where('YEAR(created_date) = YEAR(NOW())',NULL,FALSE)
            ->where('order_status ','2')
			->where('orders.is_deleted',0)
            ->where($filter)
            ->group_by('MONTH(created_date)')
            ->get()->result();
        return $res;
    }

    function get_today_orders_count($filter =[])
    {
        $total = $this->db->select('order_id')->from('orders')->where('DATE(created_date) = DATE(NOW())',NULL,FALSE)->where('orders.is_deleted',0)->where($filter)->count_all_results();
        return $total;
    }

    function today_subscription_amount($filter =[])
    {
        $total = $this->db->select('SUM(workshop_subscriptions.price) as sum')->from('workshop_subscriptions')->where('DATE(date) = DATE(NOW())',NULL,FALSE)->where($filter)->get()->row();
        return is_null( $total->sum) ? 0 : $total->sum;
    }

    function get_top_products($filter=[],$limit = 10)
    {
        $res = $this->db->select('SUM(order_details.quantity) as total, products.product_id,products.product_name_ar,products.product_name_en')
            ->from('products')
            ->join('order_details','products.product_id = order_details.product_id')
            ->join('orders','order_details.order_id = orders.order_id')
            ->where($filter)
			->where('orders.is_deleted',0)
            ->group_by('products.product_name_en')
            ->order_by('total','DESC')
            ->limit($limit)
            ->get()
            ->result();

        return $res; 
    }

    function get_members_count($filter = []){
        // $this->db->count_all_results('users');
		return $this->db->select('users.id')->from('users')
		->join('users_groups','users_groups.user_id = users.id')
		->where('users.is_deleted',0)
		->where('users_groups.group_id',4)
		->where($filter)->count_all_results();
    }

    function get_orders_count_per_status($filter = []){
        $total = $this->db->select('count(order_id) as orders_count,order_status')
            ->from('orders')
            ->where('DATE(created_date) = DATE(NOW())',NULL,FALSE)
            ->where($filter)
			->where('orders.is_deleted',0)
        ->group_by('order_status')
            ->get()->result();
        return $total;
    }


}