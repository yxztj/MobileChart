'use strict';
angular.module('Yoionic.controllers', [])

.controller('DashCtrl', function($scope, $ionicModal) {

  $scope.names = ['Igor Minar', 'Brad Green', 'Dave Geddes', 'Naomi Black', 'Greg Weber', 'Dean Sofer', 'Wes Alvaro', 'John Scott', 'Daniel Nadasi'];
  
  $ionicModal.fromTemplateUrl('templates/my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true,
    focusFirstDelay: 200,
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
    $scope.password="";

    console.log($scope.modal);
    
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
/*
  $scope.$watch('password', function(newVal, oldVal){
  	
  });*/


  $scope.checkPW = function () {
  	console.log("checking password", $scope.password);
    if($scope.password=="abcd") {
    	console.log("mactched!");
    	$scope.closeModal();
    } 
  }

$.getJSON('highstock-basic-data.json', function (data)    {
  loadChart('cnybtc');
});

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
