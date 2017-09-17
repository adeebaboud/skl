
 dasApp.controller('addGroupController', ["$scope", "entityManager", "$uibModalInstance", "group", "options", "groupRepo", function ($scope, entityManager, $uibModalInstance,group,options,groupRepo) {

	$scope.title=options.title;
	$scope.group = group;
	$scope.isLoading ={
        grid:false
	};
	 
	$scope.ok = function () {
		$scope.isLoading.grid = true;
	
		if(options.isEdit == true)
		{
		    
			groupRepo.update($scope.group,$scope.group.id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.group = save_copy($scope.group);
				$uibModalInstance.close(response.data);
			},function(error){ //insert failed
				$scope.errors=error.errors;
				$scope.isLoading.grid = false;
				//angular.forEach(error.errors,function(i,j){$scope.errors += '<p>'+<p>;});

			});
		}
		else
		{
			groupRepo.add($scope.group) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.group = save_copy($scope.group);
				$uibModalInstance.close(response.data);
			},function(error){ //insert failed
				$scope.errors=error.errors;
				$scope.isLoading.grid = false;
				//angular.forEach(error.errors,function(i,j){$scope.errors += '<p>'+<p>;});

			});
		}
		
	};

	$scope.cancel = function (item) {
        
		$uibModalInstance.dismiss('cancel');
	};
	
 }]);
 