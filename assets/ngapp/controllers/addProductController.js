
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


}]);