angular.module('edec').controller('publicProfileCtrl',['$scope','$state','$stateParams','$http','$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet) {

  $scope.getUserInfo=function()
  {
    $scope.email=$stateParams.user;
    var requestForCampaign=$http.get('https://nodeserve-cypmaster14.c9users.io/myCampaign?user='+$scope.email);
    requestForCampaign.success(function(data,status,headers,config){
        if(status==200)
        {
		  $scope.firstName=data.firstName;
		  $scope.lastName=data.lastName;
		  $scope.reputation=data.reputation;
          $scope.campanii=data.listaCampanii;
          $scope.areCampanii=true;
        }
    });

    requestForCampaign.error(function(data,status,headers,config){
        if(status==409)
        {
          $scope.areCampanii=false;
        }
    });

    var requestForPreferences=$http.get('https://nodeserve-cypmaster14.c9users.io/getUserPreferences?email='+$scope.email);
    requestForPreferences.success(function(data,status,headers,config){
          if(status==200)
          {
            $scope.preferinteLike=data.like;
            $scope.preferinteDislike=data.dislike;
            $scope.preferinteAlert=data.alert;
            $scope.arePreferinte=true;
          }
    });

    requestForPreferences.error(function(data,status,headers,config){
      /*if(status==409)
      {
        $rootScope.preferinteLike=null;
        $rootScope.preferinteDislike=null;
        $rootScope.preferinteAlert=null;
        $rootScope.arePreferinte=false;
      }*/
    });
  };

  $scope.goToCampaign=function(campaign)
  {
	var res=$http.get("https://nodeserve-cypmaster14.c9users.io/trimiteCampaniePeBazaID?campaign_id="+campaign.id);
	
	res.success(function(data,status,headers,config){
          if(status==200)
          {
			$state.go("tabs.campaign",
                {
                    campaign_name: data.campaign_name,
					campaign_id: campaign.id,
					campaign_description: data.description,
					imagine: data.campaign_photo,
					creation_date: data.creation_date,
					administrator: data.email_creator_campanie,
					first_name: data.first_name,
					last_name: data.last_name,
					email_creator_campanie: data.email_creator_campanie,
					product_name: data.product_name,
					product_barcode: data.product_barcode
                }
			);
          }
    });
	
	res.error(function(data,status,headers,config){

    });
  };
}]);
