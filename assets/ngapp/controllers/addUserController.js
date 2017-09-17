 
dasApp.controller('addUserController', ["$scope", "entityManager", "$uibModalInstance", "user", "options", "userRepo", function ($scope, entityManager, $uibModalInstance,user,options,userRepo) {

	$scope.title=options.title;
	$scope.user = user;
	$scope.is_member = options.is_member;
	$scope.isLoading ={
        grid:false
	};


	 //load groups for dropdown
	 $scope.groups = {};
	 var  groupsManager = new entityManager(dasApp.apiBase + 'groups','id');
	 groupsManager.loadAll().then(function(data){
		 $scope.groups = data.results;
	 });

	  $scope.branches = {};
	 var  branchesManager = new entityManager(dasApp.apiBase + 'branches','branch_id');
	 branchesManager.loadAll(1,100).then(function(data){
		 $scope.branches = data.results;
	 });

	if($scope.is_member == true)
	{
		$scope.user.group='4';
	}
	 
	$scope.ok = function () {
		$scope.isLoading.grid = true;
	
		if(options.isEdit == true)
		{
			 
			userRepo.update($scope.user,$scope.user.id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.user = save_copy($scope.user);
          
			$uibModalInstance.close(response.data);
			},function(error){ //insert failed
				$scope.errors=error.errors;
				$scope.isLoading.grid = false;
				//angular.forEach(error.errors,function(i,j){$scope.errors += '<p>'+<p>;});

			});
		}
		else
		{
			userRepo.add($scope.user) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.user = save_copy($scope.user);
          
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
