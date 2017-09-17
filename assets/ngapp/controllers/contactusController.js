dasApp.controller('contactusController', ["$scope", "$http", "entityManager", "$uibModal", "$routeParams", function($scope, $http,entityManager,$uibModal,$routeParams) {
$scope.title="Contact Us";
 var feedback = $routeParams.feedback;
	 $scope.is_feedback = false;

	if(typeof feedback !== 'undefined')
	{
		$scope.is_feedback = true;
		$scope.title="Feedback";
	}
	
	var contactManager = new entityManager(dasApp.apiBase + 'contactus/','contactus_id',{data:'results'});

	
 $scope.isLoading ={
        grid:true
    };
	$scope.msg="";
	$scope.err = false;
    $scope.gridOptions= {
        useExternalPagination: true,
       paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {minWidth:120,field :'title' ,name: 'Title'},
            {width:120,field :'sender_name' ,name: 'Sender Name'},
            {width:120,field :'sender_phone' ,name: 'Sender Phone'},
			{width:120,field :'sender_email' ,name: 'Sender Email'},
            {width:180,field :'contact_date' ,name: 'Date'},
			 {width:80,field :'is_read' ,displayName: 'Status',
			 cellTemplate:'<div class="ui-grid-cell-contents" title="TOOLTIP"><div  ng-if="row.entity.is_read == 0 " ><span class="label label-success">New</span></div></div>'
			},
			 {
				  width:110,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div> &nbsp;' +
                '<button class="btn btn-xs btn-primary" uib-tooltip="View Message" tooltip-placement="bottom" ng-click="grid.appScope.view(row.entity)"><i class="fa fa-eye"></i></button> '+
                 '<button class="btn btn-xs btn-danger" uib-tooltip="Delete" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
				 '</div>'
            }


        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

               $scope.isLoading.grid = true;
			 if($scope.is_feedback == true)
				{
					 var filter = [];
					 filter.push({
						field: 'contact_us.type',
						value: '1',

					});
					

				}else{

					 var filter = [];
					 filter.push({
						field: 'contact_us.type',
						value: '0',

					});
				}
				 contactManager.search(filter,newPage,pageSize).then(function(data){
					$scope.gridOptions.data = data.results;
					$scope.gridOptions.totalItems = data.total;
					 $scope.isLoading.grid=false;

				});
/* 
                contactManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });
 */
            });

        }
    };
	$scope.isLoading.grid = true;
   if($scope.is_feedback == true)
	{
		 var filter = [];
		 filter.push({
			field: 'contact_us.type',
			value: '1',

		});
		

	}else{

		 var filter = [];
		 filter.push({
			field: 'contact_us.type',
			value: '0',

		});
	}
	 contactManager.search(filter).then(function(data){
		$scope.gridOptions.data = data.results;
		$scope.gridOptions.totalItems = data.total;
		 $scope.isLoading.grid=false;

	});

	 $scope.refreshGrid = function(){
             $scope.isLoading.grid = true;
            contactManager.loadAll().then(function(data){
                $scope.gridOptions.data = data.results;
                $scope.gridOptions.totalItems = data.total;
                $scope.isLoading.grid = false;
            });
      
    };
	
	$scope.view = function (entity ) {
		if(entity.is_edit != '1'){
            var message = {};
            message.is_read = '1';
            $http.post(dasApp.apiBase + 'contactus/update_status/'+entity.contactus_id, message).then(function(response){
                entity.is_read = '1';
                $scope.$emit('onMessageRead',entity.contactus_id);
            },function(error){ //update failed

            });
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/contactus/view.html',
            size: 'lg',
            controller: ["$scope", function($scope){
                $scope. title=entity.title;
                    $scope.message=entity;
            }]
        });


        modalInstance.result.then(function (message) {
        }, function () {
        });
    };
	
	$scope.delete = function (message) {
        $scope.message  = message;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        message = $scope.message;
        contactManager.delete(message.contactus_id) .then(function(response){
		
			if(response.data.success == false)
			{
				$scope.err = true;
				$scope.msg = response.data.msg;

			}
			else
			{
				var index = $scope.gridOptions.data.indexOf(message);
				$scope.gridOptions.data.splice(index, 1);
				$scope.gridOptions.totalItems = $scope.gridOptions.totalItems-1;
				$scope.modalInstance.close();
			}
        }, function () {

        });
    };

}]);
