
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
