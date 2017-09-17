dasApp.controller('imageGalleryController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Image Gallerys";
	$scope.isLoading ={
        grid:true
    };
    $scope.gridOptions= {
        useExternalPagination: true,
         paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {minWidth:120,field :'name' ,displayName: 'Name'},
            {minWidth:200,field :'title_en' ,displayName: 'Title En'},
            {minWidth:200,field :'title_ar' ,displayName: 'Title Ar'},
              {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div> &nbsp;' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                 $scope.isLoading.grid = true;
                modelManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
 $scope.isLoading.grid = true;
    var modelManager = new entityManager(dasApp.apiBase + 'image_gallery/','id',{data:'results'});
    modelManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
		 $scope.isLoading.grid = false;
    });


    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
		$scope.model = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/image_gallery/form.html',
            controller: 'addImageGalleryController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Image Gallery',
                    isEdit: isEdit ? true : false,
                },
                modelManager : modelManager,
                model: isEdit ? entity : {}
            }
        });


        modalInstance.result.then(function (model) {
            if(!isEdit)
                $scope.gridOptions.data.push(model);
        }, function () {
			delete_copy($scope.model);
        
        });
    };

    $scope.delete = function (model) {
        $scope.model  = model;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        model = $scope.model;
        modelManager.delete(model.id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(model);
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
