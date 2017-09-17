dasApp.controller('addSliderController', ["$scope", "entityManager", "$uibModalInstance", "slider", "options", "slidersManager", function ($scope, entityManager, $uibModalInstance,slider,options,slidersManager) {
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
