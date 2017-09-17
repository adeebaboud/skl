dasApp.controller('productsController', ["$scope", "$http", "entityManager", "$uibModal","$window", function($scope, $http,entityManager,$uibModal,$window ) {
    $scope.title="Products";
	$scope.isLoading ={
        grid:true
    };
	$scope.pageSize = 10;
	$scope.newPage = 1;
	
    $scope.gridOptions= {
        useExternalPagination: true,
         paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        rowHeight: 128,
        columnDefs : [
            //{field :'product_id' ,displayName: 'Id'},
            { width:120,
                field :'product_image_en' ,
                displayName: 'Image En',
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><img src="{{row.entity.thumb_en}}" class="img-responsive"></div>'
            },
            { width:120,field :'product_image_ar' ,
                displayName: 'Image Ar',
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><img src="{{row.entity.thumb_ar}}" class="img-responsive"></div>'
            },
            { width:120,field :'product_name_en' ,displayName: 'Name En'},
            { width:120,field :'product_name_ar' ,displayName: 'Name Ar'},
            {   width:120,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">{{row.entity.category_name_ar}} | {{row.entity.category_name_en}}</div>'
                ,field :'category_name_ar' ,name: 'Category'
            },
            { width:120,field :'product_price' ,displayName: 'Price'},
            { minWidth:200, field :'product_description_en' ,displayName: 'Description En'},
            {minWidth:200, field :'product_description_ar' ,displayName: 'Description Ar'},
            { width:120,
                pinnedRight:true,
                name:'Actions',
                cellTemplate:
                '<div>' +
                    '<button class="btn btn-xs btn-success" uib-tooltip="Edit Product" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                    '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Product" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				$scope.pageSize = pageSize;
				$scope.newPage = newPage;
                $scope.isLoading.grid=true;
				productsManager.loadAll(newPage,pageSize).then(function(data){
					
					$scope.isLoading.grid=false;
					$scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });
        }
    };
    $scope.isLoading.grid=true;
    var productsManager = new entityManager(dasApp.apiBase + 'products/','product_id',{data:'results'});
    productsManager.loadAll().then(function(data){
		
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
        $scope.isLoading.grid=false;
    });

    //load cattegories for search
    $scope.categories = [];
    var  categoriesManager = new entityManager(dasApp.apiBase + 'categories','category_id');
    categoriesManager.loadAll().then(function(data){
        $scope.categories = data.results;
    });

    $scope.search = {
        product_name: '',
        product_description: '',
        category_id : 0
    };

    $scope.showSearch = false;

    $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            $scope.search = {
                product_name: '',
                product_description: '',
                category_id : 0
            };
            $scope.doSearch();
        }
    };

    $scope.doSearch = function() {
        $scope.isLoading.grid=true;
        var searchFields = [];
        if ($scope.search.product_name.trim() != '') {
            searchFields.push({
                field: 'products.product_name_en',
                value: $scope.search.product_name,
                op: 'like'
            });
            searchFields.push({
                field: 'products.product_name_ar',
                value: $scope.search.product_name,
                op: 'orlike'
            });
        }
        if($scope.search.product_description.trim()!='')
        {
             searchFields.push( {
                 field: 'products.product_description_en',
                 value: $scope.search.product_description,
                 op: 'orlike'
                }
            );
            searchFields.push( {
                 field: 'products.product_description_ar',
                 value: $scope.search.product_description,
                 op: 'orlike'
                }
            );
        }

        if($scope.search.category_id )
        {
             searchFields.push( {
                 field: 'products.category_id',
                 value: $scope.search.category_id,
                 op: 'eq'
                }
            );
        }

        return productsManager.search(searchFields,$scope.newPage,$scope.pageSize).then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
            $scope.isLoading.grid=false;
        });
    };

    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    }

    $scope.add = function (isEdit,entity ) {
		$scope.product = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/products/form.html',
            controller: 'addProductController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Product',
                    isEdit: isEdit ? true : false,
                },
                productsManager : productsManager,
                product: isEdit ? entity : {}
            }
        });


        modalInstance.result.then(function (product) {
            if(!isEdit)
                $scope.gridOptions.data.push(product);
			
        }, function () {
			 delete_copy($scope.product);
		
        });
    };


    $scope.delete = function (product) {
        $scope.product  = product;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        product = $scope.product;
        productsManager.delete(product.product_id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(product);
            $scope.gridOptions.data.splice(index, 1);
            $scope.gridOptions.totalItems = $scope.gridOptions.totalItems-1;
            $scope.modalInstance.close();
        }, function () {

        });
    };

    $scope.cancel = function(item)
    {
		$scope.modalInstance.dismiss('cancel');
    };

    $scope.refresh=function(){
        $scope.isLoading.grid=true;
        products.loadAll().then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
            $scope.isLoading.grid=false;
        });
    };





}]);
