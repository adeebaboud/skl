
 dasApp.controller('groupsController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
	 $scope.title="Groups";
	 $scope.isLoading ={
		 grid:true
	 };
	 $scope.gridOptions= {
		  paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
        enableRowSelection: true,
		 enableRowHeaderSelection: false,
		 multiSelect : false,
		 columnDefs : [
			 { minWidth:100, field: 'name',displayName:'Name'},
			 { minWidth:120, field: 'description',displayName:'Description'},
			{  width:120,pinnedRight:true,name:'Actions',cellTemplate:'<div> <button class="btn btn-xs btn-success" tooltip-placement="right" uib-tooltip="Edit Group" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
			 '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Group" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button> </div>'}
		 
		 ],
		 data:[],
		 onRegisterApi: function(gridApi) {
			 gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

				 $scope.isLoading.grid = true;
				 groups.loadAll().then(function(data){
					 $scope.gridOptions.data = data.results;
					 $scope.gridOptions.totalItems = data.total;
					 $scope.isLoading.grid = false;
				 });

			 });
		 }
	 };

	 $scope.isLoading.grid = true;
	 var groups = new entityManager(dasApp.apiBase + 'groups/','id',{data:'results'});
	 groups.loadAll().then(function(data){
		 $scope.gridOptions.data = data.results;
		 $scope.gridOptions.totalItems = data.total;
		 $scope.isLoading.grid = false;
	 });
	 
	  $scope.add = function ( ) {

		 var modalInstance = $uibModal.open({
			 animation: $scope.animationsEnabled,
			 templateUrl: dasApp.baseUrl + 'assets/dashboard/views/groups/form.html',
			 controller: 'addGroupController',
			 size: 'lg',
			 resolve: {
				 options: {
					title:	 'Add Group',
					isEdit:false,
				 },
				 groupRepo:groups,
				 group: {
					 
				 }
			 }
		 });

		modalInstance.result.then(function (group) {
			$scope.gridOptions.data.push(group);
		 }, function () {

 		 });
	 };
	 
	 $scope.edit = function ( group) {

		group = copy_object(group);
		$scope.group = group;
		 var modalInstance = $uibModal.open({
			 animation: $scope.animationsEnabled,
			 templateUrl: dasApp.baseUrl + 'assets/dashboard/views/groups/form.html',
			 controller: 'addGroupController',
			 size: 'lg',
			 resolve: {
				 options: {
					title:	 'Edit Group',
					isEdit:true,
				 },
				 groupRepo:groups,
				 group: group
			 }
		 });

		 modalInstance.result.then(function (group) {
			
		 }, function () {
				delete_copy($scope.group);

 		 });
	 };
	 

	
	$scope.delete = function (group) {
		$scope.group  = group;
		 $scope.modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'DeleteDialog.html',
			scope:$scope
		});
	};
	
	$scope.confirm_delete = function () {
		group = $scope.group;
		  groups.delete(group.id) .then(function(response){
			   var index = $scope.gridOptions.data.indexOf(group);
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
