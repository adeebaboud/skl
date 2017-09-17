

dasApp.controller('addCategoryController', ["$scope", "entityManager", "$uibModalInstance", "category", "options", "categoriesManager", function ($scope, entityManager, $uibModalInstance,category,options,categoriesManager) {

    $scope.title=options.title;
    $scope.category = category;
	$scope.isLoading ={
        grid:false
	};

 //load categories for dropdown
    $scope.categories  = [];
	categoriesManager.loadAll(1,900).then(function(data){
			$scope.categories  = data.results;
	});

    $scope.searchCategories = function(str){
        return categoriesManager.search([ {
            field: 'categories.category_name_en',
            value: str,
            op: 'like'
        },{
            field: 'categories.category_name_ar',
            value: str,
            op: 'orlike'
        }],1,1000).then(function(data){$scope.categories = data.results;});
    };


    //load groups for dropdown
    //$scope.cities = [];
    //var  citiesManager = new entityManager(dasApp.apiBase + 'branches','city_id');
    //citiesManager.loadAll().then(function(data){
    //    $scope.cities = data.results;
    //});


    $scope.ok = function () {
		$scope.isLoading.grid = true;
	
        if(options.isEdit == true)
        {
		    
            categoriesManager.update($scope.category,$scope.category.category_id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.category = save_copy($scope.category);
				$uibModalInstance.close(response.data);
            },function(error){ //insert failed
				$scope.isLoading.grid = false;
                $scope.errors=error.errors;

            });
        }
        else
        {
            categoriesManager.add($scope.category) .then(function(response){
				$scope.isLoading.grid = false;
                $scope.category = save_copy($scope.category);
				$uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
                //angular.forEach(error.errors,function(i,j){ $scope.errors += '<p>'+<p>; });
            });
        }
    };

    $scope.cancel = function (item) {
		$uibModalInstance.dismiss('cancel');
    };
}]);