angular.module('edec').controller('activitatiUseriCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
    $scope.activitati = $stateParams.activitati;
    $scope.getFirstWord = $stateParams.getFirstWord;
    $scope.goToUserPage = $stateParams.goToUserPage;
    $scope.getMiddleSentence = $stateParams.getMiddleSentence;
    $scope.goToPage = $stateParams.goToPage;
}]);