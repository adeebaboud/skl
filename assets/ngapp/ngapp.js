var dasApp = angular.module('dasApp' ,  ['ngRoute', 'ui.grid', 'ui.grid.pagination','ui.grid.treeView' ,'ui.grid.resizeColumns' ,'ngSanitize',
	'ui.grid.selection' , 'ui.grid.exporter' ,'ui.grid.pinning', 'ui.bootstrap','ui.tinymce', 'ui.select','filemanagerBtn','autoActive','knob','modalFullscreen','checkList','colorpicker.module','toaster','tree','ui.bootstrap.datetimepicker']);
var lang = 'en';
dasApp.apiBase = base_url +  'index.php/api/';
dasApp.baseUrl = base_url ;
dasApp.assetsUrl = base_url + 'assets/' ;

dasApp.constant('user',dasAppUser);
dasApp.constant('modulesDef',modulesDef);

dasApp.controller('MainController', [  "$scope", "$route", "$routeParams", "$location", "$http", "entityManager", "user", "$timeout", "$uibModal","$window","toaster", function($scope, $route, $routeParams, $location, $http,entityManager,user,$timeout,$uibModal,$window,toaster) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams; 
	$scope.permissions = [];
	$scope.base_url = base_url;
	$scope.user = user;
	$scope.$root.base_url = base_url;
	$scope.messages = [];
	$scope.status_list = [
		{status_id:'0',status_name:'Pending'},
		{status_id:'1',status_name:'Ready'},
		{status_id:'2',status_name:'Delivered'},
		{status_id:'3',status_name:'Canceled'}
	];
	 $scope.notifications ={
		 items:[],
		 count: 0
	 } ;
    var notificationsManager = new entityManager(dasApp.apiBase + 'notifications/', 'notification_id', {data: 'results'});
	var firstLoad = true;
	$scope.getNotifications = function() {
		/*notificationsManager.search([{
			field: 'notifications.is_read',
			value: '0'

		}],1,100)
			.then(function (data) {
				if(!firstLoad && data.results.length > $scope.notifications.count)
				{
					playSound(base_url + 'assets/sounds/1','#sound');
					console.log('notify');
				}
			$scope.notifications.items = data.results;
			$scope.notifications.count = data.results.length;
			$timeout($scope.getNotifications, 2000);
				firstLoad = false;
		});*/
	};
	
	//--------------- modulesDef
	$scope.modules=[];
	angular.forEach(modulesDef,function(i,j){
		if(typeof i.enabled == 'boolean' && !i.enabled)
			return; 
		 i.enabled = true;
		 $scope.modules.push(i);
	});
	//--------------- modulesDef


	$scope.convertToDate = function(stringDate,log){
		if(log)
			console.log('converting' , stringDate);
		var split1 = stringDate.split(' ');
		var dateSplit = split1[0].split('-');
		var timeSplit = split1[1].split(':');


		var dateOut = new Date(dateSplit[0],dateSplit[1]-1,dateSplit[2],timeSplit[0],timeSplit[1],timeSplit[2]);
		if(log)
			console.log('out' , dateOut);
		return dateOut;

	};
var dateConvert = $scope.convertToDate;
//	$scope.getNotifications();
	$scope.removeNotification = function(notification){ 
		var index = $scope.notifications.items.indexOf(notification);
		if(index >=0){
			//$scope.notifications.items.splice(index,1);
			//$scope.notifications.count = $scope.notifications.items.length;
			$http.post(dasApp.apiBase + 'notifications/update_status/'+notification.notification_id,{is_read:1});
		}
	};
	$scope.viewOrder = function (orderId ) {
		$http.get(dasApp.apiBase+'/orders?id='+orderId)
		.then(function(response) {
				var order = response.data;			
					var modalInstance = $uibModal.open({
						animation: $scope.animationsEnabled,
						templateUrl: dasApp.baseUrl + 'assets/dashboard/views/orders/view.html',
						size: 'lg',
						controller: ["$scope", function($scope){
							$scope. title='View Order';
								$scope.order=order;
								$scope.getTotal=function(detail){

									return parseFloat(detail.price)  *parseFloat(detail.quantity);
								};
								$scope.convertToDate = dateConvert;
								$scope.print = function(){
									w=window.open();
									
									w.document.write('<html><head><title>Shawermatac :: شاورمتك</title>');
									w.document.write('<link rel="stylesheet" href="'+dasApp.baseUrl +'assets/css/print.css?test" type="text/css" />');
									w.document.write('</head><body >');
									w.document.write(document.getElementsByClassName('order')[0].innerHTML+'<br/><h3>Order</h3>'+document.getElementsByClassName('details')[0].innerHTML);
									w.document.write('</body></html>');
									
									$timeout(function () {w.stop(); w.print(); w.close();}, 2000);  
									
								};
						}]
					});


					modalInstance.result.then(function (order) {
					}, function () {
					});
		});
    };

	$scope.change_status = function(order_id,order_status)
	{
		var ordersManager = new entityManager(dasApp.apiBase + 'orders/','order_id',{data:'results'});
		var order = {};
		order.order_status = order_status;
		$http.post(dasApp.apiBase + 'orders/update_status/'+order_id, order).then(function(response){
				toaster.pop('info', "", "Status Changed Successfully");
				$scope.getNotifications();
            },function(error){ //update failed
                
		});
	};

    var contactManager = new entityManager(dasApp.apiBase + 'contactus/','contactus_id',{data:'results'});
	$scope.getMessages = function() {
		contactManager.search([{
			field: 'contact_us.is_read',
			value: '0',

		}]).then(function (data) {
			$scope.messages = data.results;
			$timeout($scope.getMessages, 60000);
		});
	};
    $scope.getMessages();

	$scope.$on('onMessageRead',function(event,entity_id){
		$scope.getMessages();
	});
	$scope.getClass = function () {
		if ($location.path() === path) {
		return 'active';
		} else {
		return '';
		}
	};
	prepPermissions = function (){
		if($scope.permissions.length==0)
		{
			return 	$http.get(dasApp.apiBase+'/authorize/permission')
				.then(function(response) {
					$scope.permissions = response.data;
				});
		}
		else
		{
			return true;
		}
	};

	$scope.hasPermission = function (permission_group,permission_name){
		var flag=false;
		for ( i= 0; i<$scope.permissions.length; i++){
			if( $scope.permissions[i].permission_name == permission_name  && $scope.permissions[i].permission_group ==permission_group){
				flag = true;
			}
		}
		return flag;
	};
 
	// register the interceptor as a service
	

}]); 

dasApp.factory('myInterceptor', function($q,$window) {
	  return {
		// optional method
		'request': function(config) {
		  // do something on success
		  return config;
		},

		// optional method
	   'requestError': function(rejection) {
		  // do something on error
		  if(rejection.data.errors == 'UnAuthorized')
			$window.location.href= dasApp.baseUrl+'dashboard';	
			
			return $q.reject(rejection);
		},



		// optional method
		'response': function(response) {
		  // do something on success
		  return response;
		},

		// optional method
	   'responseError': function(rejection) {
		  // do something on error
		  
		  if(rejection.data.errors == 'UnAuthorized')
			$window.location.href= dasApp.baseUrl+'dashboard';	
			
			return $q.reject(rejection);
		}
	  };
	});

dasApp.config(["$routeProvider", "$locationProvider", "user","$httpProvider","modulesDef", function($routeProvider, $locationProvider,user,$httpProvider,modulesDef) {
	$httpProvider.interceptors.push('myInterceptor');

	angular.forEach(modulesDef,function(i,j){
		 setdata(i);
	});
	function setdata(pdata)
	{
		if(!pdata.sort) pdata.sort = 100;
		if(typeof pdata.enabled == 'boolean' && !pdata.enabled)
			return;
		 pdata.enabled = true;
		$routeProvider.when(pdata.href, {
			templateUrl: base_url +  'assets/dashboard/views/'+pdata.viewfolder+'/index.html',
			controller: 'modelsController',
			resolve: {
				data : function(){ return   pdata  ; }
			}
		});	
	}
	/* ---------------------------------------------------------------------------------------------------- */

	$routeProvider
	.when('/', {
		/* templateUrl: base_url +  'assets/dashboard/views/dashboard/index.html',
	    controller: 'dashboardController',
		label: 'Dashboard' */
		templateUrl: base_url + 'assets/dashboard/views/biography/index.html',
		controller: 'biographyController',
		resolve: {
			isEdit: function () {
				return false;
			},
			prepPermissions: function () {
				return true;
			}
		}
	}) ;
if(user.is_admin) {
	$routeProvider.when('/users', {
		templateUrl: base_url + 'assets/dashboard/views/users/index.html',
		controller: 'usersController',
		resolve: {
			isEdit: function () {
				return false;
			},
			prepPermissions: function () {
				return true;
			}
		}

	});
	$routeProvider.when('/biography', {
		templateUrl: base_url + 'assets/dashboard/views/biography/index.html',
		controller: 'biographyController',
		resolve: {
			isEdit: function () {
				return false;
			},
			prepPermissions: function () {
				return true;
			}
		}
	});
	
	$routeProvider.when('/users/:members', {
		templateUrl: base_url + 'assets/dashboard/views/users/index.html',
		controller: 'usersController',
		resolve: {
			isEdit: function () {
				return false;
			},
			prepPermissions: function () {
				return true;
			}
		}
	});
	$routeProvider.when('/groups', {
		templateUrl: base_url + 'assets/dashboard/views/groups/index.html',
		controller: 'groupsController',
		resolve: {
			isEdit: function () {
				return false;
			},
			prepPermissions: function () {
				return true;
			}
		}

	});
	$routeProvider.when('/broadcasts', {
		templateUrl: base_url + 'assets/dashboard/views/broadcasts/index.html',
		controller: 'broadcastsController'
	});
}
	$routeProvider.when('/branches', {
		templateUrl: base_url +  'assets/dashboard/views/branches/index.html',
		controller: 'branchesController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}

	});

	

	


	
	$routeProvider.when('/sections', {
		templateUrl: base_url +  'assets/dashboard/views/sections/index.html',
		controller: 'sectionsController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	$routeProvider.when('/sections/:section_id', {
		templateUrl: base_url +  'assets/dashboard/views/pages/index.html',
		controller: 'pagesController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	$routeProvider.when('/pages', {
		templateUrl: base_url +  'assets/dashboard/views/pages/index.html',
		controller: 'pagesController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});

	$routeProvider.when('/sliders', {
		templateUrl: base_url +  'assets/dashboard/views/sliders/index.html',
		controller: 'slidersController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	 
	$routeProvider.when('/menu', {
		templateUrl: base_url +  'assets/dashboard/views/menu/index.html',
		controller: 'menusController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	
	$routeProvider.when('/categories', {
		templateUrl: base_url +  'assets/dashboard/views/categories/index.html',
		controller: 'categoriesController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	$routeProvider.when('/products', {
		templateUrl: base_url +  'assets/dashboard/views/products/index.html',
		controller: 'productsController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	
	$routeProvider.when('/contactus', {
		templateUrl: base_url +  'assets/dashboard/views/contactus/index.html',
		controller: 'contactusController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	$routeProvider.when('/contactus/:feedback', {
		templateUrl: base_url +  'assets/dashboard/views/contactus/index.html',
		controller: 'contactusController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});

	$routeProvider.when('/newsletter-issues', {
		templateUrl: base_url +  'assets/dashboard/views/newsletter_issues/index.html',
		controller: 'newsletterIssuesController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	
	$routeProvider.when('/magazines', {
		templateUrl: base_url +  'assets/dashboard/views/magazines/index.html',
		controller: 'magazinesController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	
	
	
	$routeProvider.when('/press_release', {
		templateUrl: base_url +  'assets/dashboard/views/press_release/index.html',
		controller: 'pressReleaseController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	
	$routeProvider.when('/image_gallery', {
		templateUrl: base_url +  'assets/dashboard/views/image_gallery/index.html',
		controller: 'imageGalleryController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	$routeProvider.when('/video_gallery', {
		templateUrl: base_url +  'assets/dashboard/views/video_gallery/index.html',
		controller: 'videoGalleryController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	
	$routeProvider.when('/blog', {
		templateUrl: base_url +  'assets/dashboard/views/blog/index.html',
		controller: 'blogController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	
	
	$routeProvider.when('/newsletter-subscribes', {
		templateUrl: base_url +  'assets/dashboard/views/newsletter_subscribes/index.html',
		controller: 'NewsletterSubscribesController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});
	$routeProvider.when('/menu_items', {
		templateUrl: base_url +  'assets/dashboard/views/menu_items/index.html',
		controller: 'menuItemsController',
		resolve: {
			isEdit: function () { return false; },
			prepPermissions : function(){ return  true; }
		}
	});

	
	
	$routeProvider.otherwise(
	{/* 
		templateUrl: base_url +  'assets/dashboard/views/dashboard/index.html',
			controller: 'dashboardController',
		label: 'Dashboard' */
		templateUrl: base_url + 'assets/dashboard/views/biography/index.html',
		controller: 'biographyController',
		resolve: {
			isEdit: function () {
				return false;
			},
			prepPermissions: function () {
				return true;
			}
		}
	});
}]);



 function copy_object (item)
{
	item.$$is_editing = true;
	item.$$clone = angular.copy(item);
	return item;
}

 function save_copy(item)
{
	item.$$is_editing = false;
	delete item.$$clone ;
	return item;
}

 function delete_copy(item)
{
	item.$$is_editing = false;
		 angular.forEach(item.$$clone, function(i,j){
			 if(j.startsWith('$$'))
			 	return;
			 item[j] = i;
		 });
		 delete item.$$clone;
	return item;
}

function playSound(filename,element){
	$(element).html('<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>');
}

