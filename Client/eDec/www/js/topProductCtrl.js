angular.module('edec').controller('TopProductCtrl', ['$scope', '$cordovaBarcodeScanner', '$state','$http','$rootScope','$ionicPopup', function ($scope, $cordovaBarcodeScanner, $state,$http,$rootScope,$ionicPopup) {
    $scope.getTopProducts=function(){

          var requestForTopProducts=$http.get('https://nodeserve-cypmaster14.c9users.io/top5Products');

          requestForTopProducts.success(function(data,status,headers,config){

              if(status==200)
              {
                console.log(JSON.stringify(data.topProduse));
                $scope.produse=data.topProduse;
                //$scope.topProduse=data.topProduse;
              }

          });

          requestForTopProducts.error(function(data,status,headers,config){

          });
    };

    $scope.clickOnProduct=function(cod){
      $state.go("tabs.product", { 'ok': 'ok', 'barcode': cod }, {
          reload: true,
      });
    };

}]);
