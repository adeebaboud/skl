<?php
 

class ShoppingCart {
	public $items = [];
	
	function __construct($data=null){
		
	}
	
	public function items(){
		
	}
	
	public function total(){
		$sum = 0;
		foreach ($this->items as $item)
			$sum += $item->product_price * $item->quantity;
		return $sum;
	}
}
