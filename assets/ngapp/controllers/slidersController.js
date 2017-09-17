dasApp.controller('slidersController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Sliders";
	$scope.isLoading ={
        grid:true
    };
    $scope.gridOptions= {
        useExternalPagination: true,
         paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {minWidth:120,field :'slider_name' ,displayName: 'Slider Name'},
            {minWidth:200,field :'slider_title_en' ,displayName: 'Title En'},
            {minWidth:200,field :'slider_title_ar' ,displayName: 'Title Ar'},
              {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div> &nbsp;' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Slider" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Slider" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                 $scope.isLoading.grid = true;
                slidersManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
 $scope.isLoading.grid = true;
    var slidersManager = new entityManager(dasApp.apiBase + 'sliders/','slider_id',{data:'results'});
    slidersManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
		 $scope.isLoading.grid = false;
    });


    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
		$scope.slider = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/sliders/form.html',
            controller: 'addSliderController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Slider',
                    isEdit: isEdit ? true : false,
                },
                slidersManager : slidersManager,
                slider: isEdit ? entity : {}
            }
        });


        modalInstance.result.then(function (slider) {
            if(!isEdit)
                $scope.gridOptions.data.push(slider);
        }, function () {
			delete_copy($scope.slider);
        
        });
    };

    $scope.delete = function (slider) {
        $scope.slider  = slider;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        slider = $scope.slider;
        slidersManager.delete(slider.slider_id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(slider);
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
