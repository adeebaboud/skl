dasApp.controller('addModelController', ["$scope", "$http", "entityManager", "$uibModalInstance", "model", "options", "modelManager", "data", function ($scope,$http, entityManager, $uibModalInstance,model,options,modelManager,data) {

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
