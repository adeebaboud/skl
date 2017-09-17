

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
