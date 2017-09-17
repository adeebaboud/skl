dasApp.controller('branchesController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title = "Branches";

    $scope.isLoading ={
        grid:true
    };
	$scope.msg="";
	$scope.err = false;
    $scope.force = false;
    $scope.gridOptions = {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
        rowSelection: true,
        columnDefs: [
            {width:70,field: 'branch_code', displayName: 'Code'},
            {width:120,field: 'branch_name_en', displayName: 'Name En'},
            {width:120,field: 'branch_name_ar', displayName: 'Name Ar'},
            {minWidth:180,field: 'branch_address_en', displayName: 'Address En'},
            {minWidth:180,field: 'branch_address_ar', displayName: 'Address Ar'},
            {width:120,field: 'branch_phone', displayName: 'Phone'},
            {width:120,field: 'branch_mobile', displayName: 'Mobile'},
            {width:120,
                field: 'country_name_en',
                displayName: 'Country'
            },
            {width:120, pinnedRight:true,
                name: 'Actions',
                cellTemplate: '<div>' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Branch" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> ' +
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Branch" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>' +
                '</div>'
            }

        ],
        data: [],
        onRegisterApi: function (gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                $scope.isLoading.grid = true;
                 branchesManager.loadAll(newPage, pageSize).then(function (data) {
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
    $scope.isLoading.grid = true;
    var branchesManager = new entityManager(dasApp.apiBase + 'branches/', 'branch_id', {data: 'results'});
    branchesManager.loadAll().then(function (data) {
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
        $scope.isLoading.grid = false;
    });




	 $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    }
	
    $scope.add = function (isEdit, entity) {
		$scope.branch = entity;

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/branches/form.html',
            controller: 'addBranchController',
            size: 'lg',
            resolve: {
                options: {
                    title: (isEdit ? 'Edit' : 'Add') + ' Branch',
                    isEdit: isEdit ? true : false,
                },
                branchesManager: branchesManager,
                branch: isEdit ? entity : {branch_images:[]}
            }
        });


        modalInstance.result.then(function (product) {
            if (!isEdit)
                $scope.gridOptions.data.push(product);
        }, function () {
			//delete_copy($scope.branch);
        });
    };


    $scope.delete = function (branch) {
        $scope.branch = branch;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope: $scope
        });
    };


    $scope.confirm_delete = function () {
        branch = $scope.branch;
		  branchesManager.delete(branch.branch_id).then(function (response) {
				var index = $scope.gridOptions.data.indexOf(branch);
				$scope.gridOptions.data.splice(index, 1);
				$scope.gridOptions.totalItems = $scope.gridOptions.totalItems - 1;
				$scope.force=false;
				$scope.modalInstance.close();

        },function(error) 
		{
			if(error.errors == 'UnAuthorized')
				$window.location.href= dasApp.baseUrl+'dashboard';	
		});

    };

    $scope.cancel = function () {
		//$scope.branch = delete_copy();
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.refresh = function () {
        products.loadAll().then(function (data) {
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
        });
    };
}]);
