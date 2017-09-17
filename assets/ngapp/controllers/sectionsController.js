dasApp.controller('sectionsController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Sections";
	$scope.msg="";
	$scope.err = false;
	$scope.isLoading ={
        grid:true
    };
    $scope.gridOptions= {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
        showTreeExpandNoChildren: false,
       rowSelection: true,
        columnDefs : [
			 {width:130,field :'section_title_en' ,name: 'Name En'},
            {width:130,field :'section_title_ar' ,name: 'Name Ar'},
			{width:130,field :'section_slug' ,name: 'Slug'},
            {minWidth:200,field :'section_description_en' ,name: 'Description En'},
            {minWidth:200,field :'section_description_ar' ,name: 'Description Ar'},
            {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div>' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Section" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Section" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.treeBase.on.rowExpanded($scope, function(row) {
                
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) { 
                
            }); 
        }
    };

var writeoutNode = function( childArray, currentLevel, dataArray ){
  childArray.forEach( function( childNode ){
//    if ( childNode.children.length > 0 ){
      childNode.$$treeLevel = currentLevel;
//    }
    dataArray.push( childNode );
    writeoutNode( childNode.sections, currentLevel + 1, dataArray );
  });
};
	 
    var rootSectionsManager = new entityManager(dasApp.apiBase + 'sections/tree/','section_id',{data:'results'}); 
    var sectionsManager = new entityManager(dasApp.apiBase + 'sections/','section_id',{data:'results'}); 
 
    function loadData(){
        $scope.isLoading.grid = true;
        $scope.gridOptions.data = [];
        rootSectionsManager.loadAll(1,100).then(function(data){  
            $scope.sections = data.results;
            //var rootSections = $.grep( data.results,function(j,i){return (j.parent_id ==  0) && !(j.$$treeLevel = 0); });
            var sections = writeoutNode($scope.sections,0,$scope.gridOptions.data);
            //$scope.gridOptions.data = rootSections;
            $scope.gridOptions.totalItems = $scope.gridOptions.data.length;
            $scope.isLoading.grid = false;
        });
    }
   loadData();

    $scope.search = {

    };

    $scope.showSearch = false;

    $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            $scope.search = {

            };
            $scope.doSearch();
        }
    };

    $scope.doSearch = function(){
        var searchFields = [];
        /*if($scope.search.product_name.trim()!='')
         searchFields.push( {
         field: 'product.product_name',
         value: $scope.search.product_name,
         op: 'like'
         }
         );*/

        return sectionsManager.search(searchFields).then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
        });
    };

    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
			$scope.section = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/sections/form.html',
            controller: 'addSectionController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Section',
                    isEdit: isEdit ? true : false,
                },
                sectionsManager : sectionsManager,
                section: isEdit ? entity : {custom_fields:[]}
            }
        });

        modalInstance.result.then(function (section) {
            if(!isEdit)
                $scope.gridOptions.data.push(section);
            loadData();
        }, function () {
			delete_copy($scope.section);
		});
    };


    $scope.delete = function (section) {
        $scope.section  = section;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        section = $scope.section;
        sectionsManager.delete(section.section_id) .then(function(response){
				var index = $scope.gridOptions.data.indexOf(section);
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

    $scope.refresh=function(){
        products.loadAll().then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
        });
    };





}]);
