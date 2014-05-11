'use strict';
angular.module('Yoionic.controllers', [])

.controller('DashCtrl', function($scope) {

  $scope.names = ['Igor Minar', 'Brad Green', 'Dave Geddes', 'Naomi Black', 'Greg Weber', 'Dean Sofer', 'Wes Alvaro', 'John Scott', 'Daniel Nadasi'];
})

.controller('FriendsCtrl', function($scope, Friends, $timeout) {
	$timeout(function () {
  	$scope.friends = Friends.all();
  } , 1000 );

  $scope.addlist = function () {
  	$scope.extra = [
    { id: 4, name: 'Scruff McGruff' },
    { id: 5, name: 'G.I. Joe' },
    { id: 6, name: 'Miss Frizzle' },
    { id: 7, name: 'Ash Ketchum' }
  ];
  	$scope.friends = $scope.friends.concat($scope.extra);
  }
  
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends, $timeout) {
	$scope.friend = "";
  
})

.controller('AccountCtrl', function($scope) {
});
