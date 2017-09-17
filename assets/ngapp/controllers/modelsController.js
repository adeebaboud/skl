dasApp.controller('modelsController', ["$scope", "$http", "entityManager", "$uibModal","toaster","data", function($scope, $http,entityManager,$uibModal,toaster,data) {
    $scope.title=data.title;

    $scope.isLoading ={
        grid:true
    };
	$scope.msg="";
	$scope.err = false;
    $scope.models = [];
    $scope.events = [];
    $scope.ready = false;
    $scope.allowadd=data.allowadd==false?false:true;
    $scope.allowrefresh=data.allowrefresh==false?false:true;
    

    var vcolumnDefs=[];
    for(var j=0;j<data.tabs.length;j++)
    {
        var tab=data.tabs[j];
        for(var i=0;i<tab.fields.length;i++)
        {
            var field=tab.fields[i];
            if(field.show&&field.show!='grid') continue;
            if(field.type=='checkbox')
            {
                vcolumnDefs.push({field :field.field ,name: field.name,
                    cellTemplate:'<div class="ui-grid-cell-contents" title="TOOLTIP"><div  ng-if="row.entity.'+field.field+' == 0 " ><span class="label label-danger">No</span></div><div  ng-if="row.entity.'+field.field+' == 1 " ><span class="label label-success">Yes</span></div></div>'
                });
            }else
            {
                vcolumnDefs.push({field :field.field ,name: field.name});
            }
        }
    }
    vcolumnDefs.push({
                width:120,
                pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div>' +
                (data.allowview ? '<button class="btn btn-xs btn-primary" uib-tooltip="View Data" tooltip-placement="right" ng-click="grid.appScope.view(row.entity)"><i class="fa fa-eye"></i></button> ':'')+
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Data" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-edit"></i></button> '+
				'<button class="btn btn-xs btn-danger" uib-tooltip="Delete" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
			    '</div>'
            });

    $scope.gridOptions= {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : vcolumnDefs,
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                $scope.isLoading.grid = true;
                modelManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                    $scope.isLoading.grid = false;
					$scope.ready = true;
                });

            });
        }
    };

    $scope.isLoading.grid = true;
    var modelManager = new entityManager(dasApp.apiBase + data.apiname+'/','id',{data:'results'});
    modelManager.loadAll().then(function(data){
		
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
        $scope.isLoading.grid = false;
		$scope.models = data.results;
		
    });

	$scope.view = function (entity) {
		$scope.model = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/'+data.viewfolder+'/view.html',
            controller: 'addModelController',
            size: 'lg',
            resolve: {
                options: {
                    title:	'View ' + data.title,
                },
                modelManager : modelManager,
                model: entity,
                data:data
            }
        });

        modalInstance.result.then(function () {

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
			if(response.data.success == false)
			{
				$scope.err = true;
				$scope.msg = response.data.msg;
			}
			else
			{
				var index = $scope.gridOptions.data.indexOf(model);
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

    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {

		$scope.model = entity;
        var initmodel={};
        //----------- init model with list for grid
        for(var j=0;j<data.tabs.length;j++)
        {
            var tab=data.tabs[j];
            if(tab.grids)
                for(var i=0;i<tab.grids.length;i++)
                {
                    var grid=tab.grids[i];
                    initmodel[grid.field]=[];
                }
        }
        //----------- 
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
             templateUrl: dasApp.baseUrl + 'assets/dashboard/views/models/form.html',
            controller: 'addModelController',
           size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit ' : 'Add ') + data.title,
                    isEdit: isEdit ? true : false,
                },
				modelManager : modelManager,
                model: isEdit ? entity : initmodel,
                data:data
            }
        });

        modalInstance.result.then(function (model) {
            if(!isEdit)
                $scope.gridOptions.data.push(model);
        }, function () {
            if(isEdit)
			    delete_copy($scope.model);
        });
    };
/* ------------------------------ refresh ------------------------------ */
    $scope.refresh=function(){
        $scope.isLoading.grid=true;
        modelManager.loadAll().then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
            $scope.isLoading.grid=false;
        });
    };
/* ------------------------------ search ------------------------------ */
    $scope.fieldssearch=[];
    $scope.search = {};
    $scope.issearch = false;
    function initfieldssearch()
    {
        for(var j=0;j<data.tabs.length;j++)
        {
            var tab=data.tabs[j];
            for(var i=0;i<tab.fields.length;i++)
            {
                var field=tab.fields[i];
                if(field.search==true)
                {
                    $scope.search[field.field]='';
                    $scope.fieldssearch.push(field);
                }
            }
        }
        if($scope.fieldssearch.length>0)
            $scope.issearch = true;
    }
    initfieldssearch();


    $scope.showSearch = false;

    $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            for(var i=0;i<$scope.fieldssearch.length;i++)
            {
                 $scope.search[$scope.fieldssearch[i].field]='';
            }
            // $scope.search = {
            //     field1: '',
            //     field2: ''
            // };
            $scope.doSearch();
        }
    };

    $scope.doSearch = function() {
        $scope.isLoading.grid=true;
        var searchFields = [];
        for(var i=0;i<$scope.fieldssearch.length;i++)
        {
            var filed=$scope.fieldssearch[i];
            var vop='orlike';
            if(i==0)vop='like';

            //$scope.search[filed.field]='';

            if ( $scope.search[filed.field].trim() != '')
            {
                searchFields.push({
                    field:data.tablename+ '.'+filed.field,
                    value: $scope.search[filed.field],
                    op: vop
                });
            }
        }

        return modelManager.search(searchFields,$scope.newPage,$scope.pageSize).then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
            $scope.isLoading.grid=false;
        });
    };














}]);
