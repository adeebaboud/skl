dasApp.controller('categoriesController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Categories";

    $scope.isLoading ={
        grid:true
    };
	$scope.msg="";
	$scope.err = false;

    $scope.gridOptions= {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [

            {field :'category_name_en' ,name: 'Name En'},
            {field :'category_name_ar' ,name: 'Name Ar'},
            { field :'category_description_en' ,name: 'Description En'},
            {field :'category_description_ar' ,name: 'Description Ar'},
            {
                
                pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div>' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Category" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Category" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                $scope.isLoading.grid = true;
                categoriesManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                    $scope.isLoading.grid = false;
                });

            });

        }
    };

    $scope.isLoading.grid = true;
    var categoriesManager = new entityManager(dasApp.apiBase + 'categories/','category_id',{data:'results'});
    categoriesManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
        $scope.isLoading.grid = false;
    });


    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
		$scope.category = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/categories/form.html',
            controller: 'addCategoryController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + 'Category',
                    isEdit: isEdit ? true : false,
                },
                categoriesManager : categoriesManager,
                    category: isEdit ? entity : {}
            }
        });

        modalInstance.result.then(function (product) {
            if(!isEdit)
                $scope.gridOptions.data.push(product);
        }, function () {
			delete_copy($scope.category);
       

        });
    };


    $scope.delete = function (category) {
        $scope.category  = category;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        category = $scope.category;
        categoriesManager.delete(category.category_id) .then(function(response){
			console.log(response.data.success);
			if(response.data.success == false)
			{
				$scope.err = true;
				$scope.msg = response.data.msg;

			}
			else
			{
				var index = $scope.gridOptions.data.indexOf(category);
				$scope.gridOptions.data.splice(index, 1);
				$scope.gridOptions.totalItems = $scope.gridOptions.totalItems-1;
				$scope.modalInstance.close();
			}
        }, function () {

        });
    };

    $scope.cancel = function()
    {
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.refresh=function(){
        products.loadAll().then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
        });
    };





}]);
