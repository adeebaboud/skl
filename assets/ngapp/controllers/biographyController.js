dasApp.controller('biographyController', ["$scope", "$http", "$uibModal", "$timeout", function($scope, $http,$uibModal,$timeout) {
    $scope.title="Biography";
	$scope.msg="";
	$scope.err = false;
	$scope.biography = [];
	$scope.done = '';
	$scope.showMsg = false;

	$scope.isLoading ={
        grid:true
    };

	function loadBio(){
		$scope.isLoading.grid = true;
		$http.get(dasApp.apiBase +'biography')
			.success(function(response) {
				$scope.biography = response;
				 $scope.isLoading.grid = false;
                 

		});
	}

	loadBio();

	$scope.ok = function () {
		 $scope.isLoading.grid = true;
                
		$http.post(dasApp.apiBase +'biography', $scope.biography).then(function(data){
			 $scope.isLoading.grid = false;
                
			$scope.showMsg = true;
			$scope.done = 'Updated Successfully';
			$timeout(function () { $scope.showMsg = false; }, 6000);   
		});

	}

	$scope.cancel = function(){
		loadBio();
	};
}]);
