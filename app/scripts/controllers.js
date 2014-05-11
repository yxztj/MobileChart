'use strict';
angular.module('Yoionic.controllers', [])

.controller('DashCtrl', function($scope) {

  $scope.names = ['Igor Minar', 'Brad Green', 'Dave Geddes', 'Naomi Black', 'Greg Weber', 'Dean Sofer', 'Wes Alvaro', 'John Scott', 'Daniel Nadasi'];
})

.controller('FriendsCtrl', function($scope, Friends, $timeout) {
	$timeout(function () {
  	$scope.friends = Friends.all();
  } , 1000 );
  
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends, $timeout) {
	$scope.friend = "";
  
})

.controller('AccountCtrl', function($scope) {
});
