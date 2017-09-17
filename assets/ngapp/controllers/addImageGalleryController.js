dasApp.controller('addImageGalleryController', ["$scope", "entityManager", "$uibModalInstance", "model", "options", "modelManager", function ($scope, entityManager, $uibModalInstance,model,options,modelManager) {
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
