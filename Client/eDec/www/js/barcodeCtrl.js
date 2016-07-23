angular.module('edec').controller("BarCode", ['$scope', '$cordovaBarcodeScanner', '$state','$http','$rootScope','$ionicPopup', function ($scope, $cordovaBarcodeScanner, $state,$http,$rootScope,$ionicPopup) {
    $scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
            var requestForCheckingIfProductExists=$http.get('https://nodeserve-cypmaster14.c9users.io/productExists?barcode='+imageData.text);

            requestForCheckingIfProductExists.success(function(data,status,headers,config){
              if(status==200)
                console.log("Produsul exista");
                $state.go("tabs.product", { 'ok': 'ok', 'barcode': imageData.text }, {reload: true});
            });

            requestForCheckingIfProductExists.error(function(data,status,headers,config){
              if(status==409)
              {
                console.log("Produsul nu exista");
                if(!imageData.text || imageData.text.length===0)
                {
                    $state.go("tabs.home");
                    return;

                }
                var getMyReputationRequest=$http.get('https://nodeserve-cypmaster14.c9users.io/getReputation?email='+$rootScope.user);

                getMyReputationRequest.success(function(data,status,headers,config){

                    if(status==200)
                    {
                      if(parseInt(data.reputatie)>500)
                      {
                          $scope.showConfirm(imageData.text);
                          $rootScope.reputation=data.reputatie;// actualizez reputatia
                          window.localStorage.setItem("reputation",$rootScope.reputation); //actualizez si localeStorage
                      }

                      else
                      {
                        $state.go("tabs.home");
                        $scope.showAlert("Product", "Product was not found");
                      }
                    }
                });

                getMyReputationRequest.error(function(data,status,headers,config){
                    if(status==409)
                    {
                      $state.go("tabs.home");
                      $scope.showAlert("Product", "Product was not found");
                    }
                });

                $state.go("tabs.home");
              }
            });


        }, function (error) {
            $state.go("tabs.home");
        });
    };


    $scope.showConfirm=function(barcode){
        var confirmPopup=$ionicPopup.confirm({
            title:"Inserare produs",
            template:"Doriti sa inserati produsul cu barcode-ul:"+barcode
        });

        confirmPopup.then(function(res){
            if(res) // a dat ok, vrea sa insereze produsul
            {
              console.log("Am dorit sa introduc produsul:"+barcode);
              $rootScope.barcodeDeIntrodus = barcode;
              $state.go("tabs.addProduct", { 'ok': 'ok','barcode': barcode }, {reload: true});
            }
            else {
              console.log("Nu vreau sa inserez produsul");
            }
        });
    };

}]);
