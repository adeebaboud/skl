dasApp.controller('menusController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Menus";
	$scope.isLoading ={
        grid:true
    };
    $scope.gridOptions= {
        useExternalPagination: true,
         paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {minWidth:200,field :'menu_name_en' ,displayName: 'Menu Name En'},
            {minWidth:200,field :'menu_name_en' ,displayName: 'Menu Name Ar'},
            {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div> &nbsp;' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Menu" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Menu" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                 $scope.isLoading.grid = true;
                menuManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
 $scope.isLoading.grid = true;
    var menuManager = new entityManager(dasApp.apiBase + 'menu/','menu_id',{data:'results'});
    menuManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
		 $scope.isLoading.grid = false;
    });


    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
		$scope.menu = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/menu/form.html',
            controller: 'addMenuController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Menu',
                    isEdit: isEdit ? true : false,
                },
                menuManager : menuManager,
                menu: isEdit ? entity : {}
            }
        });


        modalInstance.result.then(function (menu) {
            if(!isEdit)
                $scope.gridOptions.data.push(menu);
        }, function () {
			delete_copy($scope.menu);
        
        });
    };

    $scope.delete = function (menu) {
        $scope.menu  = menu;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        menu = $scope.menu;
        menuManager.delete(menu.menu_id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(menu);
            $scope.gridOptions.data.splice(index, 1);
            $scope.gridOptions.totalItems = $scope.gridOptions.totalItems-1;
            $scope.modalInstance.close();
        }, function () {

        });
    };

    $scope.cancel = function()
    {
        $scope.modalInstance.dismiss('cancel');
    };


}]);
