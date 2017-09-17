dasApp.factory('entity', ['$http', function($http) {  
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
