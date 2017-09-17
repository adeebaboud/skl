
dasApp.controller('assignGroupController', ["$scope", "entityManager", "$uibModalInstance", "user", "options", "userRepo", "$http", function ($scope, entityManager, $uibModalInstance,user,options,userRepo,$http) {

	$scope.title=options.title;
	$scope.user = user;
	$scope.isLoading ={
        grid:false
	};


	 //load groups for dropdown
	 $scope.user_groups = {};
	 var  groupsManager = new entityManager(dasApp.apiBase + 'groups','id');
	 groupsManager.loadAll().then(function(data){
		 $scope.user_groups = data.results;
	 });

	  $scope.branches = {};
	 var  branchesManager = new entityManager(dasApp.apiBase + 'branches','branch_id');
	 branchesManager.loadAll(1,100).then(function(data){
		 $scope.branches = data.results;
	 });
	 
	$scope.ok = function () {
		$scope.isLoading.grid = true;
	
		$scope.user['selected'] = user.group_id;


		$http.post(dasApp.apiBase+'users/assign_group',$scope.user).then(function(response){
			$scope.isLoading.grid = false;
	
				$uibModalInstance.close(response.data);
			},function(error){ //insert failed
				$scope.errors=error.errors;
				$scope.isLoading.grid = false;
				//angular.forEach(error.errors,function(i,j){$scope.errors += '<p>'+<p>;});

			});

		$scope.update_user = {}; //update user branch
		$scope.update_user.branch_id  = user.branch_id;
		$scope.update_user.username = user.username;
		$scope.update_user.password = user.password;
		$scope.update_user.first_name = user.first_name;
		$scope.update_user.email = user.email;
		$scope.update_user.group_id = user.group_id;
		userRepo.update($scope.update_user,$scope.user.id) .then(function(response){
		$uibModalInstance.close(response.data);
		},function(error){ //insert failed
			$scope.errors=error.errors;
			//angular.forEach(error.errors,function(i,j){$scope.errors += '<p>'+<p>;});

		});
	};


	$scope.cancel = function () {

		$uibModalInstance.dismiss('cancel');
	};
 }]);
