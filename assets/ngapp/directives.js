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
