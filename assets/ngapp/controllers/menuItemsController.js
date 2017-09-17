dasApp.controller('menuItemsController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
$scope.title="Menu Items";
 $scope.isLoading ={
        grid:true
    };
	$scope.msg="";
	$scope.err = false;
    $scope.gridOptions= {
        useExternalPagination: false,
       paginationPageSizes: [20, 50, 100],
        paginationPageSize: 50,
		enableRowSelection: false,
		enableRowHeaderSelection: false,
	   rowSelection: false,
	    multiSelect : false,
		enableGridMenu: true,
		enableSelectAll: true,
		exporterCsvFilename: 'menuItems.csv',
		exporterPdfDefaultStyle: {fontSize: 9},
		exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
		exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		exporterPdfHeader: { text: "menuItems", style: 'headerStyle' },
		exporterPdfFooter: function ( currentPage, pageCount ) {
		  return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		},
		exporterPdfCustomFormatter: function ( docDefinition ) {
		  docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
		  docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
		  return docDefinition;
		},
		exporterPdfOrientation: 'portrait',
		exporterPdfPageSize: 'LETTER',
		exporterPdfMaxGridWidth: 500,
		exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

        columnDefs : [
            {minWidth:120,field :'product_name' ,name: 'Product Name'},
            {width:120,field :'qty' ,name: 'Quantity'},
            {width:120,field :'total' ,name: 'Total'},
			
        ],
        data:[],
        onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
           
        }
    };
	
	var reportsManager = new entityManager(dasApp.apiBase + 'reports/menu_items','report_id',{data:'results'});
	$scope.isLoading.grid = true;
	function loadData(newPage,pageSize){
		$scope.isLoading.grid = true;
		reportsManager.loadAll(newPage,pageSize).then(function(data){
			angular.forEach(data,function(i,j){
				i.product_name = i.product_name_en  + ' | ' + i.product_name_ar;
			});
			 
			$scope.gridOptions.data = data;
			$scope.gridOptions.totalItems = data.length;
			$scope.isLoading.grid = false;
		});
	}
	
	loadData(1,1000); 
	
	 $scope.refreshGrid = function(){
		loadData(1,1000);  
    };
	
	$scope.branches = [];
    var branchesManager = new entityManager(dasApp.apiBase + 'branches/', 'branch_id', {data: 'results'});
    branchesManager.loadAll(1,100).then(function (data) {
        $scope.branches = data.results;
    });
	
	 $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
		 maxDate: new Date()
    };
	$scope.maxDate= new Date();
	$scope.maxDate2 = new Date();
    $scope.formats = [ 'yyyy-MM-dd'];
    $scope.format = $scope.formats[0];

    $scope.popup1 = {
        opened: false
    };
	 $scope.popup2 = {
        opened: false
    };
	
	 $scope.search = {
        branch : '',
        fromdate : '',
        todate : '',
    };

    $scope.showSearch = false;

	 $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            $scope.search = {
                branch : '',
				fromdate : '',
				todate : '',
            };
            $scope.doSearch();
        }
    };

	 $scope.doSearch = function(){
        window.xx = $scope.search;
        var searchFields = [];
       if($scope.search.branch && $scope.search.branch.trim()!='')
             searchFields.push( {
                 field: 'orders.branch_id',
                 value: $scope.search.branch,
                 op: 'eq'
             } );
			 
        if($scope.search.fromdate && $scope.search.fromdate !='')
			{
				$scope.minDate2 = $scope.search.fromdate;
				var d =  $scope.search.fromdate ;
				var formattedDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()  ;
				 searchFields.push( {
					 field: 'orders.order_date',
					 value: formattedDate,
					 op: 'gt'
				 }
				);
			
			}
		
			if($scope.search.todate && $scope.search.todate !='')
			{
				$scope.maxDate2= $scope.search.todate;
				var d =  $scope.search.todate ;
				var formattedDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()  ;
				 searchFields.push( {
					 field: 'orders.order_date',
					 value: formattedDate,
					 op: 'ls'
				 }
				);
			
			}
			
		 $scope.isLoading.grid = true;
        return reportsManager.search(searchFields).then(function(data){
			angular.forEach(data,function(i,j){
				i.product_name = i.product_name_en  + ' | ' + i.product_name_ar;
			});
            $scope.gridOptions.data = data;
            $scope.gridOptions.totalItems = data.length;
            $scope.isLoading.grid = false;
        });
    };

	$scope.checkClear = function ()
	 {
		 if($scope.search.todate == null || $scope.search.todate == '')
		{
				$scope.maxDate2= new Date();
		}
		if($scope.search.fromdate == null || $scope.search.fromdate == '')
		{
				$scope.minDate2= '';
		}
	 }

	
	 $scope.export = function(){
		  var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
		  $scope.gridApi.exporter.csvExport( 'all', 'visible', myElement );
		
	};
}]);
