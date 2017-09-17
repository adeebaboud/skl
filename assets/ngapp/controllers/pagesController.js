dasApp.controller('pagesController', ["$scope", "$http", "entityManager", "$uibModal", "$routeParams", function($scope, $http,entityManager,$uibModal,$routeParams) {
	var section_id = $routeParams.section_id;
	$scope.is_section = false;
	$scope.isLoading ={
        grid:true
    };
	
	$scope.pageSize = 10;
	$scope.newPage = 1;
	
	if(typeof section_id !== 'undefined')
	{
		$scope.is_section = true;
		
		var filter = [];
		filter.push({
			field: 'sections.section_id',
			value: section_id,
			
		});
		var sectionsManager = new entityManager(dasApp.apiBase + 'sections/','section_id',{data:'results'});
	
		sectionsManager.search(filter).then(function(data){
		$scope.title=data.results[0].section_title_en;
		
		});
	}
	else
	{
		$scope.title="Pages";
	}
    $scope.gridOptions= {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {width:120,field :'page_title_en' ,displayName: 'Title En'},
            {width:120,field :'page_title_ar' ,displayName: 'Title Ar'},
			{width:120,field :'page_slug' ,displayName: 'Slug'},
            {width:120,field :'section_title_en' ,displayName: 'Section Title En'},
			{width:120,field :'section_title_ar' ,displayName: 'Section Title Ar'},
			{minWidth:200,field :'page_description_en' ,displayName: 'Description En'},
            {minWidth:200,field :'page_description_ar' ,displayName: 'Description Ar'},
            
            {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:
                '<div>' +
                    '<button class="btn btn-xs btn-success" uib-tooltip="Edit Page" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                    '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Page" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				$scope.pageSize = pageSize;
				$scope.newPage = newPage;
				
               $scope.isLoading.grid = true;
                
				
				if($scope.is_section == true)
				{
					var filter = [];
					filter.push({
						field: 'pages.section_id',
						value: section_id,
						
					});
					pagesManager.search(filter).then(function(data){
					$scope.gridOptions.data = data.results;
					$scope.gridOptions.totalItems = data.total;
					 $scope.isLoading.grid = false;
				});
				}else{
					pagesManager.loadAll(newPage,pageSize).then(function(data){
						 $scope.isLoading.grid = false;
						$scope.gridOptions.data = data.results;
						$scope.gridOptions.totalItems = data.total;
					});
				}

            });
        }
    };
	$scope.isLoading.grid = true;
    $scope.selectedSection = {};
    $scope.selectedSectionChanged = function(o){ 
        $scope.search.section_id = o.section_id;
        $scope.selectedSection = o;
        $scope.doSearch();
    };
 

    var pagesManager = new entityManager(dasApp.apiBase + 'pages/','page_id',{data:'results'});
	if($scope.is_section == true)
		{
			var filter = [];
			filter.push({
				field: 'pages.section_id',
				value: section_id,
				
			});
			pagesManager.search(filter).then(function(data){
			$scope.gridOptions.data = data.results;
			$scope.gridOptions.totalItems = data.total;
			$scope.isLoading.grid = false;
   
		});
	}else{
		pagesManager.loadAll().then(function(data){
			$scope.gridOptions.data = data.results;
			$scope.gridOptions.totalItems = data.total;
			$scope.isLoading.grid = false;
   
		});
	}

    //load sections for search
    $scope.sections = [];
    var  sectionsManager = new entityManager(dasApp.apiBase + 'sections','section_id');
    sectionsManager.loadAll().then(function(data){
        $scope.sections = data.results;
    });


    $scope.sectionsTree = [];
    var  sectionsTreeManager = new entityManager(dasApp.apiBase + 'sections/tree','section_id');
    sectionsTreeManager.loadAll().then(function(data){
        $scope.sectionsTree = data.results;
    });


    $scope.search = {
        page_title: '',
        page_description: '',
        section_id : 0
    };

    $scope.showSearch = false;

    $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            $scope.search = {
                page_title: '',
                page_description: '',
                section_id : 0
            };
            $scope.doSearch();
        }
    };

    $scope.doSearch = function() {
        var searchFields = [];
        if ($scope.search.page_title.trim() != '') {
            searchFields.push({
                field: 'pages.page_title_en',
                value: $scope.search.page_title,
                op: 'like'
            });
            searchFields.push({
                field: 'pages.page_title_ar',
                value: $scope.search.page_title,
                op: 'orlike'
            });
        }
        if($scope.search.page_description.trim()!='')
        {
             searchFields.push( {
                 field: 'pages.page_description_en',
                 value: $scope.search.page_description,
                 op: 'orlike'
                }
            );
            searchFields.push( {
                 field: 'pages.page_description_ar',
                 value: $scope.search.page_description,
                 op: 'orlike'
                }
            );
        }

        if($scope.search.section_id )
        {
             searchFields.push( {
                 field: 'pages.section_id',
                 value: $scope.search.section_id,
                 op: 'eq'
                }
            );
        }
		$scope.isLoading.grid = true;
        return pagesManager.search(searchFields,$scope.newPage,$scope.pageSize).then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
			 $scope.isLoading.grid = false;
        });
    };

    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    }

    $scope.add = function (isEdit,entity ) {
		$scope.page = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/pages/form.html',
            controller: 'addPageController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Page',
                    isEdit: isEdit ? true : false,
					is_section:$scope.is_section,
					section_id:section_id,
                    section: $scope.selectedSection
					
                },
                pagesManager : pagesManager,
                page: isEdit ? entity : {section_id :  $scope.selectedSection.section_id ,custom_fields:[],custom_field_values:[]}
            }
        });


        modalInstance.result.then(function (page) {
            if(!isEdit)
                $scope.gridOptions.data.push(page);
        }, function () {
			delete_copy($scope.page);
        
        });
    };


    $scope.delete = function (page) {
        $scope.page  = page;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        page = $scope.page;
        pagesManager.delete(page.page_id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(page);
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
