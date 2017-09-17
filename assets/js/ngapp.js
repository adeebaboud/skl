(function() {
    angular.module('customField', []) 
        .directive('customField', ["$compile", "$timeout", function($compile,$timeout) {
            return {
                restrict: 'AE',
                require: 'ngModel', 
                link: function(scope, element, attr, ngModel) {
                    var unregister = scope.$watch(function() {
                        return ngModel.$modelValue;
                    }, initialize);

                    function initialize(value) {
                        var fieldOptions = ngModel.$viewValue;
                        if (value && fieldOptions.field_attributes) {
                            try {
                                var fieldAttr = JSON.parse(fieldOptions.field_attributes);  
                                $(element).html('');
                                if (fieldOptions.field_type == 'input') {
                                     generateElem = '<div class="">' + '<input type="text" name="' + fieldAttr.name + '" class="'+ fieldAttr.class +'" ng-model="Field.value" id="'+fieldAttr.id+'"/>' + '</div>'; 
                                     element.html(generateElem);
                                     $compile(element.contents())(scope)
                                } else if (fieldOptions.field_type == 'filepicker') {
                                    generateElem = '<div class="input-group">' + '<input type="text" name="' + fieldAttr.name + '" class="'+ fieldAttr.class + '" ng-model="Field.value" id="'+fieldAttr.id+'"/>' + '<span class="input-group-btn"><a class="btn btn-primary" filemanager-btn="' + fieldAttr.id + '"><i class="fa fa-key fa-fw"></i></a></span></div>'; 
                                        element.html(generateElem);
                                        $compile(element.contents())(scope)
                                } else if (fieldOptions.field_type == 'editor') {
									generateElem = '<textarea ng-model="Field.value" class="'+ fieldAttr.class + '" ui-tinymce name="' + fieldAttr.name + '" id="' + fieldOptions.name + '"></textarea>';
                                    element.html(generateElem);  
                                    $compile(element.contents())(scope);
                                }  
                                 //unregister();
                            } catch (e) {
                                 return;
                            }
                        }
                    }
                }
            }
        }]);
}());

(function($, ng) {
	'use strict';

    var $val = $.fn.val; // save original jQuery function

    // override jQuery function
    $.fn.val = function(value) {
        // if getter, just return original
        if (!arguments.length) {
             return $val.call(this);
        }

        // get result of original function
        var result = $val.call(this, value);

        // trigger angular input (this[0] is the DOM object)
        ng.element(this[0]).triggerHandler('input');

         // return the original result
         return result;
    }
})(window.jQuery, window.angular);
 
(function() {
    angular.module('filemanagerBtn', [])
        .directive('filemanagerBtn', ["$timeout", "$compile", function($timeout,$compile) {
            return {
                restrict: 'A',
				scope	: {target_txtbx:'@filemanagerBtn'},
                link: function(scope, element, attr) {
                    //var target_txtbx =$compile( $(element).attr("filemanager-btn"))(scope);
                    $(element).attr("href", base_url + "assets/js/filemanager/dialog.php?type=2&field_id=" + scope.target_txtbx);

                    $(element).fancybox({
                        'width': 900,
                        'height': 700,
                        'type': 'iframe',
                        'autoScale': false,
                        afterClose: function() {
                            var txtbx = $('#' + scope.target_txtbx);
                            if (txtbx.length > 0)
                                angular.element(txtbx[0]).triggerHandler('input');
                        }
                    });
                }
            };
        }]);
}());

(function() {
    angular.module('knob', [])
        .directive('knob',
            function() {
        return {
            link : function (scope, element, attr) {

                function draw() {
                    element.empty();

                    var tmpl = $('<input type="text" >');

                    var min = attr.min ? parseInt(attr.min) : 0;
                    var max = attr.max ? parseInt(attr.max) : 0;
                    var val = attr.value ? parseInt(attr.value) : "";
                    var readonly = attr.readonly == "true" ? true : false;
                    var sign = attr.sign ? attr.sign : "";
                    var fgColor = attr.color ? attr.color : "#00A65A"; //green - success

                    var dangerLimit = attr.dangerLowerThen;
                    var warnLimit = attr.warnLowerThen;

                    if (dangerLimit && val < dangerLimit) {
                        fgColor = "#F56954"; //red - danger
                    } else if (warnLimit && val < warnLimit) {
                        fgColor = "#F39C12"; //yellow - warning
                    }

                    element.append(tmpl);

                    var options = {
                        value: 0,
                        min: min,
                        max: max > val ? max : val,
                        dynamicDraw: true,
                        width:60,
                        height:60,
                        fgColor: fgColor,
                        readOnly: readonly,
                        rtl: (attr.dir == 'rtl' ? true : false),
                        draw: function () {
                            $(this.i).val(this.cv + sign);
                        }
                    };
                    tmpl.knob(options);
                    $(element).find('input')
                        .css('margin-left',0)
                        .css('margin-top',0)
                        .css('margin-top',0)
                        .css('left',0)
                        .css('top','24%')
                        .css('width','100%') ;
                    $(element).parent().css('position','relative');
                    tmpl.animate({
                        value: 100
                    }, {
                        duration: 1000,
                        easing: 'swing',
                        progress: function () {
                            $(this).val(Math.round(this.value / 100 * val)).trigger('change');
                        }
                    })

                }

                scope.$watch(function () {
                    return [attr.value, attr.max, attr.min, attr.readonly];
                }, draw, true);

            }
        };
});
}());


(function() {
    angular.module('autoActive', [])
        .directive('autoActive', ['$location',
            function($location) {
                return {
                    restrict: 'A',
                    scope: false,
                    link: function(scope, element) {
                        function setActive() {
                            var path = $location.path();
                            if (path) {
                                angular.forEach(element.find('li'), function(li) {
                                    var anchor = li.querySelector('a');
                                    if(anchor == null) return ;
                                    if (anchor.href.match('#' + path + '(?=\\?|$)')) {
                                        angular.element(li).addClass('active');
									} else {
                                        angular.element(li).removeClass('active');
                                    }
                                });
                            }
                        }
                        setActive();
						scope.$on('$locationChangeSuccess', setActive);
                    }
                }
            }
        ]);
}());
 
 
/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
 
(function() {
angular.module('ui.tinymce', [])
   .value('uiTinymceConfig', {})
   .directive('uiTinymce', ['uiTinymceConfig', function(uiTinymceConfig ) {
		uiTinymceConfig = uiTinymceConfig || {};
		var generatedIds = 0;
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ngModel) {
				console.log('tinymce created');
				var expression, options, tinyInstance;
				var elemId = 'uiTinymce' + generatedIds++;
				// generate an ID if not present
				if (!attrs.id) {
					attrs.$set('id', elemId);
					
				}
				elm.addClass(elemId);
				options = {
					// Update model when calling setContent (such as from the source editor popup)
					setup: function(ed) {
						ed.on('init', function(args) {
							ngModel.$render();
							 
						});
						// Update model on button click
						ed.on('ExecCommand', function(e) {
							ed.save();
							ngModel.$setViewValue(elm.val());
							if (!scope.$$phase) {
								scope.$apply();
							}
							setTimeout(function() {
								$("#"+$(e.currentTarget).data("id")).change() ;
							}); 
						});
						// Update model on keypress
						ed.on('KeyUp', function(e) { 
							ed.save();
							ngModel.$setViewValue(elm.val());
							if (!scope.$$phase) {
								scope.$apply();
							}
							setTimeout(function() {
								$("#"+$(e.currentTarget).data("id")).change() ;
							}); 
						});
					},
					relative_urls: false,
					mode: 'specific_textareas',
					editor_selector: elemId,
					//elements: attrs.id,
					height: 200,
					theme: "modern",
					plugins: [
						"advlist autolink link image lists charmap print preview hr anchor pagebreak",
						"searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
						"table contextmenu directionality emoticons paste textcolor code responsivefilemanager template"
					],
                    // link_list:  base_url + "assets/list_links.php",
					toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect | visualblocks template",
					toolbar2: "| responsivefilemanager | link unlink anchor | image media | forecolor backcolor  | print preview code ",
					image_advtab: true,
					visualblocks_default_state: true,
                    link_class_list: [
                            {title: 'None', value: ''},
                            {title: 'link', value: 'link'}
                        ],
					templates: [
						{title: 'cultural council', description: 'cultural council page layout', url: base_url+"assets/templates/council-page.html"},
						{title: 'pricing policies', description: 'pricing policies page layout', url: base_url+"assets/templates/pricing-policies.html"},
						{title: 'artistic activities', description: 'artistic activities page layout', url: base_url+"assets/templates/artistic-activities.html"},
						{title: 'nursery school', description: 'nursery school page layout', url: base_url+"assets/templates/nursery-school.html"},
						{title: 'page fullwidth', description: 'page fullwidth page layout', url: base_url+"assets/templates/page-fullwidth.html"},
						{title: 'business leadership', description: 'business leadership page layout', url: base_url+"assets/templates/business-leadership.html"}
					],
					external_filemanager_path: base_url+"assets/js/filemanager/",
					filemanager_title: "Filemanager",
					external_plugins: {
						   "filemanager": base_url+"assets/js/filemanager/plugin.min.js"
					}
				};
				if (attrs.uiTinymce) {
					expression = scope.$eval(attrs.uiTinymce);
				} else {
					expression = {};
				}
				angular.extend(options, uiTinymceConfig, expression);
				tinymce.remove(); 
				setTimeout(function() {
					tinymce.baseURL = base_url+"assets/js/tinymce/";
					tinymce.init(options);
					ngModel.$render = function() {
						if (!tinyInstance) {
							tinyInstance = tinymce.get(attrs.id);
						}
						if (tinyInstance) {
							tinyInstance.setContent(ngModel.$viewValue || '');
						}
					};
				});
			}
		};
	}]); 
}()); 

(function() {
    angular.module('spinner', [])
        .directive('spinner', function() {
            return {
                restrict: 'A',
				link: function(scope, element, attr) {
					$(element).spinner();
				}
			};
		});
}());

(function() {
    angular.module('modalFullscreen', [])
        .directive('modalFullscreen', function() {
            return {
                restrict: 'AE',
				link: function(scope, element, attr) {
                    var tmpl = $('<i class="fa fa-expand"></i>');
                    element.append(tmpl);
                    element.addClass('modal-full-btn')
                    element.bind('click', function() {
                        element.parent().parent().parent().toggleClass('modal-full');
                        return false;
                    });
                }
			};
		});
}());

(function() {
    angular.module('switcher', [])
        .directive('switcher', function() {
            return {
                restrict: 'A',
				link: function(scope, element, attr) {
						var switchery = new Switchery($(element)[0], { color: attr.switcherColor ? attr.switcherColor :'#41b7f1'  });
				}
			};
		});
}());

/* angular-load.js / v0.3.0 / (c) 2014, 2015 Uri Shaked / MIT Licence */

(function () {
    'use strict';
    angular.module('angularLoad', [])
        .service('angularLoad', ['$document', '$q', '$timeout', function ($document, $q, $timeout) {
            var document = $document[0];

            function loader(createElement) {
                var promises = {};
				
                return function(url) {
                    if (typeof promises[url] === 'undefined') {
                        var deferred = $q.defer();
                        var element = createElement(url);

                        element.onload = element.onreadystatechange = function (e) {
                            $timeout(function () {
                                deferred.resolve(e);
                            });
                        };
                        element.onerror = function (e) {
                            $timeout(function () {
                                deferred.reject(e);
                            });
                        };

                        promises[url] = deferred.promise;
                    }

                    return promises[url];
                };
            }

            /**
             * Dynamically loads the given script
             * @param src The url of the script to load dynamically
             * @returns {*} Promise that will be resolved once the script has been loaded.
             */
            this.loadScript = loader(function (src) {
                var script = document.createElement('script');

                script.src = src;

                document.body.appendChild(script);
                return script;
            });

            /**
             * Dynamically loads the given CSS file
             * @param href The url of the CSS to load dynamically
             * @returns {*} Promise that will be resolved once the CSS file has been loaded.
             */
            this.loadCSS = loader(function (href) {
                var style = document.createElement('link');

                style.rel = 'stylesheet';
                style.type = 'text/css';
                style.href = href;

                document.head.appendChild(style);
                return style;
            });
        }]);
})();

 angular.module('checkList', []).directive('checkList', function() {
  return {
    scope: {
      list: '=checkList',
      value: '@'
    },
    link: function(scope, elem, attrs) {
      var handler = function(setup) {
        var checked = elem.prop('checked');
        var index = scope.list.indexOf(scope.value);

        if (checked && index == -1) {
          if (setup) elem.prop('checked', false);
          else scope.list.push(scope.value);
        } else if (!checked && index != -1) {
          if (setup) elem.prop('checked', true);
          else scope.list.splice(index, 1);
        }
      };

      var setupHandler = handler.bind(null, true);
      var changeHandler = handler.bind(null, false);

      elem.bind('change', function() {
        scope.$apply(changeHandler);
      });
      scope.$watch('list', setupHandler, true);
    }
  };
});


(function() {
    angular.module('tree', [])
        .directive('treeItem',function(){
              return {
                restrict: 'AE',
                link: function(scope, element, attr) {
                     element.addClass('treeItem');
                    // '<div tree list="'+childrenName+'" child="'+childrenName+'" display="'+displayName+'"></div>'
                }
              };
        })
        .directive('tree', ["$compile"  , function($compile   ) {
            return {
                restrict: 'AE',
                scope:{
                    list :      '@',
                    selectedItemChanged : '=',
                    listItems : '=list',
                    displayPropertyName:    '@display',
                    childPropertyName :     '@child'
                },
				link: function(scope, element, attr) { 
                   
                    scope.$watch ('listItems' ,function(newListItems,oldListItems){
                       
                        if(newListItems.length == 0){
                            return;
                        }
                        element.html('');
                        var tmpl = $('<ul class="tree"><li class="treeItem" ng-repeat="child in listItems" ng-class="{hasItems : child[childPropertyName].length > 0}"><a href="#" >{{child[displayPropertyName]}}</a>'
                        +   '<tree list="child[childPropertyName]" selected-item-changed="selectedItemChanged" display="'+scope.displayPropertyName+'" child="'+scope.childPropertyName+'"></tree>'

                        + '</li></ul>');
                        element.append(tmpl); 
                        
                        $compile(element.contents())(scope) ;
                        $(element).bind('click','a',function(e){ 
                            if(!$(e.target).parent('li').length){
                                return false;
                            }
                            if(typeof scope.selectedItemChanged == "function")
                                scope.selectedItemChanged( angular.element( e.target).scope().child);
                            $(e.target).parent('li').toggleClass('expand');
                            $("tree .active").removeClass('active');
                            $(e.target).parent('li').addClass('active');
                            return false;
                        });
                    },true); 
                },
                controller: function($scope){

                }
			};
		}]);
}());
;		/* ---------------------------------------------------------------------------------------------------- */
	/*
		{
			href:'/url',title:'Title',icon: "dashboard",
            apiname:'apiname',viewfolder:'models',tablename:'tablename',
            managers:{categories:{name:'categories',id:'id' },
            image_gallery:{name:'image_gallery',id:'id' },
            lookups:{name:'lookups',id:'id',filter:[{field: 'lookups.type_id',value:'2',op: 'eq'}] } } ,
            allowadd:false,allowrefresh:false,allowview:true,
            enabled : true ,
            sort:1,
			tabs:[
				{
					name:'Info' ,fields:[
					{field:'full_name',name:'Full Name',type:'text' ,search:true },
					{field:'email',name:'Email',type:'email'},
					{field:'phone',name:'Phone',type:'text'},
					{field:'guest_number',name:'Guest Number',type:'text'},
					{field:'from_date',name:'From Date',type:'datetime'},
					{field:'status',name:'Status',type:'checkbox'},
					{field:'description',name:'Description',type:'textarea'}
                    {field:'parent_id',name:'Parent',type:'ui-select',
                        managername:'categories',managerid:'id',showfields:['name_en','name_ar'],searchfields:[{
                                                                            field: 'categories.name_en',
                                                                            op: 'like'
                                                                        },{
                                                                            field: 'categories.name_ar',
                                                                            op: 'orlike'
                                                                        }]
                        },
					grids:[
						{name:'table' ,field:'reserve_tables' ,
						 fields:[
							{field:'full_name',name:'Full Name',type:'text' },
							{field:'email',name:'Email',type:'email'},
							{field:'phone',name:'Phone',type:'text'},
							{field:'guest_number',name:'Guest Number',type:'text'},
							{field:'from_date',name:'From Date',type:'datetime'},
							{field:'status',name:'Status',type:'checkbox'},
							{field:'description',name:'Description',type:'textarea'}
						]}
					]
					]}
			]
		}
	 */


var modulesDef = {

};

  ;var dasApp = angular.module('dasApp' ,  ['ngRoute', 'ui.grid', 'ui.grid.pagination','ui.grid.treeView' ,'ui.grid.resizeColumns' ,'ngSanitize',
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

;dasApp.factory('entity', ['$http', function($http) {  
    function ent(entityData) {
        if (entityData) {
            this.setData(entityData);
        }
        // Some other initializations related to menus
    };
    ent.prototype = {
        setData: function(entityData) {
            angular.extend(this, entityData);
        },
       
        isPublished: function() {
            return true;
        }
    };
    return ent;
}]);

dasApp.factory('entityManager', ['$http', '$q', 'entity','$window','toaster', function($http, $q, entity,$window,toaster) { 
return function(api,primaryKey,options){
    var entityManager = {
        _pool: {},
        filters:[],
        options: {
            data: 'results',
            count: 'count',
            page: 'page',
            perPage: 'perPage'
        },
        _retrieveInstance: function(entity_id, entityData) {
            var instance = this._pool[entity_id];

            if (instance) {
                instance.setData(entityData);
            } else {
                instance = new entity(entityData);
                this._pool[entity_id] = instance;
            }

            return instance;
        },
        _search: function(a) {
            return this._pool[a];
        },
        _load: function(entity_id, deferred) {
            var scope = this;

            $http.get( api + '?' +primaryKey + '=' + entity_id)
                .success(function(entityData) {
                    var Data = scope._retrieveInstance(entityData[primaryKey], entityData);
                    deferred.resolve(Data);
                })
                .error(function() {
                    deferred.reject();
                });
        },
        /* Public Methods */
        data:function(){
            return this._pool;
        },
        search:function(filters,pageNumber,pageSize){
            var that = this;
            this.clearFilters();
            angular.forEach(filters,function(i){
                that.addFilter(i.field, i.value, i.op);
            });
            if(pageNumber==undefined)
                pageNumber=1;
            if(pageSize==undefined)
                pageSize=10;

            return this.loadAll(pageNumber,pageSize);
        },
		addFilter: function(field,value,op){
            this.filters.push({field: field, value:value,op:op ? op : 'eq'});
        },
        clearFilters:function(){
            this.filters=[];
        },
        getItem: function(entity_id) {
            var deferred = $q.defer();
            var Data = this._search(entity_id);
            if (Data) {
                deferred.resolve(Data);
            } else {
                this._load(entity_id, deferred);
            }
            return deferred.promise;
        },
		delete: function(entity_id) {
            return $http.get(api + 'delete/?id=' + entity_id).success(function(response) {
				toaster.pop('error', "", "Item Deleted Successfully");
			});
			
        },
        add: function(data){
            var deferred = $q.defer();
            $http.post(api ,data)
                .success(function(response) {
					toaster.pop('success', "", "Item Added Successfully");
					deferred.resolve(response);
                })
                .error(function(errorResponse) {
					
                    deferred.reject(errorResponse);
					if(errorResponse.errors == 'UnAuthorized')
						$window.location.href= dasApp.baseUrl+'dashboard';	
                });
            return deferred.promise;
        },
        update: function(data,entity_id) {
            var deferred = $q.defer();
            $http.post(api+'update/'+entity_id, data) .success(function(response) {
					toaster.pop('info', "", "Item Updated Successfully");
                    deferred.resolve(response);
                })
                .error(function(errorResponse) {
                    deferred.reject(errorResponse);
					
                });
            return deferred.promise;
        },
        /* Use this function in order to get instances of all the menu */
        loadAll: function(pageNumber,pageSize) {
            var deferred = $q.defer();
            var scope = this;
            var requestUrl = api+'?';
            if(pageNumber === undefined)
                pageNumber=1;

            requestUrl += '&page_number=' + pageNumber;

            if(pageSize === undefined)
                pageSize = 10;

            requestUrl += '&page_size=' + pageSize;
            if(this.filters.length>0)
            {
                requestUrl += '&filter=' + encodeURIComponent(JSON.stringify(this.filters));
            }

            $http.get(requestUrl )
                .success(function(response) {
                    var Data = [];
					response[scope.options.data] || (response[scope.options.data]=response) ;
                    response[scope.options.data].forEach(function(entityData) {
                        var dat = scope._retrieveInstance(entityData[primaryKey], entityData);
                        Data.push(dat);
                    });
					response[scope.options.data] = Data;
                    deferred.resolve(response);
                })
                .error(function(err) {
                    deferred.reject(err);
					
                });
            return deferred.promise;
        },
        /*  This function is useful when we got somehow the menu data and we wish to store it or update the pool and get a menu instance in return */
        setItem: function(entityData) {
            var scope = this;
            var dat = this._search(entityData[primaryKey]);
            if (dat) {
                dat.setData(entityData);
            } else {
                dat = scope._retrieveInstance(entityData);
            }
            return dat;
        },

    };
    if(options){
        angular.forEach(options,function(i,j){
             if(entityManager.options[j]!==undefined)
                entityManager.options[j] = i;
        });
    }
    return entityManager;
	}
}]);
;dasApp.controller('NewsletterSubscribesController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
$scope.title="Newsletter Subscribes";
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
                 '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Category" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }


        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

               $scope.isLoading.grid = true;
                newsletter_subscribesManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
	$scope.isLoading.grid = true;
    var newsletter_subscribesManager = new entityManager(dasApp.apiBase + 'Newslettersubscribes/','newsletter_subscribe_id',{data:'results'});
    newsletter_subscribesManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
		$scope.isLoading.grid = false;
    });
	
	 $scope.refreshGrid = function(){
             $scope.isLoading.grid = true;
            newsletter_subscribesManager.loadAll().then(function(data){
                $scope.gridOptions.data = data.results;
                $scope.gridOptions.totalItems = data.total;
                $scope.isLoading.grid = false;
            });
      
    };
	
	$scope.view = function (entity ) {
		if(entity.is_edit != '1'){
            var message = {};
            message.is_read = '1';
            $http.post(dasApp.apiBase + 'Newslettersubscribes/update_status/'+entity.newsletter_subscribe_id, message).then(function(response){
                entity.is_read = '1';
                $scope.$emit('onMessageRead',entity.newsletter_subscribe_id);
            },function(error){ //update failed

            });
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/newsletter_subscribes/view.html',
            size: 'lg',
            controller: ["$scope", function($scope){
                $scope. title=entity.sender_email;
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
        newsletter_subscribesManager.delete(message.newsletter_subscribe_id) .then(function(response){
			console.log(response.data.success);
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
;
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

}]);;

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
}]);;
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
 ;dasApp.controller('addImageGalleryController', ["$scope", "entityManager", "$uibModalInstance", "model", "options", "modelManager", function ($scope, entityManager, $uibModalInstance,model,options,modelManager) {
    $scope.title=options.title;
    $scope.model = model;
	$scope.isLoading ={
        grid:false
	};
    
	$scope.addImage = function () {
        if(!$scope.model.images)
            $scope.model.images = [];

        $scope.model.images.push({
            title_en: '',
            title_ar:'',
            description_en: '',
			description_ar: '',
			photo_en: '',
			photo_ar: '',
			sort: 1,
            $$is_editing : true
        });
    };

    $scope.editImage = function (item) {
        item.$$is_editing = true;
        item.$$clone = angular.copy(item);
    };

    $scope.saveImage = function (item) {
        item.$$is_editing = false;
        delete item.$$clone ;
    };

    $scope.cancelImage = function (item) {
        item.$$is_editing = false;
        angular.forEach(item.$$clone, function(i,j){
            if(j.startsWith('$$'))
                return;
            item[j] = i;
        });
        delete item.$$clone;
    };

    $scope.removeImage = function (item) {
        var index = $scope.model.images.indexOf(item);
        if(index >=0)
            $scope.model.images.splice(index, 1);
    };

    $scope.ok = function () {
		$scope.isLoading.grid = true;
	
        if(options.isEdit == true)
        {
			
            modelManager.update($scope.model,$scope.model.id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.model = save_copy($scope.model);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
	

            });
        }
        else
        {
            modelManager.add($scope.model) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.model = save_copy($scope.model);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
	
                //angular.forEach(error.errors,function(i,j){ $scope.errors += '<p>'+<p>; });
            });
        }
    };
 
    /**
     * move Image up
     * @param image
     */
    $scope.imageSortUp = function(image){
		var index = $scope.model.images.indexOf(image);
		if(index == 0) return;
		var temp = $scope.model.images[index];
		$scope.model.images[index] = $scope.model.images[index-1]
		$scope.model.images[index-1] = temp;
    }; 

    /**
     * Move Image down
     * @param image
     */
    $scope.imageSortDown = function(image){
		
		var index = $scope.model.images.indexOf(image);
		if(index ==  $scope.model.images.length -1 ) return;
		var temp = $scope.model.images[index];
		$scope.model.images[index] = $scope.model.images[index+1]
		$scope.model.images[index+1] = temp;
		

    };


    $scope.cancel = function (item) {
		$uibModalInstance.dismiss('cancel');
    };
}]);
;dasApp.controller('addMenuController', ["$scope", "entityManager", "$uibModalInstance", "menu", "options", "menuManager", function ($scope, entityManager, $uibModalInstance,menu,options,menuManager) {
    $scope.title=options.title;
    $scope.allIcons = [  "fort-awesome lg valign-baseline",  "font-awesome",  "bars lg",  "caret-down",  "flag fw",  "wheelchair-alt fw",  "camera-retro fw",  "universal-access fw",  "hand-spock-o fw",  "ship fw",  "venus fw",  "file-image-o fw",  "spinner fw",  "check-square fw",  "credit-card fw",  "pie-chart fw",  "won fw",  "file-text-o fw",  "arrow-right fw",  "play-circle fw",  "facebook-official fw",  "medkit fw",  "universal-access",  "shopping-cart margin-right-sm hidden-sm hidden-md",  "flag",  "envelope",  "search",  "american-sign-language-interpreting",  "asl-interpreting",  "assistive-listening-systems",  "audio-description",  "blind",  "braille",  "deaf",  "deafness",  "envira",  "fa",  "first-order",  "gitlab",  "glide",  "glide-g",  "google-plus-circle",  "google-plus-official",  "hard-of-hearing",  "instagram",  "low-vision",  "pied-piper",  "question-circle-o",  "sign-language",  "signing",  "snapchat",  "snapchat-ghost",  "snapchat-square",  "themeisle",  "viadeo",  "viadeo-square",  "volume-control-phone",  "wheelchair-alt",  "wpbeginner",  "wpforms",  "yoast",  "adjust",  "anchor",  "archive",  "area-chart",  "arrows",  "arrows-h",  "arrows-v",  "asterisk",  "at",  "automobile",  "balance-scale",  "ban",  "bank",  "bar-chart",  "bar-chart-o",  "barcode",  "bars",  "battery-0",  "battery-1",  "battery-2",  "battery-3",  "battery-4",  "battery-empty",  "battery-full",  "battery-half",  "battery-quarter",  "battery-three-quarters",  "bed",  "beer",  "bell",  "bell-o",  "bell-slash",  "bell-slash-o",  "bicycle",  "binoculars",  "birthday-cake",  "bluetooth",  "bluetooth-b",  "bolt",  "bomb",  "book",  "bookmark",  "bookmark-o",  "briefcase",  "bug",  "building",  "building-o",  "bullhorn",  "bullseye",  "bus",  "cab",  "calculator",  "calendar",  "calendar-check-o",  "calendar-minus-o",  "calendar-o",  "calendar-plus-o",  "calendar-times-o",  "camera",  "camera-retro",  "car",  "caret-square-o-down",  "caret-square-o-left",  "caret-square-o-right",  "caret-square-o-up",  "cart-arrow-down",  "cart-plus",  "cc",  "certificate",  "check",  "check-circle",  "check-circle-o",  "check-square",  "check-square-o",  "child",  "circle",  "circle-o",  "circle-o-notch",  "circle-thin",  "clock-o",  "clone",  "close",  "cloud",  "cloud-download",  "cloud-upload",  "code",  "code-fork",  "coffee",  "cog",  "cogs",  "comment",  "comment-o",  "commenting",  "commenting-o",  "comments",  "comments-o",  "compass",  "copyright",  "creative-commons",  "credit-card",  "credit-card-alt",  "crop",  "crosshairs",  "cube",  "cubes",  "cutlery",  "dashboard",  "database",  "desktop",  "diamond",  "dot-circle-o",  "download",  "edit",  "ellipsis-h",  "ellipsis-v",  "envelope-o",  "envelope-square",  "eraser",  "exchange",  "exclamation",  "exclamation-circle",  "exclamation-triangle",  "external-link",  "external-link-square",  "eye",  "eye-slash",  "eyedropper",  "fax",  "feed",  "female",  "fighter-jet",  "file-archive-o",  "file-audio-o",  "file-code-o",  "file-excel-o",  "file-image-o",  "file-movie-o",  "file-pdf-o",  "file-photo-o",  "file-picture-o",  "file-powerpoint-o",  "file-sound-o",  "file-video-o",  "file-word-o",  "file-zip-o",  "film",  "filter",  "fire",  "fire-extinguisher",  "flag-checkered",  "flag-o",  "flash",  "flask",  "folder",  "folder-o",  "folder-open",  "folder-open-o",  "frown-o",  "futbol-o",  "gamepad",  "gavel",  "gear",  "gears",  "gift",  "glass",  "globe",  "graduation-cap",  "group",  "hand-grab-o",  "hand-lizard-o",  "hand-paper-o",  "hand-peace-o",  "hand-pointer-o",  "hand-rock-o",  "hand-scissors-o",  "hand-spock-o",  "hand-stop-o",  "hashtag",  "hdd-o",  "headphones",  "heart",  "heart-o",  "heartbeat",  "history",  "home",  "hotel",  "hourglass",  "hourglass-1",  "hourglass-2",  "hourglass-3",  "hourglass-end",  "hourglass-half",  "hourglass-o",  "hourglass-start",  "i-cursor",  "image",  "inbox",  "industry",  "info",  "info-circle",  "institution",  "key",  "keyboard-o",  "language",  "laptop",  "leaf",  "legal",  "lemon-o",  "level-down",  "level-up",  "life-bouy",  "life-buoy",  "life-ring",  "life-saver",  "lightbulb-o",  "line-chart",  "location-arrow",  "lock",  "magic",  "magnet",  "mail-forward",  "mail-reply",  "mail-reply-all",  "male",  "map",  "map-marker",  "map-o",  "map-pin",  "map-signs",  "meh-o",  "microphone",  "microphone-slash",  "minus",  "minus-circle",  "minus-square",  "minus-square-o",  "mobile",  "mobile-phone",  "money",  "moon-o",  "mortar-board",  "motorcycle",  "mouse-pointer",  "music",  "navicon",  "newspaper-o",  "object-group",  "object-ungroup",  "paint-brush",  "paper-plane",  "paper-plane-o",  "paw",  "pencil",  "pencil-square",  "pencil-square-o",  "percent",  "phone",  "phone-square",  "photo",  "picture-o",  "pie-chart",  "plane",  "plug",  "plus",  "plus-circle",  "plus-square",  "plus-square-o",  "power-off",  "print",  "puzzle-piece",  "qrcode",  "question",  "question-circle",  "quote-left",  "quote-right",  "random",  "recycle",  "refresh",  "registered",  "remove",  "reorder",  "reply",  "reply-all",  "retweet",  "road",  "rocket",  "rss",  "rss-square",  "search-minus",  "search-plus",  "send",  "send-o",  "server",  "share",  "share-alt",  "share-alt-square",  "share-square",  "share-square-o",  "shield",  "ship",  "shopping-bag",  "shopping-basket",  "shopping-cart",  "sign-in",  "sign-out",  "signal",  "sitemap",  "sliders",  "smile-o",  "soccer-ball-o",  "sort",  "sort-alpha-asc",  "sort-alpha-desc",  "sort-amount-asc",  "sort-amount-desc",  "sort-asc",  "sort-desc",  "sort-down",  "sort-numeric-asc",  "sort-numeric-desc",  "sort-up",  "space-shuttle",  "spinner",  "spoon",  "square",  "square-o",  "star",  "star-half",  "star-half-empty",  "star-half-full",  "star-half-o",  "star-o",  "sticky-note",  "sticky-note-o",  "street-view",  "suitcase",  "sun-o",  "support",  "tablet",  "tachometer",  "tag",  "tags",  "tasks",  "taxi",  "television",  "terminal",  "thumb-tack",  "thumbs-down",  "thumbs-o-down",  "thumbs-o-up",  "thumbs-up",  "ticket",  "times",  "times-circle",  "times-circle-o",  "tint",  "toggle-down",  "toggle-left",  "toggle-off",  "toggle-on",  "toggle-right",  "toggle-up",  "trademark",  "trash",  "trash-o",  "tree",  "trophy",  "truck",  "tty",  "tv",  "umbrella",  "university",  "unlock",  "unlock-alt",  "unsorted",  "upload",  "user",  "user-plus",  "user-secret",  "user-times",  "users",  "video-camera",  "volume-down",  "volume-off",  "volume-up",  "warning",  "wheelchair",  "wifi",  "wrench",  "hand-o-down",  "hand-o-left",  "hand-o-right",  "hand-o-up",  "ambulance",  "subway",  "train",  "genderless",  "intersex",  "mars",  "mars-double",  "mars-stroke",  "mars-stroke-h",  "mars-stroke-v",  "mercury",  "neuter",  "transgender",  "transgender-alt",  "venus",  "venus-double",  "venus-mars",  "file",  "file-o",  "file-text",  "file-text-o",  "info-circle lg li",  "cc-amex",  "cc-diners-club",  "cc-discover",  "cc-jcb",  "cc-mastercard",  "cc-paypal",  "cc-stripe",  "cc-visa",  "google-wallet",  "paypal",  "bitcoin",  "btc",  "cny",  "dollar",  "eur",  "euro",  "gbp",  "gg",  "gg-circle",  "ils",  "inr",  "jpy",  "krw",  "rmb",  "rouble",  "rub",  "ruble",  "rupee",  "shekel",  "sheqel",  "try",  "turkish-lira",  "usd",  "won",  "yen",  "align-center",  "align-justify",  "align-left",  "align-right",  "bold",  "chain",  "chain-broken",  "clipboard",  "columns",  "copy",  "cut",  "dedent",  "files-o",  "floppy-o",  "font",  "header",  "indent",  "italic",  "link",  "list",  "list-alt",  "list-ol",  "list-ul",  "outdent",  "paperclip",  "paragraph",  "paste",  "repeat",  "rotate-left",  "rotate-right",  "save",  "scissors",  "strikethrough",  "subscript",  "superscript",  "table",  "text-height",  "text-width",  "th",  "th-large",  "th-list",  "underline",  "undo",  "unlink",  "angle-double-down",  "angle-double-left",  "angle-double-right",  "angle-double-up",  "angle-down",  "angle-left",  "angle-right",  "angle-up",  "arrow-circle-down",  "arrow-circle-left",  "arrow-circle-o-down",  "arrow-circle-o-left",  "arrow-circle-o-right",  "arrow-circle-o-up",  "arrow-circle-right",  "arrow-circle-up",  "arrow-down",  "arrow-left",  "arrow-right",  "arrow-up",  "arrows-alt",  "caret-left",  "caret-right",  "caret-up",  "chevron-circle-down",  "chevron-circle-left",  "chevron-circle-right",  "chevron-circle-up",  "chevron-down",  "chevron-left",  "chevron-right",  "chevron-up",  "long-arrow-down",  "long-arrow-left",  "long-arrow-right",  "long-arrow-up",  "backward",  "compress",  "eject",  "expand",  "fast-backward",  "fast-forward",  "forward",  "pause",  "pause-circle",  "pause-circle-o",  "play",  "play-circle",  "play-circle-o",  "step-backward",  "step-forward",  "stop",  "stop-circle",  "stop-circle-o",  "youtube-play",  "500px",  "adn",  "amazon",  "android",  "angellist",  "apple",  "behance",  "behance-square",  "bitbucket",  "bitbucket-square",  "black-tie",  "buysellads",  "chrome",  "codepen",  "codiepie",  "connectdevelop",  "contao",  "css3",  "dashcube",  "delicious",  "deviantart",  "digg",  "dribbble",  "dropbox",  "drupal",  "edge",  "empire",  "expeditedssl",  "facebook",  "facebook-f",  "facebook-official",  "facebook-square",  "firefox",  "flickr",  "fonticons",  "fort-awesome",  "forumbee",  "foursquare",  "ge",  "get-pocket",  "git",  "git-square",  "github",  "github-alt",  "github-square",  "gittip",  "google",  "google-plus",  "google-plus-square",  "gratipay",  "hacker-news",  "houzz",  "html5",  "internet-explorer",  "ioxhost",  "joomla",  "jsfiddle",  "lastfm",  "lastfm-square",  "leanpub",  "linkedin",  "linkedin-square",  "linux",  "maxcdn",  "meanpath",  "medium",  "mixcloud",  "modx",  "odnoklassniki",  "odnoklassniki-square",  "opencart",  "openid",  "opera",  "optin-monster",  "pagelines",  "pied-piper-alt",  "pied-piper-pp",  "pinterest",  "pinterest-p",  "pinterest-square",  "product-hunt",  "qq",  "ra",  "rebel",  "reddit",  "reddit-alien",  "reddit-square",  "renren",  "resistance",  "safari",  "scribd",  "sellsy",  "shirtsinbulk",  "simplybuilt",  "skyatlas",  "skype",  "slack",  "slideshare",  "soundcloud",  "spotify",  "stack-exchange",  "stack-overflow",  "steam",  "steam-square",  "stumbleupon",  "stumbleupon-circle",  "tencent-weibo",  "trello",  "tripadvisor",  "tumblr",  "tumblr-square",  "twitch",  "twitter",  "twitter-square",  "usb",  "viacoin",  "vimeo",  "vimeo-square",  "vine",  "vk",  "wechat",  "weibo",  "weixin",  "whatsapp",  "wikipedia-w",  "windows",  "wordpress",  "xing",  "xing-square",  "y-combinator",  "y-combinator-square",  "yahoo",  "yc",  "yc-square",  "yelp",  "youtube",  "youtube-square",  "h-square",  "hospital-o",  "medkit",  "stethoscope",  "user-md"];
	$scope.icons = [];
	$scope.menu = menu;
	$scope.isLoading ={
        grid:false
	};
	
	$scope.sections = [];
    $scope.pages = [];
    $scope.menus = [];
   
	var sectionsManager = new entityManager(dasApp.apiBase + 'sections/', 'section_id', {data: 'results'});
    var pagesManager = new entityManager(dasApp.apiBase + 'pages/', 'page_id', {data: 'results'});
    var menusManager = new entityManager(dasApp.apiBase + 'menu/', 'menu_id', {data: 'results'});
	menusManager.loadAll(1,100).then(function (data) {
        $scope.menus = data.results;
    });
	
	sectionsManager.loadAll(1,100).then(function (data) {
        $scope.sections = data.results;
    });

	$scope.searchIcons = function(str){
		$scope.icons = $.grep($scope.allIcons,function(i,j){return i.indexOf(str) >=0; });
	};
	$scope.searchSections = function(str){
        return sectionsManager.search([ {
            field: 'sections.section_title_en',
            value: str,
            op: 'like'
        },{
            field: 'sections.section_title_ar',
            value: str,
            op: 'orlike'
        }]).then(function(data){$scope.sections = data.results;});
    };
	
	 if(options.isEdit == true)
	{
		 pagesManager.loadAll(1,100).then(function (data) {
        $scope.pages = data.results;
		 });
	}
	
   $scope.GetPages = function(section)
   {
	  
		return pagesManager.search([ {
            field: 'pages.section_id',
            value: section.section_id,
           
        }]).then(function(data){$scope.pages = data.results;});
		 
   }
	$scope.searchPages = function(str,section_id){
        return pagesManager.search([ {
            field: 'pages.section_id',
            value: section_id,
           
        },{
            field: 'pages.page_title_en',
            value: str,
            op: 'like'
        },{
            field: 'pages.page_title_ar',
            value: str,
            op: 'orlike'
        }]).then(function(data){$scope.pages = data.results;});
    };
	
	$scope.addItem = function () {
        if(!$scope.menu.menu_items)
            $scope.menu.menu_items = [];

        $scope.menu.menu_items.push({
            item_name_en: '',
            item_name_ar:'',
            link_type: '',
			link_value: '',
			item_sort: 1,
            $$is_editing : true
        });
    };

    $scope.editItem = function (item) {
        item.$$is_editing = true;
        item.$$clone = angular.copy(item);
    };

    $scope.saveItem = function (item) {
        item.$$is_editing = false;
        delete item.$$clone ;
    };

    $scope.cancelItem = function (item) {
        item.$$is_editing = false;
        angular.forEach(item.$$clone, function(i,j){
            if(j.startsWith('$$'))
                return;
            item[j] = i;
        });
        delete item.$$clone;
    };

    $scope.removeItem= function (item) {
        var index = $scope.menu.menu_items.indexOf(item);
        if(index >=0)
            $scope.menu.menu_items.splice(index, 1);
    };

    $scope.ok = function () {
		$scope.isLoading.grid = true;
	
        if(options.isEdit == true)
        {
			
            menuManager.update($scope.menu,$scope.menu.menu_id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.menu = save_copy($scope.menu);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
	

            });
        }
        else
        {
            menuManager.add($scope.menu) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.menu = save_copy($scope.menu);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
	
                
            });
        }
    };
 
   
    $scope.itemSortUp = function(item){
		var index = $scope.menu.menu_items.indexOf(item);
		if(index == 0) return;
		var temp = $scope.menu.menu_items[index];
		$scope.menu.menu_items[index] = $scope.menu.menu_items[index-1]
		$scope.menu.menu_items[index-1] = temp;
		item.item_sort = index-1;
    }; 

    
    $scope.itemSortDown = function(item){
		
		var index = $scope.menu.menu_items.indexOf(item);
		if(index ==  $scope.menu.menu_items.length -1 ) return;
		var temp = $scope.menu.menu_items[index];
		$scope.menu.menu_items[index] = $scope.menu.menu_items[index+1]
		$scope.menu.menu_items[index+1] = temp;
		item.item_sort = index+1;
		

    };


    $scope.cancel = function (item) {
		$uibModalInstance.dismiss('cancel');
    };
	
	$scope.setSection = function (page,item)
	{
		item.section_id = page.section_id;
		
	}
	
	
}]);
;dasApp.controller('addModelController', ["$scope", "$http", "entityManager", "$uibModalInstance", "model", "options", "modelManager", "data", function ($scope,$http, entityManager, $uibModalInstance,model,options,modelManager,data) {

    $scope.title=options.title;
    $scope.model = model;
	$scope.data = data;

	$scope.isLoading ={
        grid:false
	};
    $scope.cancel = function (item) {
		$uibModalInstance.dismiss('cancel');
    };
	
	$scope.is_edit = options.isEdit;
	
	if($scope.is_edit)
	{
			//$scope.model.from_date = new Date($scope.model.from_date);
			//$scope.model.to_date = new Date($scope.model.to_date);
	}
    //--------------------------------------- Managers ---------------------------------------
    var managers={};
    $scope.entityslist={};

    angular.forEach(data.managers,function(manager,j){
        managers[manager.name]= new entityManager(dasApp.apiBase + manager.name,manager.id);

        $scope.entityslist[manager.name] = [];
        if(manager.filter)
        {
            managers[manager.name].search(manager.filter,1,900).then(function(data){
                $scope.entityslist[manager.name] = data.results;
            });
        }
        else
        {
            managers[manager.name].loadAll(1,900).then(function(data){
                $scope.entityslist[manager.name] = data.results;
            });
        }
	});
    //--------------------------------------- ui-select ---------------------------------------
    // $scope.categories = [];
	// var  categoriesManager = new entityManager(dasApp.apiBase + 'categories','category_id');
	// categoriesManager.loadAll(1,900).then(function(data){
	// 	$scope.categories = data.results;
	// });
	$scope.searchManager = function(str,field){
        
        var vsearch=[];
        for(var i=0;i<field.searchfields.length;i++)
        {
            var vsearchfield=field.searchfields[i];
            vsearch.push({
            field: vsearchfield.field,
            value: str,
            op: vsearchfield.op
            });
        }
        if(data.managers[field.managername].filter)
        {
            for(var i=0;i<data.managers[field.managername].filter.length;i++)
            {
                var vsearchfield=data.managers[field.managername].filter[i];
                vsearch.push(vsearchfield);
            }
        }
        return managers[field.managername].search(vsearch,1,1000).then(function(data){
            $scope.entityslist[field.managername]  = data.results;
        });
    };
    $scope.getfieldsvalue = function(object,listfield){
        var res='';
        if(!object)return '';
        angular.forEach(listfield,function(vfield,j){
            res+=object[vfield]+' ';
        });
        return res;
    };
	//---------------------------------------
	$scope.formatDateTime = function(d)
	{
		var day = d.getDate();
		var monthIndex = d.getMonth();
		monthIndex = parseInt(monthIndex)+1;
		var year = d.getFullYear();
		var hours = d.getHours();
		var mins = d.getMinutes();
		if(day<10){
			day='0'+day
		} 
		if(monthIndex<10){
			monthIndex='0'+monthIndex
		}
		if(hours<10){
			hours='0'+hours
		}
		if(mins<10){
			mins='0'+mins
		}
		var formate_date = year+'-'+monthIndex+'-'+day+' '+hours+':'+mins;
		return formate_date;
	}

    $scope.onTimeSet = function (newDate, pmodel,pfield) {
		var formate_date = $scope.formatDateTime(newDate);
		pmodel[pfield] = formate_date;
	};
	//---------------------------------------

    $scope.ok = function () {
		$scope.isLoading.grid = true;
        if(options.isEdit == true)
        {
			modelManager.update($scope.model,$scope.model.id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.model = save_copy($scope.model);
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
				$scope.isLoading.grid = false;
                $scope.errors=error.errors;

            });
        }
        else
        {
            modelManager.add($scope.model) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.model = save_copy($scope.model);
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
                //angular.forEach(error.errors,function(i,j){ $scope.errors += '<p>'+<p>; });
            });
        }
    };


/* -------------------------------------------------- grid -------------------------------------------------- */

  $scope.addrowgrid = function (grid) {
      var initob={};
        for(var i=0;i<grid.fields.length;i++)
        {
            var gfield=grid.fields[i];
            initob[gfield.field]='';
        }
        initob[grid.fk]=model[grid.modelpk];
        initob.$$is_editing = true;

        $scope.model[grid.field].push(initob);
    };

    $scope.editrowgrid = function (item) {
        //item.from_date = new Date(item.from_date);
        item.$$is_editing = true;
        item.$$clone = angular.copy(item);
    };

    $scope.saverowgrid = function (item) {
        item.$$is_editing = false;
        delete item.$$clone;
    };

    $scope.cancelrowgrid= function (item) {
        item.$$is_editing = false;
        angular.forEach(item.$$clone, function (i, j) {
            if (j.startsWith('$$'))
                return;
            item[j] = i;
        });
        delete item.$$clone;
    };

    $scope.removerowgrid = function (item,grid) {
        var index = $scope.model[grid.field].indexOf(item);
        if (index >= 0)
            $scope.model[grid.field].splice(index, 1);
    };








}]);
;
dasApp.controller('addPageController', ["$scope", "entityManager", "$uibModalInstance", "page", "options", "pagesManager", "$timeout", function ($scope, entityManager, $uibModalInstance,page,options,pagesManager,$timeout) {

    $scope.title=options.title;
    $scope.section = options.section;
    $scope.page = page;
	$scope.isLoading ={
        grid:false
	};
	
	$scope.is_section = options.is_section;
	if($scope.is_section == true)
	{
		$scope.page.section_id = options.section_id;
	}
	$timeout(function(){
		$('.mce-tinymce').css({display:'block'})
	},1000);

    //load sections for dropdown
    $scope.sections = [];
   
	 var sectionsManager = new entityManager(dasApp.apiBase + 'sections/', 'section_id', {data: 'results'});
    sectionsManager.loadAll(1,100).then(function (data) {
        $scope.sections = data.results;
    });

    $scope.layouts = [];
    (new entityManager(dasApp.apiBase + 'pages/layouts', 'name' ) .loadAll(1,100).then(function (data) {
        $scope.layouts = data.results;
    }) );

	$scope.searchSections = function(str){
        return sectionsManager.search([ {
            field: 'sections.section_title_en',
            value: str,
            op: 'like'
        },{
            field: 'sections.section_title_ar',
            value: str,
            op: 'orlike'
        }]).then(function(data){$scope.sections = data.results;});
    };

    ////// --------------------- For Datetime picker //////
    $scope.formatDateTime = function(d)
	{
		var day = d.getDate();
		var monthIndex = d.getMonth();
		monthIndex = parseInt(monthIndex)+1;
		var year = d.getFullYear();
		var hours = d.getHours();
		var mins = d.getMinutes();
		if(day<10){
			day='0'+day
		} 
		if(monthIndex<10){
			monthIndex='0'+monthIndex
		}
		if(hours<10){
			hours='0'+hours
		}
		if(mins<10){
			mins='0'+mins
		}
		var formate_date = year+'-'+monthIndex+'-'+day+' '+hours+':'+mins;
		return formate_date;
	}
    $scope.onTimeSet = function (newDate, oldDate) {
		var formate_date = $scope.formatDateTime(newDate)
		
		$scope.page.date = formate_date;
	};
    if(options.isEdit == true)
	 {
         if($scope.page.date=='0000-00-00 00:00:00')
         {
            $scope.page.date = new Date($scope.page.created_date);
            $scope.page.date = $scope.formatDateTime($scope.page.date);
         }
         else
         {
            $scope.page.date = new Date($scope.page.date);
            $scope.page.date = $scope.formatDateTime($scope.page.date);
         }
	 }
	 else
	 {
		var d = new Date();
		$scope.page.date = $scope.formatDateTime(d);
	 }
	//------------------
    $scope.ok = function () {
		$scope.isLoading.grid = true;
	
        if(options.isEdit == true)
        {
		
            pagesManager.update($scope.page,$scope.page.page_id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.page = save_copy($scope.page);
        
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;

            });
        }
        else
        {
            pagesManager.add($scope.page) .then(function(response){
				$scope.page = save_copy($scope.page);
        		$scope.isLoading.grid = false;
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

    $scope.init_values = function (section) {
        $scope.page.custom_fields =section.custom_fields ;
        $scope.page.custom_field_values = [] ;
        angular.forEach(section.custom_fields,function(i,j){
             $scope.page.custom_field_values.push({
                custom_field_id:i.id ,
                value : ''
             });
        });
    };
    //set custom_field_id
    var vi=0;
    angular.forEach($scope.page.custom_fields,function(i,j){
        delete i.value;
        if($scope.page.custom_field_values[vi]==undefined)
        {
        $scope.page.custom_field_values[vi]={custom_field_id:i.id};
        }
        vi++;
    });

}]);
;
dasApp.controller('addProductController', ["$scope", "entityManager", "$uibModalInstance", "product", "options", "productsManager", function ($scope, entityManager, $uibModalInstance,product,options,productsManager ) {

    $scope.title=options.title;
    $scope.product = product;
	$scope.isLoading ={
        grid:false
	};
	
    //load categories for dropdown
	$scope.categories = [];
	var  categoriesManager = new entityManager(dasApp.apiBase + 'categories','category_id');
	categoriesManager.loadAll(1,900).then(function(data){
		$scope.categories = data.results;
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


    $scope.ok = function () {
		$scope.isLoading.grid = true;
        if(options.isEdit == true)
        {
			productsManager.update($scope.product,$scope.product.product_id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.product = save_copy($scope.product);
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
				$scope.isLoading.grid = false;
                $scope.errors=error.errors;

            });
        }
        else
        {
            productsManager.add($scope.product) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.product = save_copy($scope.product);
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
	
	$scope.clear_image = function()
	{
		$scope.product.ad_image = '';
		$('#ad_prev').attr('src','http://localhost/Shawermatac-New/src/uploads/nophoto.jpg');
    }
    
    
    //==================

    
    $scope.addProduct_image = function () {
        if(!$scope.product.product_images)
            $scope.product.product_images = [];

        $scope.product.product_images.push({
            title_en: '',
            title_ar: '',
            description_en: '',
            description_ar: '',
            photo_en: '',
            photo_ar: '',
            sort: '',
            product_id: 0,
            $$is_editing : true
        });
    };

    $scope.editProduct_image = function (item) {
        item.$$is_editing = true;
        item.$$clone = angular.copy(item);
    };

    $scope.saveProduct_image = function (item) {
        item.$$is_editing = false;
        delete item.$$clone ;
    };

    $scope.cancelProduct_image = function (item) {
        item.$$is_editing = false;
        angular.forEach(item.$$clone, function(i,j){
            if(j.startsWith('$$'))
                return;
            item[j] = i;
        });
        delete item.$$clone;
    };

    $scope.removeProduct_image = function (item) {
        var index = $scope.product.product_images.indexOf(item);
        if(index >=0)
            $scope.product.product_images.splice(index, 1);
    };


}]);;

dasApp.controller('addSectionController', ["$scope", "entityManager", "$uibModalInstance", "section",  "options", "sectionsManager", function ($scope, entityManager, $uibModalInstance,section,options,sectionsManager) {

    $scope.title=options.title;

    $scope.section = section;

    sectionsManager.loadAll(1,1000).then(function(data){
        $scope.sections = data.results;
    });

	$scope.isLoading ={
        grid:false
	};


    $scope.layouts = [];
    (new entityManager(dasApp.apiBase + 'sections/layouts', 'name' ) .loadAll(1,100).then(function (data) {
        $scope.layouts = data.results;
    }) );

    $scope.ok = function () {
		$scope.isLoading.grid = true;
	
        if(options.isEdit == true)
        {
			
            sectionsManager.update($scope.section,$scope.section.section_id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.section = save_copy($scope.section);
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
				$scope.isLoading.grid = false;
                $scope.errors=error.errors;

            });
        }
        else
        {
            sectionsManager.add($scope.section) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.section = save_copy($scope.section);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
				$scope.isLoading.grid = false;
                $scope.errors=error.errors;
                //angular.forEach(error.errors,function(i,j){ $scope.errors += '<p>'+<p>; });
            });
        }
    };

    $scope.cancel = function (item) {
		$uibModalInstance.dismiss('cancel');
    };

    // custom field

    $scope.addcustom_field = function () {
        $scope.section.custom_fields.push({
            id: '',
            label_en: '',
            label_ar: '',
            type: '',
            is_required: '',
            $$is_editing: true
        });
    };

    $scope.editcustom_field = function (item) {
        item.$$is_editing = true;
        item.$$clone = angular.copy(item);
    };

    $scope.savecustom_field = function (item) {
        item.$$is_editing = false;
        delete item.$$clone;
    };

    $scope.cancelcustom_field = function (item) {
        item.$$is_editing = false;
        angular.forEach(item.$$clone, function (i, j) {
            if (j.startsWith('$$'))
                return;
            item[j] = i;
        });
        delete item.$$clone;
    };

    $scope.removecustom_field = function (item) {
        var index = $scope.section.custom_fields.indexOf(item);
        if (index >= 0)
            $scope.section.custom_fields.splice(index, 1);
    };


}]);
;dasApp.controller('addSliderController', ["$scope", "entityManager", "$uibModalInstance", "slider", "options", "slidersManager", function ($scope, entityManager, $uibModalInstance,slider,options,slidersManager) {
    $scope.title=options.title;
    $scope.slider = slider;
	$scope.isLoading ={
        grid:false
	};
    
	$scope.addSlide = function () {
        if(!$scope.slider.slides)
            $scope.slider.slides = [];

        $scope.slider.slides.push({
            slide_title_en: '',
            slide_title_ar:'',
            slide_description_en: '',
			slide_description_ar: '',
			slide_photo_en: '',
			slide_photo_ar: '',
			slide_sort: 1,
            $$is_editing : true
        });
    };

    $scope.editSlide = function (item) {
        item.$$is_editing = true;
        item.$$clone = angular.copy(item);
    };

    $scope.saveSlide = function (item) {
        item.$$is_editing = false;
        delete item.$$clone ;
    };

    $scope.cancelSlide = function (item) {
        item.$$is_editing = false;
        angular.forEach(item.$$clone, function(i,j){
            if(j.startsWith('$$'))
                return;
            item[j] = i;
        });
        delete item.$$clone;
    };

    $scope.removeSlide= function (item) {
        var index = $scope.slider.slides.indexOf(item);
        if(index >=0)
            $scope.slider.slides.splice(index, 1);
    };

    $scope.ok = function () {
		$scope.isLoading.grid = true;
	
        if(options.isEdit == true)
        {
			
            slidersManager.update($scope.slider,$scope.slider.slider_id) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.slider = save_copy($scope.slider);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
	

            });
        }
        else
        {
            slidersManager.add($scope.slider) .then(function(response){
				$scope.isLoading.grid = false;
				$scope.slider = save_copy($scope.slider);
           
                $uibModalInstance.close(response.data);
            },function(error){ //insert failed
                $scope.errors=error.errors;
				$scope.isLoading.grid = false;
	
                //angular.forEach(error.errors,function(i,j){ $scope.errors += '<p>'+<p>; });
            });
        }
    };
 
    /**
     * move slide up
     * @param slide
     */
    $scope.slideSortUp = function(slide){
		var index = $scope.slider.slides.indexOf(slide);
		if(index == 0) return;
		var temp = $scope.slider.slides[index];
		$scope.slider.slides[index] = $scope.slider.slides[index-1]
		$scope.slider.slides[index-1] = temp;
    }; 

    /**
     * Move slide down
     * @param slide
     */
    $scope.slideSortDown = function(slide){
		
		var index = $scope.slider.slides.indexOf(slide);
		if(index ==  $scope.slider.slides.length -1 ) return;
		var temp = $scope.slider.slides[index];
		$scope.slider.slides[index] = $scope.slider.slides[index+1]
		$scope.slider.slides[index+1] = temp;
		

    };


    $scope.cancel = function (item) {
		$uibModalInstance.dismiss('cancel');
    };
}]);
; 
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
;
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
;dasApp.controller('biographyController', ["$scope", "$http", "$uibModal", "$timeout", function($scope, $http,$uibModal,$timeout) {
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
;dasApp.controller('branchesController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title = "Branches";

    $scope.isLoading ={
        grid:true
    };
	$scope.msg="";
	$scope.err = false;
    $scope.force = false;
    $scope.gridOptions = {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
        rowSelection: true,
        columnDefs: [
            {width:70,field: 'branch_code', displayName: 'Code'},
            {width:120,field: 'branch_name_en', displayName: 'Name En'},
            {width:120,field: 'branch_name_ar', displayName: 'Name Ar'},
            {minWidth:180,field: 'branch_address_en', displayName: 'Address En'},
            {minWidth:180,field: 'branch_address_ar', displayName: 'Address Ar'},
            {width:120,field: 'branch_phone', displayName: 'Phone'},
            {width:120,field: 'branch_mobile', displayName: 'Mobile'},
            {width:120,
                field: 'country_name_en',
                displayName: 'Country'
            },
            {width:120, pinnedRight:true,
                name: 'Actions',
                cellTemplate: '<div>' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Branch" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> ' +
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Branch" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>' +
                '</div>'
            }

        ],
        data: [],
        onRegisterApi: function (gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                $scope.isLoading.grid = true;
                 branchesManager.loadAll(newPage, pageSize).then(function (data) {
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
    $scope.isLoading.grid = true;
    var branchesManager = new entityManager(dasApp.apiBase + 'branches/', 'branch_id', {data: 'results'});
    branchesManager.loadAll().then(function (data) {
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
        $scope.isLoading.grid = false;
    });




	 $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    }
	
    $scope.add = function (isEdit, entity) {
		$scope.branch = entity;

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/branches/form.html',
            controller: 'addBranchController',
            size: 'lg',
            resolve: {
                options: {
                    title: (isEdit ? 'Edit' : 'Add') + ' Branch',
                    isEdit: isEdit ? true : false,
                },
                branchesManager: branchesManager,
                branch: isEdit ? entity : {branch_images:[]}
            }
        });


        modalInstance.result.then(function (product) {
            if (!isEdit)
                $scope.gridOptions.data.push(product);
        }, function () {
			//delete_copy($scope.branch);
        });
    };


    $scope.delete = function (branch) {
        $scope.branch = branch;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope: $scope
        });
    };


    $scope.confirm_delete = function () {
        branch = $scope.branch;
		  branchesManager.delete(branch.branch_id).then(function (response) {
				var index = $scope.gridOptions.data.indexOf(branch);
				$scope.gridOptions.data.splice(index, 1);
				$scope.gridOptions.totalItems = $scope.gridOptions.totalItems - 1;
				$scope.force=false;
				$scope.modalInstance.close();

        },function(error) 
		{
			if(error.errors == 'UnAuthorized')
				$window.location.href= dasApp.baseUrl+'dashboard';	
		});

    };

    $scope.cancel = function () {
		//$scope.branch = delete_copy();
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.refresh = function () {
        products.loadAll().then(function (data) {
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
        });
    };
}]);
;dasApp.controller('categoriesController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Categories";

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

            {field :'category_name_en' ,name: 'Name En'},
            {field :'category_name_ar' ,name: 'Name Ar'},
            { field :'category_description_en' ,name: 'Description En'},
            {field :'category_description_ar' ,name: 'Description Ar'},
            {
                
                pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div>' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Category" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Category" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                $scope.isLoading.grid = true;
                categoriesManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                    $scope.isLoading.grid = false;
                });

            });

        }
    };

    $scope.isLoading.grid = true;
    var categoriesManager = new entityManager(dasApp.apiBase + 'categories/','category_id',{data:'results'});
    categoriesManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
        $scope.isLoading.grid = false;
    });


    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
		$scope.category = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/categories/form.html',
            controller: 'addCategoryController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + 'Category',
                    isEdit: isEdit ? true : false,
                },
                categoriesManager : categoriesManager,
                    category: isEdit ? entity : {}
            }
        });

        modalInstance.result.then(function (product) {
            if(!isEdit)
                $scope.gridOptions.data.push(product);
        }, function () {
			delete_copy($scope.category);
       

        });
    };


    $scope.delete = function (category) {
        $scope.category  = category;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        category = $scope.category;
        categoriesManager.delete(category.category_id) .then(function(response){
			console.log(response.data.success);
			if(response.data.success == false)
			{
				$scope.err = true;
				$scope.msg = response.data.msg;

			}
			else
			{
				var index = $scope.gridOptions.data.indexOf(category);
				$scope.gridOptions.data.splice(index, 1);
				$scope.gridOptions.totalItems = $scope.gridOptions.totalItems-1;
				$scope.modalInstance.close();
			}
        }, function () {

        });
    };

    $scope.cancel = function()
    {
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.refresh=function(){
        products.loadAll().then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
        });
    };





}]);
;dasApp.controller('contactusController', ["$scope", "$http", "entityManager", "$uibModal", "$routeParams", function($scope, $http,entityManager,$uibModal,$routeParams) {
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
;dasApp.controller('dashboardController', ["$scope", "$http", "entityManager", "$timeout", function($scope, $http , entityManager,$timeout) {

	$scope.title="dashboard";
	$scope.todos = [];

	$scope.isLoading={
		lastOrders : true,
		stats : true
	};

	$scope.stats = {
		top_products: [],
		today_orders_count : 0,
		today_orders_total : 0,
		orders_per_branch : [],
		monthly_sales : [],
		products_count : 0,
		members_count:1
	};
	var order_stats = {
		0	: 	'pending',
		1	:	'ready',
		2	:	'delivered',
		3	: 	'canceled'
	};

	$scope.statusClass = {
		0	: 	'warning',
		1	:	'primary',
		2	:	'success',
		3	: 	'danger'
	};

	$scope.order_stats = order_stats;


	//TODOs
	var todosManager = new entityManager(dasApp.apiBase + '/todos/','todo_id');
	todosManager.loadAll().then(function(data){
		$scope.todos = data.results;
	},function(){});

	$scope.addTodo = function(){
		$scope.todos.push({
			is_done : 'no',
			$$isEdit : true,
			created_date : new Date()
		});
	};

	$scope.saveTodo = function(todoItem){
		if(todoItem.todo_id) {
			todosManager.update(todoItem, todoItem.todo_id).then(function () {
				todoItem.$$isEdit = false;
				$scope.todoErros = '';
				$scope.todoHasErros = false;
			}, function (err) {
				$scope.todoErros = err.errors;
				$scope.todoHasErros = true;
			});
		}else{
			todosManager.add(todoItem).then(function () {
				todoItem.$$isEdit = false;
				$scope.todoErros = '';
				$scope.todoHasErros = false;
			}, function (err) {
				$scope.todoErros = err.errors;
				$scope.todoHasErros = true;
			});
		}
	};

	$scope.editTodo = function(todoItem){
		todoItem.$$isEdit=true;
	};

	$scope.deleteTodo = function(todoItem){
		function removeTodo(toto){
			var indexTodo = $scope.todos.indexOf(toto);
			if(indexTodo >=0)
				$scope.todos.splice(indexTodo,1);
		}
		if(todoItem.todo_id)
			todosManager.delete(todoItem.todo_id).then(function(){
					removeTodo(todoItem);
				}
				,function(){
					removeTodo(todoItem);
				});
		else{
			removeTodo(todoItem);
		}
	};

	// last orders
	$scope.latestOrders = [];
	$scope.refreshLastOrders = function(){
		$scope.isLoading.lastOrders=true;
		var ordersManager = new entityManager(dasApp.apiBase + 'orders/','order_id',{data:'results'});
		ordersManager.loadAll(1,10).then(function(data){
			$scope.latestOrders = data.results;
			$scope.isLoading.lastOrders=false;
		});
	};
	$scope.refreshLastOrders();

	function zeroPad(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}

	//stats
	$scope.isLoading.stats = true;
	$http.get(dasApp.apiBase + '/dashboard/stats').then(function(res){
		$scope.stats = res.data;

		var chartData = [],donutData = [],graphData=[];
		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		var year = (new Date()).getFullYear();
		for(var i =0;i< $scope.stats.monthly_sales.length ;i++){
			var dataItem = $scope.stats.monthly_sales[i];
			chartData.push({
				y: year + '-' + parseInt(dataItem.month) , item1: dataItem.sum
			});
		}
		for(var j =0;j< $scope.stats.orders_per_branch.length ;j++){
			var dataItem = $scope.stats.orders_per_branch[j];
			donutData.push(
				{label:dataItem.branch_name_en  , value: dataItem.orders_count}
			 );
		}
		for(var k =0;k < $scope.stats.hourly_sales.length ;k++){
			var dataItem = $scope.stats.hourly_sales[k];
			graphData.push({
				y: dataItem.tt + ' ' +  zeroPad(parseInt(dataItem.hour),2)+":00" , Sales: dataItem.sum
			});
		}


		var orders_count_per_status = {};

		angular.forEach($scope.stats.orders_count_per_status,function(i,j){
			orders_count_per_status[order_stats[i.order_status]] = i.orders_count;
		});

		$scope.stats.orders_count_per_status = orders_count_per_status;



		init(chartData,donutData,graphData);
		$scope.isLoading.stats = false;
	},function(error){
		if(error.errors == 'UnAuthorized')
			$window.location.href= dasApp.baseUrl+'dashboard';	
	});


	function init(chartData,donutData,graphDate){
		var area = new Morris.Area({
			element: 'revenue-chart',
			resize: true,
			data: chartData,
			xkey: 'y',
			ykeys: ['item1'],
			labels: ['Item 1'],
			lineColors: ['#a0d0e0'],
			hideHover: 'auto'
		});
		var line = new Morris.Line({
			element: 'line-chart',
			resize: true,
			data: graphDate,
			xkey: 'y',
			xLabels:["hour"],
			postUnits:['SR'],
			ykeys: ['Sales'],
			labels: ['Sales'],
			lineColors: ['#efefef'],
			lineWidth: 2,
			hideHover: 'auto',
			gridTextColor: "#fff",
			gridStrokeWidth: 0.4,
			pointSize: 4,
			pointStrokeColors: ["#efefef"],
			gridLineColor: "#efefef",
			gridTextFamily: "Open Sans",
			gridTextSize: 10
		});
		function makeDonut(){
			var donut = new Morris.Donut({
				element: 'sales-chart',
				resize: true,
				colors: ["#D8354A","#FFFF00","#3c8dbc","#00A65A", "#f56954", "#00a65a"],
				data: donutData,
				hideHover: 'auto'
			});
		}

		$scope.redrawDonut = function(){
			$timeout(makeDonut,1000);
		};
	}


}]);


;
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
;dasApp.controller('imageGalleryController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Image Gallerys";
	$scope.isLoading ={
        grid:true
    };
    $scope.gridOptions= {
        useExternalPagination: true,
         paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {minWidth:120,field :'name' ,displayName: 'Name'},
            {minWidth:200,field :'title_en' ,displayName: 'Title En'},
            {minWidth:200,field :'title_ar' ,displayName: 'Title Ar'},
              {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div> &nbsp;' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                 $scope.isLoading.grid = true;
                modelManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
 $scope.isLoading.grid = true;
    var modelManager = new entityManager(dasApp.apiBase + 'image_gallery/','id',{data:'results'});
    modelManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
		 $scope.isLoading.grid = false;
    });


    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
		$scope.model = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/image_gallery/form.html',
            controller: 'addImageGalleryController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Image Gallery',
                    isEdit: isEdit ? true : false,
                },
                modelManager : modelManager,
                model: isEdit ? entity : {}
            }
        });


        modalInstance.result.then(function (model) {
            if(!isEdit)
                $scope.gridOptions.data.push(model);
        }, function () {
			delete_copy($scope.model);
        
        });
    };

    $scope.delete = function (model) {
        $scope.model  = model;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        model = $scope.model;
        modelManager.delete(model.id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(model);
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
;dasApp.controller('menuController', ["$scope", "$http", "entityManager", function($scope, $http,entityManager) {
	 $scope.title="menu";
	 $scope.sections = [];
	 var filter = [];
	 filter.push( {
                 field: 'sections.show_in_menu',
                 value: '1'

             } );

	  var sectionsManager = new entityManager(dasApp.apiBase + 'sections/','section_id',{data:'results'});
		return sectionsManager.search(filter).then(function(data){
			 $scope.sections = data.results;
		});



 }]);
;dasApp.controller('menuItemsController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
$scope.title="Menu Items";
 $scope.isLoading ={
        grid:true
    };
	$scope.msg="";
	$scope.err = false;
    $scope.gridOptions= {
        useExternalPagination: false,
       paginationPageSizes: [20, 50, 100],
        paginationPageSize: 50,
		enableRowSelection: false,
		enableRowHeaderSelection: false,
	   rowSelection: false,
	    multiSelect : false,
		enableGridMenu: true,
		enableSelectAll: true,
		exporterCsvFilename: 'menuItems.csv',
		exporterPdfDefaultStyle: {fontSize: 9},
		exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
		exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		exporterPdfHeader: { text: "menuItems", style: 'headerStyle' },
		exporterPdfFooter: function ( currentPage, pageCount ) {
		  return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		},
		exporterPdfCustomFormatter: function ( docDefinition ) {
		  docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
		  docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
		  return docDefinition;
		},
		exporterPdfOrientation: 'portrait',
		exporterPdfPageSize: 'LETTER',
		exporterPdfMaxGridWidth: 500,
		exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

        columnDefs : [
            {minWidth:120,field :'product_name' ,name: 'Product Name'},
            {width:120,field :'qty' ,name: 'Quantity'},
            {width:120,field :'total' ,name: 'Total'},
			
        ],
        data:[],
        onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
           
        }
    };
	
	var reportsManager = new entityManager(dasApp.apiBase + 'reports/menu_items','report_id',{data:'results'});
	$scope.isLoading.grid = true;
	function loadData(newPage,pageSize){
		$scope.isLoading.grid = true;
		reportsManager.loadAll(newPage,pageSize).then(function(data){
			angular.forEach(data,function(i,j){
				i.product_name = i.product_name_en  + ' | ' + i.product_name_ar;
			});
			 
			$scope.gridOptions.data = data;
			$scope.gridOptions.totalItems = data.length;
			$scope.isLoading.grid = false;
		});
	}
	
	loadData(1,1000); 
	
	 $scope.refreshGrid = function(){
		loadData(1,1000);  
    };
	
	$scope.branches = [];
    var branchesManager = new entityManager(dasApp.apiBase + 'branches/', 'branch_id', {data: 'results'});
    branchesManager.loadAll(1,100).then(function (data) {
        $scope.branches = data.results;
    });
	
	 $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
		 maxDate: new Date()
    };
	$scope.maxDate= new Date();
	$scope.maxDate2 = new Date();
    $scope.formats = [ 'yyyy-MM-dd'];
    $scope.format = $scope.formats[0];

    $scope.popup1 = {
        opened: false
    };
	 $scope.popup2 = {
        opened: false
    };
	
	 $scope.search = {
        branch : '',
        fromdate : '',
        todate : '',
    };

    $scope.showSearch = false;

	 $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            $scope.search = {
                branch : '',
				fromdate : '',
				todate : '',
            };
            $scope.doSearch();
        }
    };

	 $scope.doSearch = function(){
        window.xx = $scope.search;
        var searchFields = [];
       if($scope.search.branch && $scope.search.branch.trim()!='')
             searchFields.push( {
                 field: 'orders.branch_id',
                 value: $scope.search.branch,
                 op: 'eq'
             } );
			 
        if($scope.search.fromdate && $scope.search.fromdate !='')
			{
				$scope.minDate2 = $scope.search.fromdate;
				var d =  $scope.search.fromdate ;
				var formattedDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()  ;
				 searchFields.push( {
					 field: 'orders.order_date',
					 value: formattedDate,
					 op: 'gt'
				 }
				);
			
			}
		
			if($scope.search.todate && $scope.search.todate !='')
			{
				$scope.maxDate2= $scope.search.todate;
				var d =  $scope.search.todate ;
				var formattedDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()  ;
				 searchFields.push( {
					 field: 'orders.order_date',
					 value: formattedDate,
					 op: 'ls'
				 }
				);
			
			}
			
		 $scope.isLoading.grid = true;
        return reportsManager.search(searchFields).then(function(data){
			angular.forEach(data,function(i,j){
				i.product_name = i.product_name_en  + ' | ' + i.product_name_ar;
			});
            $scope.gridOptions.data = data;
            $scope.gridOptions.totalItems = data.length;
            $scope.isLoading.grid = false;
        });
    };

	$scope.checkClear = function ()
	 {
		 if($scope.search.todate == null || $scope.search.todate == '')
		{
				$scope.maxDate2= new Date();
		}
		if($scope.search.fromdate == null || $scope.search.fromdate == '')
		{
				$scope.minDate2= '';
		}
	 }

	
	 $scope.export = function(){
		  var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
		  $scope.gridApi.exporter.csvExport( 'all', 'visible', myElement );
		
	};
}]);
;dasApp.controller('menusController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Menus";
	$scope.isLoading ={
        grid:true
    };
    $scope.gridOptions= {
        useExternalPagination: true,
         paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {minWidth:200,field :'menu_name_en' ,displayName: 'Menu Name En'},
            {minWidth:200,field :'menu_name_en' ,displayName: 'Menu Name Ar'},
            {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div> &nbsp;' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Menu" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Menu" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                 $scope.isLoading.grid = true;
                menuManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
 $scope.isLoading.grid = true;
    var menuManager = new entityManager(dasApp.apiBase + 'menu/','menu_id',{data:'results'});
    menuManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
		 $scope.isLoading.grid = false;
    });


    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
		$scope.menu = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/menu/form.html',
            controller: 'addMenuController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Menu',
                    isEdit: isEdit ? true : false,
                },
                menuManager : menuManager,
                menu: isEdit ? entity : {}
            }
        });


        modalInstance.result.then(function (menu) {
            if(!isEdit)
                $scope.gridOptions.data.push(menu);
        }, function () {
			delete_copy($scope.menu);
        
        });
    };

    $scope.delete = function (menu) {
        $scope.menu  = menu;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        menu = $scope.menu;
        menuManager.delete(menu.menu_id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(menu);
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
;dasApp.controller('modelsController', ["$scope", "$http", "entityManager", "$uibModal","toaster","data", function($scope, $http,entityManager,$uibModal,toaster,data) {
    $scope.title=data.title;

    $scope.isLoading ={
        grid:true
    };
	$scope.msg="";
	$scope.err = false;
    $scope.models = [];
    $scope.events = [];
    $scope.ready = false;
    $scope.allowadd=data.allowadd==false?false:true;
    $scope.allowrefresh=data.allowrefresh==false?false:true;
    

    var vcolumnDefs=[];
    for(var j=0;j<data.tabs.length;j++)
    {
        var tab=data.tabs[j];
        for(var i=0;i<tab.fields.length;i++)
        {
            var field=tab.fields[i];
            if(field.show&&field.show!='grid') continue;
            if(field.type=='checkbox')
            {
                vcolumnDefs.push({field :field.field ,name: field.name,
                    cellTemplate:'<div class="ui-grid-cell-contents" title="TOOLTIP"><div  ng-if="row.entity.'+field.field+' == 0 " ><span class="label label-danger">No</span></div><div  ng-if="row.entity.'+field.field+' == 1 " ><span class="label label-success">Yes</span></div></div>'
                });
            }else
            {
                vcolumnDefs.push({field :field.field ,name: field.name});
            }
        }
    }
    vcolumnDefs.push({
                width:120,
                pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div>' +
                (data.allowview ? '<button class="btn btn-xs btn-primary" uib-tooltip="View Data" tooltip-placement="right" ng-click="grid.appScope.view(row.entity)"><i class="fa fa-eye"></i></button> ':'')+
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Data" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-edit"></i></button> '+
				'<button class="btn btn-xs btn-danger" uib-tooltip="Delete" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
			    '</div>'
            });

    $scope.gridOptions= {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : vcolumnDefs,
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                $scope.isLoading.grid = true;
                modelManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                    $scope.isLoading.grid = false;
					$scope.ready = true;
                });

            });
        }
    };

    $scope.isLoading.grid = true;
    var modelManager = new entityManager(dasApp.apiBase + data.apiname+'/','id',{data:'results'});
    modelManager.loadAll().then(function(data){
		
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
        $scope.isLoading.grid = false;
		$scope.models = data.results;
		
    });

	$scope.view = function (entity) {
		$scope.model = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/'+data.viewfolder+'/view.html',
            controller: 'addModelController',
            size: 'lg',
            resolve: {
                options: {
                    title:	'View ' + data.title,
                },
                modelManager : modelManager,
                model: entity,
                data:data
            }
        });

        modalInstance.result.then(function () {

        }, function () {
			delete_copy($scope.model);
        });
    };
    $scope.delete = function (model) {
        $scope.model  = model;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        model = $scope.model;
        modelManager.delete(model.id) .then(function(response){
			if(response.data.success == false)
			{
				$scope.err = true;
				$scope.msg = response.data.msg;
			}
			else
			{
				var index = $scope.gridOptions.data.indexOf(model);
				$scope.gridOptions.data.splice(index, 1);
				$scope.gridOptions.totalItems = $scope.gridOptions.totalItems-1;
				$scope.modalInstance.close();
			}
        }, function () {

        });
    };

    $scope.cancel = function()
    {
        $scope.modalInstance.dismiss('cancel');
    };

    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {

		$scope.model = entity;
        var initmodel={};
        //----------- init model with list for grid
        for(var j=0;j<data.tabs.length;j++)
        {
            var tab=data.tabs[j];
            if(tab.grids)
                for(var i=0;i<tab.grids.length;i++)
                {
                    var grid=tab.grids[i];
                    initmodel[grid.field]=[];
                }
        }
        //----------- 
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
             templateUrl: dasApp.baseUrl + 'assets/dashboard/views/models/form.html',
            controller: 'addModelController',
           size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit ' : 'Add ') + data.title,
                    isEdit: isEdit ? true : false,
                },
				modelManager : modelManager,
                model: isEdit ? entity : initmodel,
                data:data
            }
        });

        modalInstance.result.then(function (model) {
            if(!isEdit)
                $scope.gridOptions.data.push(model);
        }, function () {
            if(isEdit)
			    delete_copy($scope.model);
        });
    };
/* ------------------------------ refresh ------------------------------ */
    $scope.refresh=function(){
        $scope.isLoading.grid=true;
        modelManager.loadAll().then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
            $scope.isLoading.grid=false;
        });
    };
/* ------------------------------ search ------------------------------ */
    $scope.fieldssearch=[];
    $scope.search = {};
    $scope.issearch = false;
    function initfieldssearch()
    {
        for(var j=0;j<data.tabs.length;j++)
        {
            var tab=data.tabs[j];
            for(var i=0;i<tab.fields.length;i++)
            {
                var field=tab.fields[i];
                if(field.search==true)
                {
                    $scope.search[field.field]='';
                    $scope.fieldssearch.push(field);
                }
            }
        }
        if($scope.fieldssearch.length>0)
            $scope.issearch = true;
    }
    initfieldssearch();


    $scope.showSearch = false;

    $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            for(var i=0;i<$scope.fieldssearch.length;i++)
            {
                 $scope.search[$scope.fieldssearch[i].field]='';
            }
            // $scope.search = {
            //     field1: '',
            //     field2: ''
            // };
            $scope.doSearch();
        }
    };

    $scope.doSearch = function() {
        $scope.isLoading.grid=true;
        var searchFields = [];
        for(var i=0;i<$scope.fieldssearch.length;i++)
        {
            var filed=$scope.fieldssearch[i];
            var vop='orlike';
            if(i==0)vop='like';

            //$scope.search[filed.field]='';

            if ( $scope.search[filed.field].trim() != '')
            {
                searchFields.push({
                    field:data.tablename+ '.'+filed.field,
                    value: $scope.search[filed.field],
                    op: vop
                });
            }
        }

        return modelManager.search(searchFields,$scope.newPage,$scope.pageSize).then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
            $scope.isLoading.grid=false;
        });
    };














}]);
;dasApp.controller('pagesController', ["$scope", "$http", "entityManager", "$uibModal", "$routeParams", function($scope, $http,entityManager,$uibModal,$routeParams) {
	var section_id = $routeParams.section_id;
	$scope.is_section = false;
	$scope.isLoading ={
        grid:true
    };
	
	$scope.pageSize = 10;
	$scope.newPage = 1;
	
	if(typeof section_id !== 'undefined')
	{
		$scope.is_section = true;
		
		var filter = [];
		filter.push({
			field: 'sections.section_id',
			value: section_id,
			
		});
		var sectionsManager = new entityManager(dasApp.apiBase + 'sections/','section_id',{data:'results'});
	
		sectionsManager.search(filter).then(function(data){
		$scope.title=data.results[0].section_title_en;
		
		});
	}
	else
	{
		$scope.title="Pages";
	}
    $scope.gridOptions= {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {width:120,field :'page_title_en' ,displayName: 'Title En'},
            {width:120,field :'page_title_ar' ,displayName: 'Title Ar'},
			{width:120,field :'page_slug' ,displayName: 'Slug'},
            {width:120,field :'section_title_en' ,displayName: 'Section Title En'},
			{width:120,field :'section_title_ar' ,displayName: 'Section Title Ar'},
			{minWidth:200,field :'page_description_en' ,displayName: 'Description En'},
            {minWidth:200,field :'page_description_ar' ,displayName: 'Description Ar'},
            
            {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:
                '<div>' +
                    '<button class="btn btn-xs btn-success" uib-tooltip="Edit Page" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                    '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Page" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				$scope.pageSize = pageSize;
				$scope.newPage = newPage;
				
               $scope.isLoading.grid = true;
                
				
				if($scope.is_section == true)
				{
					var filter = [];
					filter.push({
						field: 'pages.section_id',
						value: section_id,
						
					});
					pagesManager.search(filter).then(function(data){
					$scope.gridOptions.data = data.results;
					$scope.gridOptions.totalItems = data.total;
					 $scope.isLoading.grid = false;
				});
				}else{
					pagesManager.loadAll(newPage,pageSize).then(function(data){
						 $scope.isLoading.grid = false;
						$scope.gridOptions.data = data.results;
						$scope.gridOptions.totalItems = data.total;
					});
				}

            });
        }
    };
	$scope.isLoading.grid = true;
    $scope.selectedSection = {};
    $scope.selectedSectionChanged = function(o){ 
        $scope.search.section_id = o.section_id;
        $scope.selectedSection = o;
        $scope.doSearch();
    };
 

    var pagesManager = new entityManager(dasApp.apiBase + 'pages/','page_id',{data:'results'});
	if($scope.is_section == true)
		{
			var filter = [];
			filter.push({
				field: 'pages.section_id',
				value: section_id,
				
			});
			pagesManager.search(filter).then(function(data){
			$scope.gridOptions.data = data.results;
			$scope.gridOptions.totalItems = data.total;
			$scope.isLoading.grid = false;
   
		});
	}else{
		pagesManager.loadAll().then(function(data){
			$scope.gridOptions.data = data.results;
			$scope.gridOptions.totalItems = data.total;
			$scope.isLoading.grid = false;
   
		});
	}

    //load sections for search
    $scope.sections = [];
    var  sectionsManager = new entityManager(dasApp.apiBase + 'sections','section_id');
    sectionsManager.loadAll().then(function(data){
        $scope.sections = data.results;
    });


    $scope.sectionsTree = [];
    var  sectionsTreeManager = new entityManager(dasApp.apiBase + 'sections/tree','section_id');
    sectionsTreeManager.loadAll().then(function(data){
        $scope.sectionsTree = data.results;
    });


    $scope.search = {
        page_title: '',
        page_description: '',
        section_id : 0
    };

    $scope.showSearch = false;

    $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            $scope.search = {
                page_title: '',
                page_description: '',
                section_id : 0
            };
            $scope.doSearch();
        }
    };

    $scope.doSearch = function() {
        var searchFields = [];
        if ($scope.search.page_title.trim() != '') {
            searchFields.push({
                field: 'pages.page_title_en',
                value: $scope.search.page_title,
                op: 'like'
            });
            searchFields.push({
                field: 'pages.page_title_ar',
                value: $scope.search.page_title,
                op: 'orlike'
            });
        }
        if($scope.search.page_description.trim()!='')
        {
             searchFields.push( {
                 field: 'pages.page_description_en',
                 value: $scope.search.page_description,
                 op: 'orlike'
                }
            );
            searchFields.push( {
                 field: 'pages.page_description_ar',
                 value: $scope.search.page_description,
                 op: 'orlike'
                }
            );
        }

        if($scope.search.section_id )
        {
             searchFields.push( {
                 field: 'pages.section_id',
                 value: $scope.search.section_id,
                 op: 'eq'
                }
            );
        }
		$scope.isLoading.grid = true;
        return pagesManager.search(searchFields,$scope.newPage,$scope.pageSize).then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
			 $scope.isLoading.grid = false;
        });
    };

    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    }

    $scope.add = function (isEdit,entity ) {
		$scope.page = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/pages/form.html',
            controller: 'addPageController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Page',
                    isEdit: isEdit ? true : false,
					is_section:$scope.is_section,
					section_id:section_id,
                    section: $scope.selectedSection
					
                },
                pagesManager : pagesManager,
                page: isEdit ? entity : {section_id :  $scope.selectedSection.section_id ,custom_fields:[],custom_field_values:[]}
            }
        });


        modalInstance.result.then(function (page) {
            if(!isEdit)
                $scope.gridOptions.data.push(page);
        }, function () {
			delete_copy($scope.page);
        
        });
    };


    $scope.delete = function (page) {
        $scope.page  = page;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        page = $scope.page;
        pagesManager.delete(page.page_id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(page);
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
;dasApp.controller('productsController', ["$scope", "$http", "entityManager", "$uibModal","$window", function($scope, $http,entityManager,$uibModal,$window ) {
    $scope.title="Products";
	$scope.isLoading ={
        grid:true
    };
	$scope.pageSize = 10;
	$scope.newPage = 1;
	
    $scope.gridOptions= {
        useExternalPagination: true,
         paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        rowHeight: 128,
        columnDefs : [
            //{field :'product_id' ,displayName: 'Id'},
            { width:120,
                field :'product_image_en' ,
                displayName: 'Image En',
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><img src="{{row.entity.thumb_en}}" class="img-responsive"></div>'
            },
            { width:120,field :'product_image_ar' ,
                displayName: 'Image Ar',
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><img src="{{row.entity.thumb_ar}}" class="img-responsive"></div>'
            },
            { width:120,field :'product_name_en' ,displayName: 'Name En'},
            { width:120,field :'product_name_ar' ,displayName: 'Name Ar'},
            {   width:120,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">{{row.entity.category_name_ar}} | {{row.entity.category_name_en}}</div>'
                ,field :'category_name_ar' ,name: 'Category'
            },
            { width:120,field :'product_price' ,displayName: 'Price'},
            { minWidth:200, field :'product_description_en' ,displayName: 'Description En'},
            {minWidth:200, field :'product_description_ar' ,displayName: 'Description Ar'},
            { width:120,
                pinnedRight:true,
                name:'Actions',
                cellTemplate:
                '<div>' +
                    '<button class="btn btn-xs btn-success" uib-tooltip="Edit Product" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                    '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Product" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				$scope.pageSize = pageSize;
				$scope.newPage = newPage;
                $scope.isLoading.grid=true;
				productsManager.loadAll(newPage,pageSize).then(function(data){
					
					$scope.isLoading.grid=false;
					$scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });
        }
    };
    $scope.isLoading.grid=true;
    var productsManager = new entityManager(dasApp.apiBase + 'products/','product_id',{data:'results'});
    productsManager.loadAll().then(function(data){
		
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
        $scope.isLoading.grid=false;
    });

    //load cattegories for search
    $scope.categories = [];
    var  categoriesManager = new entityManager(dasApp.apiBase + 'categories','category_id');
    categoriesManager.loadAll().then(function(data){
        $scope.categories = data.results;
    });

    $scope.search = {
        product_name: '',
        product_description: '',
        category_id : 0
    };

    $scope.showSearch = false;

    $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            $scope.search = {
                product_name: '',
                product_description: '',
                category_id : 0
            };
            $scope.doSearch();
        }
    };

    $scope.doSearch = function() {
        $scope.isLoading.grid=true;
        var searchFields = [];
        if ($scope.search.product_name.trim() != '') {
            searchFields.push({
                field: 'products.product_name_en',
                value: $scope.search.product_name,
                op: 'like'
            });
            searchFields.push({
                field: 'products.product_name_ar',
                value: $scope.search.product_name,
                op: 'orlike'
            });
        }
        if($scope.search.product_description.trim()!='')
        {
             searchFields.push( {
                 field: 'products.product_description_en',
                 value: $scope.search.product_description,
                 op: 'orlike'
                }
            );
            searchFields.push( {
                 field: 'products.product_description_ar',
                 value: $scope.search.product_description,
                 op: 'orlike'
                }
            );
        }

        if($scope.search.category_id )
        {
             searchFields.push( {
                 field: 'products.category_id',
                 value: $scope.search.category_id,
                 op: 'eq'
                }
            );
        }

        return productsManager.search(searchFields,$scope.newPage,$scope.pageSize).then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
            $scope.isLoading.grid=false;
        });
    };

    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    }

    $scope.add = function (isEdit,entity ) {
		$scope.product = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/products/form.html',
            controller: 'addProductController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Product',
                    isEdit: isEdit ? true : false,
                },
                productsManager : productsManager,
                product: isEdit ? entity : {}
            }
        });


        modalInstance.result.then(function (product) {
            if(!isEdit)
                $scope.gridOptions.data.push(product);
			
        }, function () {
			 delete_copy($scope.product);
		
        });
    };


    $scope.delete = function (product) {
        $scope.product  = product;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        product = $scope.product;
        productsManager.delete(product.product_id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(product);
            $scope.gridOptions.data.splice(index, 1);
            $scope.gridOptions.totalItems = $scope.gridOptions.totalItems-1;
            $scope.modalInstance.close();
        }, function () {

        });
    };

    $scope.cancel = function(item)
    {
		$scope.modalInstance.dismiss('cancel');
    };

    $scope.refresh=function(){
        $scope.isLoading.grid=true;
        products.loadAll().then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
            $scope.isLoading.grid=false;
        });
    };





}]);
;dasApp.controller('sectionsController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Sections";
	$scope.msg="";
	$scope.err = false;
	$scope.isLoading ={
        grid:true
    };
    $scope.gridOptions= {
        useExternalPagination: true,
        paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
        showTreeExpandNoChildren: false,
       rowSelection: true,
        columnDefs : [
			 {width:130,field :'section_title_en' ,name: 'Name En'},
            {width:130,field :'section_title_ar' ,name: 'Name Ar'},
			{width:130,field :'section_slug' ,name: 'Slug'},
            {minWidth:200,field :'section_description_en' ,name: 'Description En'},
            {minWidth:200,field :'section_description_ar' ,name: 'Description Ar'},
            {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div>' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Section" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Section" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.treeBase.on.rowExpanded($scope, function(row) {
                
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) { 
                
            }); 
        }
    };

var writeoutNode = function( childArray, currentLevel, dataArray ){
  childArray.forEach( function( childNode ){
//    if ( childNode.children.length > 0 ){
      childNode.$$treeLevel = currentLevel;
//    }
    dataArray.push( childNode );
    writeoutNode( childNode.sections, currentLevel + 1, dataArray );
  });
};
	 
    var rootSectionsManager = new entityManager(dasApp.apiBase + 'sections/tree/','section_id',{data:'results'}); 
    var sectionsManager = new entityManager(dasApp.apiBase + 'sections/','section_id',{data:'results'}); 
 
    function loadData(){
        $scope.isLoading.grid = true;
        $scope.gridOptions.data = [];
        rootSectionsManager.loadAll(1,100).then(function(data){  
            $scope.sections = data.results;
            //var rootSections = $.grep( data.results,function(j,i){return (j.parent_id ==  0) && !(j.$$treeLevel = 0); });
            var sections = writeoutNode($scope.sections,0,$scope.gridOptions.data);
            //$scope.gridOptions.data = rootSections;
            $scope.gridOptions.totalItems = $scope.gridOptions.data.length;
            $scope.isLoading.grid = false;
        });
    }
   loadData();

    $scope.search = {

    };

    $scope.showSearch = false;

    $scope.toggleSearchBox = function(){
        $scope.showSearch = !$scope.showSearch;
        //reset search parameters and refill grid with unfiltered results
        if(!$scope.showSearch)
        {
            $scope.search = {

            };
            $scope.doSearch();
        }
    };

    $scope.doSearch = function(){
        var searchFields = [];
        /*if($scope.search.product_name.trim()!='')
         searchFields.push( {
         field: 'product.product_name',
         value: $scope.search.product_name,
         op: 'like'
         }
         );*/

        return sectionsManager.search(searchFields).then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
        });
    };

    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
			$scope.section = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/sections/form.html',
            controller: 'addSectionController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Section',
                    isEdit: isEdit ? true : false,
                },
                sectionsManager : sectionsManager,
                section: isEdit ? entity : {custom_fields:[]}
            }
        });

        modalInstance.result.then(function (section) {
            if(!isEdit)
                $scope.gridOptions.data.push(section);
            loadData();
        }, function () {
			delete_copy($scope.section);
		});
    };


    $scope.delete = function (section) {
        $scope.section  = section;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        section = $scope.section;
        sectionsManager.delete(section.section_id) .then(function(response){
				var index = $scope.gridOptions.data.indexOf(section);
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

    $scope.refresh=function(){
        products.loadAll().then(function(data){
            $scope.gridOptions.data = data.results;
            $scope.gridOptions.totalItems = data.total;
        });
    };





}]);
;dasApp.controller('slidersController', ["$scope", "$http", "entityManager", "$uibModal", function($scope, $http,entityManager,$uibModal) {
    $scope.title="Sliders";
	$scope.isLoading ={
        grid:true
    };
    $scope.gridOptions= {
        useExternalPagination: true,
         paginationPageSizes: [10, 15, 30],
        paginationPageSize: 10,
       rowSelection: true,
        columnDefs : [
            {minWidth:120,field :'slider_name' ,displayName: 'Slider Name'},
            {minWidth:200,field :'slider_title_en' ,displayName: 'Title En'},
            {minWidth:200,field :'slider_title_ar' ,displayName: 'Title Ar'},
              {width:120,pinnedRight:true,
                name:'Actions',
                cellTemplate:	'<div> &nbsp;' +
                '<button class="btn btn-xs btn-success" uib-tooltip="Edit Slider" tooltip-placement="right" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button> '+
                '<button class="btn btn-xs btn-danger" uib-tooltip="Delete Slider" tooltip-placement="bottom" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-trash"></i></button>'+
                '</div>'
            }

        ],
        data:[],
        onRegisterApi: function(gridApi) {
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                 $scope.isLoading.grid = true;
                slidersManager.loadAll(newPage,pageSize).then(function(data){
                    $scope.isLoading.grid = false;
                    $scope.gridOptions.data = data.results;
                    $scope.gridOptions.totalItems = data.total;
                });

            });

        }
    };
 $scope.isLoading.grid = true;
    var slidersManager = new entityManager(dasApp.apiBase + 'sliders/','slider_id',{data:'results'});
    slidersManager.loadAll().then(function(data){
        $scope.gridOptions.data = data.results;
        $scope.gridOptions.totalItems = data.total;
		 $scope.isLoading.grid = false;
    });


    $scope.edit = function (entity ) {
		entity = copy_object(entity);
        $scope.add(true,entity);
    };

    $scope.add = function (isEdit,entity ) {
		$scope.slider = entity;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: dasApp.baseUrl + 'assets/dashboard/views/sliders/form.html',
            controller: 'addSliderController',
            size: 'lg',
            resolve: {
                options: {
                    title:	(isEdit ? 'Edit' : 'Add') + ' Slider',
                    isEdit: isEdit ? true : false,
                },
                slidersManager : slidersManager,
                slider: isEdit ? entity : {}
            }
        });


        modalInstance.result.then(function (slider) {
            if(!isEdit)
                $scope.gridOptions.data.push(slider);
        }, function () {
			delete_copy($scope.slider);
        
        });
    };

    $scope.delete = function (slider) {
        $scope.slider  = slider;
        $scope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'DeleteDialog.html',
            scope:$scope
        });
    };

    $scope.confirm_delete = function () {
        slider = $scope.slider;
        slidersManager.delete(slider.slider_id) .then(function(response){
            var index = $scope.gridOptions.data.indexOf(slider);
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
; dasApp.controller('usersController', ["$scope", "$http", "entityManager", "$uibModal", "$routeParams", function($scope, $http,entityManager,$uibModal,$routeParams) {
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
