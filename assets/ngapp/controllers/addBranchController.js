
dasApp.controller('addBranchController', ["$scope", "entityManager", "$uibModalInstance", "branch", "options", "branchesManager", function ($scope, entityManager, $uibModalInstance,branch,options,branchesManager) {

    $scope.title=options.title;
    $scope.branch = branch;
	$scope.isLoading ={
        grid:false
	};


    //load groups for dropdown
    $scope.countries = [];
    var  countriesManager = new entityManager(dasApp.apiBase + 'branches/countries','country_id');
    countriesManager.loadAll().then(function(data){
        $scope.countries = data;
    });


    $scope.ok = function () {
		$scope.isLoading.grid = true;
	
        if(options.isEdit == true)
        {	
			
            branchesManager.update($scope.branch,$scope.branch.branch_id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.branch = save_copy($scope.branch);
				$uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;

            });
        }
        else
        {
            branchesManager.add($scope.branch) .then(function(response){
				$scope.isLoading.grid = false;
                $scope.branch = save_copy($scope.branch);
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

    //==================

    
    $scope.addBranch_image = function () {
        if(!$scope.branch.branch_images)
            $scope.branch.branch_images = [];

        $scope.branch.branch_images.push({
            title_en: '',
            title_ar: '',
            description_en: '',
            description_ar: '',
            photo_en: '',
            photo_ar: '',
            sort: '',
            branch_id: 0,
            $$is_editing : true
        });
    };

    $scope.editBranch_image = function (item) {
        item.$$is_editing = true;
        item.$$clone = angular.copy(item);
    };

    $scope.saveBranch_image = function (item) {
        item.$$is_editing = false;
        delete item.$$clone ;
    };

    $scope.cancelBranch_image = function (item) {
        item.$$is_editing = false;
        angular.forEach(item.$$clone, function(i,j){
            if(j.startsWith('$$'))
                return;
            item[j] = i;
        });
        delete item.$$clone;
    };

    $scope.removeBranch_image = function (item) {
        var index = $scope.branch.branch_images.indexOf(item);
        if(index >=0)
            $scope.branch.branch_images.splice(index, 1);
    };

}]);