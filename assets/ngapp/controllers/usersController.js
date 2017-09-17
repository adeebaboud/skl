 dasApp.controller('usersController', ["$scope", "$http", "entityManager", "$uibModal", "$routeParams", function($scope, $http,entityManager,$uibModal,$routeParams) {
	 $scope.title="Users";
	 var members = $routeParams.members;
	 $scope.is_member = false;

	if(typeof members !== 'undefined')
	{
		$scope.is_member = true;
		$scope.title="Members";
	}
	
	 $scope.isLoading ={
		 grid:true
	 };
	 
	$scope.pageSize = 10;
	$scope.newPage = 1;
	
	
	 $scope.gridOptions= {
		  paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
        enableRowSelection: true,
		 enableRowHeaderSelection: false,
		 multiSelect : false,
		 columnDefs : [
			 {  minWidth:120,field: 'username',displayName:'Username'},
			 {  width:120,field: 'first_name',displayName:'First Name'},
			 {  width:120,field: 'last_name',displayName:'Last Name'},
			 {  width:150,field: 'email',displayName:'Email'},
			 {  width:120,field: 'group_name',displayName:'Group'},
			 {  width:100,field: 'phone',displayName:'Phone'},
			 
			{  width:130,pinnedRight:true,name:'Actions',cellTemplate:'<div> <button class="btn btn-xs btn-warning"  ng-hide="grid.appScope.is_member" tooltip-placement="right" uib-tooltip="Assign User to Group" ng-click="grid.appScope.assign_group(row.entity)"><i class="fa fa-plus"></i></button> '+
			'<button class="btn btn-xs btn-success" uib-tooltip="Edit User" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
			 '<button class="btn btn-xs btn-danger"   uib-tooltip="Delete User" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button> </div>'}
		 
		 ],
		 data: [],
		 onRegisterApi: function (gridApi) {
			 gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				$scope.pageSize = pageSize;
				$scope.newPage = newPage;
				 $scope.isLoading.grid = true;

				 if($scope.is_member == true)
				{
					 var filter = [];
					 filter.push({
						field: 'users_groups.group_id',
						value: '4',

					});
					filter.push({
						field: 'users.is_deleted',
						value: '0',

					});
					
					 users.search(filter).then(function(data){
						$scope.gridOptions.data = data.results;
						$scope.gridOptions.totalItems = data.total;
						 $scope.isLoading.grid=false;
   
					});

				}else{

					 var filter = [];
					 filter.push({
						field: 'users_groups.group_id',
						value: '4',
						op:'noteq'

					});
					filter.push({
						field: 'users.is_deleted',
						value: '0',

					});
					
					 users.search(filter).then(function(data){
						$scope.gridOptions.data = data.results;
						$scope.gridOptions.totalItems = data.total;
						 $scope.isLoading.grid=false;
   
					});
				}
			 });

		 }
	 };
	 $scope.isLoading.grid=true;
	 var users = new entityManager(dasApp.apiBase + 'users/','id',{data:'results'});

	if($scope.is_member == true)
	{
		 var filter = [];
		 filter.push({
			field: 'users_groups.group_id',
			value: '4',
		});
		filter.push({
						field: 'users.is_deleted',
						value: '0',

					});
	
		 users.search(filter).then(function(data){
			$scope.gridOptions.data = data.results;
			$scope.gridOptions.totalItems = data.total;
			$scope.isLoading.grid=false;
		});

	}else{
			var filter = [];
			 filter.push({
				field: 'users_groups.group_id',
				value: '4',
				op:'noteq'

			});
			filter.push({
				field: 'users.is_deleted',
				value: '0',

			});
			
			 users.search(filter).then(function(data){
				$scope.gridOptions.data = data.results;
				$scope.gridOptions.totalItems = data.total;
				$scope.isLoading.grid=false;
			});
		}

	//load sections for search
    $scope.groups = [];
    var  groupsManager = new entityManager(dasApp.apiBase + 'groups','id');
    groupsManager.loadAll().then(function(data){
        $scope.groups = data.results;
    });
	 
	 

 $scope.search = {
		 first_name: '',
		 last_name: '' ,
		 group_id: '' ,
		 email: ''

	 };

	  if($scope.is_member)
		 {
		 $scope.search = {
				 first_name: '',
				 last_name: '' ,
				 group_id: '4' ,
				 email: ''

			 };
		 }

	 $scope.showSearch = false;

	 $scope.toggleSearchBox = function(){
		 $scope.showSearch = !$scope.showSearch;
		 //reset search parameters and refill grid with unfiltered results
		 if(!$scope.showSearch)
		 {
			 $scope.search = {
				 first_name: '',
				 last_name: '' ,
				 group_id: '' ,
				 email: ''
			 };
			 $scope.doSearch();
		 }
	 };

	 $scope.doSearch = function(){
		 var searchFields = [];
		 if($scope.search.first_name.trim()!='')
			 searchFields.push( {
					 field: 'users.first_name',
					 value: $scope.search.first_name,
					 op: 'like'
				 }
		 	);
		if($scope.search.last_name )
			 searchFields.push( {
				 field: 'users.last_name',
				 value: $scope.search.last_name,
				 op: 'like'
			 }
		 	);
		 if($scope.search.group_id.trim()!='')
			 searchFields.push( {
				 field: 'users_groups.group_id',
				 value: $scope.search.group_id,
				 op: 'like'
			 }
		 	);

 		if( $scope.search.email )
			 searchFields.push( {
				 field: 'users.email',
				 value: $scope.search.email,
				 op: 'like'
			 }
		);

		if(searchFields.length <=0  )
		{
			if($scope.is_member == false)
			{
				var searchFields = [];
				 searchFields.push({
					field: 'users_groups.group_id',
					value: '4',
					op:'noteq'

				});
			}
			else
			{
				var searchFields = [];
				 searchFields.push({
					field: 'users_groups.group_id',
					value: '4',

				});

			}

		}
		 return users.search(searchFields,$scope.newPage,$scope.pageSize).then(function(data){
			 $scope.gridOptions.data = data.results;
		 });
	 };

	  $scope.add = function ( ) {

		 var modalInstance = $uibModal.open({
			 animation: $scope.animationsEnabled,
			 templateUrl: dasApp.baseUrl + 'assets/dashboard/views/users/form.html',
			 controller: 'addUserController',
			 size: 'lg',
			 resolve: {
				 options: {
					title:	 'Add User',
					isEdit:false,
					is_member:$scope.is_member,
				 },
				 userRepo:users,
				 user: {
					 
				 }
			 }
		 });

			modalInstance.result.then(function (user) {

				$scope.gridOptions.data.push(user);
			}, function () {

			});
	 };
	 
	  $scope.edit = function (user) {

		user = copy_object(user);
		$scope.user = user;
		 var modalInstance = $uibModal.open({
			 animation: $scope.animationsEnabled,
			 templateUrl: dasApp.baseUrl + 'assets/dashboard/views/users/form_edit.html',
			 controller: 'addUserController',
			 size: 'lg',
			 resolve: {
				 options: {
					title:	 'Edit User',
					isEdit:true,
				 },
				 userRepo:users,
				 user: user
			 }
		 });

		 modalInstance.result.then(function (user) {
			
		 }, function () {
			delete_copy($scope.user);
         });
	 };
	 
	 
	$scope.delete = function (user) {
		$scope.user  = user;
		 $scope.modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'DeleteDialog.html',
			scope:$scope
		});
	};
	
	$scope.confirm_delete = function () {
		user = $scope.user;
		  users.delete(user.id) .then(function(response){
			   var index = $scope.gridOptions.data.indexOf(user);
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
	
	
	$scope.assign_group = function (user)
	{
		var modalInstance = $uibModal.open({
			 animation: $scope.animationsEnabled,
			 templateUrl: dasApp.baseUrl + 'assets/dashboard/views/users/assign_group.html',
			 controller: 'assignGroupController',
			 size: 'lg',
			 resolve: {
				 options: {
					title:	 'Assign Group',
				 },
				 userRepo:users,
				 user:  user,
			}
		 });

		 modalInstance.result.then(function (user) {
			
		 }, function () {

 		 });
	}
	
 }]);
