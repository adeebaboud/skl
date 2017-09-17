dasApp.controller('dashboardController', ["$scope", "$http", "entityManager", "$timeout", function($scope, $http , entityManager,$timeout) {

	$scope.title="dashboard";
	$scope.todos = [];

	$scope.isLoading={
		lastOrders : true,
		stats : true
	};

	$scope.stats = {
		top_products: [],
		today_orders_count : 0,
		today_orders_total : 0,
		orders_per_branch : [],
		monthly_sales : [],
		products_count : 0,
		members_count:1
	};
	var order_stats = {
		0	: 	'pending',
		1	:	'ready',
		2	:	'delivered',
		3	: 	'canceled'
	};

	$scope.statusClass = {
		0	: 	'warning',
		1	:	'primary',
		2	:	'success',
		3	: 	'danger'
	};

	$scope.order_stats = order_stats;


	//TODOs
	var todosManager = new entityManager(dasApp.apiBase + '/todos/','todo_id');
	todosManager.loadAll().then(function(data){
		$scope.todos = data.results;
	},function(){});

	$scope.addTodo = function(){
		$scope.todos.push({
			is_done : 'no',
			$$isEdit : true,
			created_date : new Date()
		});
	};

	$scope.saveTodo = function(todoItem){
		if(todoItem.todo_id) {
			todosManager.update(todoItem, todoItem.todo_id).then(function () {
				todoItem.$$isEdit = false;
				$scope.todoErros = '';
				$scope.todoHasErros = false;
			}, function (err) {
				$scope.todoErros = err.errors;
				$scope.todoHasErros = true;
			});
		}else{
			todosManager.add(todoItem).then(function () {
				todoItem.$$isEdit = false;
				$scope.todoErros = '';
				$scope.todoHasErros = false;
			}, function (err) {
				$scope.todoErros = err.errors;
				$scope.todoHasErros = true;
			});
		}
	};

	$scope.editTodo = function(todoItem){
		todoItem.$$isEdit=true;
	};

	$scope.deleteTodo = function(todoItem){
		function removeTodo(toto){
			var indexTodo = $scope.todos.indexOf(toto);
			if(indexTodo >=0)
				$scope.todos.splice(indexTodo,1);
		}
		if(todoItem.todo_id)
			todosManager.delete(todoItem.todo_id).then(function(){
					removeTodo(todoItem);
				}
				,function(){
					removeTodo(todoItem);
				});
		else{
			removeTodo(todoItem);
		}
	};

	// last orders
	$scope.latestOrders = [];
	$scope.refreshLastOrders = function(){
		$scope.isLoading.lastOrders=true;
		var ordersManager = new entityManager(dasApp.apiBase + 'orders/','order_id',{data:'results'});
		ordersManager.loadAll(1,10).then(function(data){
			$scope.latestOrders = data.results;
			$scope.isLoading.lastOrders=false;
		});
	};
	$scope.refreshLastOrders();

	function zeroPad(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}

	//stats
	$scope.isLoading.stats = true;
	$http.get(dasApp.apiBase + '/dashboard/stats').then(function(res){
		$scope.stats = res.data;

		var chartData = [],donutData = [],graphData=[];
		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		var year = (new Date()).getFullYear();
		for(var i =0;i< $scope.stats.monthly_sales.length ;i++){
			var dataItem = $scope.stats.monthly_sales[i];
			chartData.push({
				y: year + '-' + parseInt(dataItem.month) , item1: dataItem.sum
			});
		}
		for(var j =0;j< $scope.stats.orders_per_branch.length ;j++){
			var dataItem = $scope.stats.orders_per_branch[j];
			donutData.push(
				{label:dataItem.branch_name_en  , value: dataItem.orders_count}
			 );
		}
		for(var k =0;k < $scope.stats.hourly_sales.length ;k++){
			var dataItem = $scope.stats.hourly_sales[k];
			graphData.push({
				y: dataItem.tt + ' ' +  zeroPad(parseInt(dataItem.hour),2)+":00" , Sales: dataItem.sum
			});
		}


		var orders_count_per_status = {};

		angular.forEach($scope.stats.orders_count_per_status,function(i,j){
			orders_count_per_status[order_stats[i.order_status]] = i.orders_count;
		});

		$scope.stats.orders_count_per_status = orders_count_per_status;



		init(chartData,donutData,graphData);
		$scope.isLoading.stats = false;
	},function(error){
		if(error.errors == 'UnAuthorized')
			$window.location.href= dasApp.baseUrl+'dashboard';	
	});


	function init(chartData,donutData,graphDate){
		var area = new Morris.Area({
			element: 'revenue-chart',
			resize: true,
			data: chartData,
			xkey: 'y',
			ykeys: ['item1'],
			labels: ['Item 1'],
			lineColors: ['#a0d0e0'],
			hideHover: 'auto'
		});
		var line = new Morris.Line({
			element: 'line-chart',
			resize: true,
			data: graphDate,
			xkey: 'y',
			xLabels:["hour"],
			postUnits:['SR'],
			ykeys: ['Sales'],
			labels: ['Sales'],
			lineColors: ['#efefef'],
			lineWidth: 2,
			hideHover: 'auto',
			gridTextColor: "#fff",
			gridStrokeWidth: 0.4,
			pointSize: 4,
			pointStrokeColors: ["#efefef"],
			gridLineColor: "#efefef",
			gridTextFamily: "Open Sans",
			gridTextSize: 10
		});
		function makeDonut(){
			var donut = new Morris.Donut({
				element: 'sales-chart',
				resize: true,
				colors: ["#D8354A","#FFFF00","#3c8dbc","#00A65A", "#f56954", "#00a65a"],
				data: donutData,
				hideHover: 'auto'
			});
		}

		$scope.redrawDonut = function(){
			$timeout(makeDonut,1000);
		};
	}


}]);


