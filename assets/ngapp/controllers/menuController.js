dasApp.controller('menuController', ["$scope", "$http", "entityManager", function($scope, $http,entityManager) {
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
