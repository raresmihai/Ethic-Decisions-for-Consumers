angular.module('edec').controller('HomeTabCtrl', ['$scope', '$state', '$stateParams', '$ionicPopup', '$timeout', '$rootScope', '$http', '$window','$ionicSideMenuDelegate','$sce', 'logat', 'user', function ($scope, $state, $stateParams, $ionicPopup, $timeout, $rootScope, $http, $window,$ionicSideMenuDelegate, $sce, logat, user) {

    $scope.showAlert = function (titlu, mesaj) {
        var alertPopup = $ionicPopup.alert({
            title: titlu,
            template: mesaj
        });

        alertPopup.then(function (res) {

        });
    };

    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.activate = function (obj) {

    };

	if ($rootScope.lastSearchedProduct == null){
		$rootScope.lastSearchedProduct='';
	}

    $scope.initializeaza = function () {
        $rootScope.logat=false;
        logat=false;
        var aux = window.localStorage.getItem('logat');
        if (aux && aux.localeCompare("true") === 0) {

            //aici voi face requestul pentru campaniile si activitatile userilor filtrate

            $rootScope.user = window.localStorage.getItem('email');
            $rootScope.firstName = window.localStorage.getItem('firstName');
            $rootScope.lastName = window.localStorage.getItem('lastName');
            $rootScope.reputation=window.localStorage.getItem('reputation');
            $rootScope.logat = true;
            $scope.firstname=$rootScope.firstname;
            $scope.lastName=$rootScope.lastName;
            $scope.email=$rootScope.user;
            logat = true;

            var getMyReputationRequest=$http.get('https://nodeserve-cypmaster14.c9users.io/getReputation?email='+$rootScope.user);

            getMyReputationRequest.success(function(data,status,headers,config){
                if(status==200)
                {
                  $rootScope.reputation=data.reputatie;
                  window.localStorage.setItem("reputation",$rootScope.reputation);
                }
            });

            getMyReputationRequest.error(function(data,status,headers,config){

            });
        }
        else{
        }
        var email=$rootScope.user;
            //console.log("Vreau sa aflu campaniile pt:"+email);

            var requestForCampaign=$http.get('https://nodeserve-cypmaster14.c9users.io/trimiteCampanii?user='+email);
            requestForCampaign.success(function(data,status,headers,config){
            if(status==200){
                $rootScope.campanii=data.listaCampanii;
                $scope.campanii=data.listaCampanii;
                $rootScope.areCampanii=true;
                //console.log("campanii:"+JSON.stringify($scope.campanii));

            }
            });
            requestForCampaign.error(function(data,status,headers,config){
                 if(status==409){
                     $rootScope.areCampanii=false;
                     //console.log("Nu am campanii");
                }
            });
            var requestForUserActivities = $http.get('https://nodeserve-cypmaster14.c9users.io/getUserActivities?user=' + email);
            requestForUserActivities.success(function (data, status, headers, config) {
                if (status == 200) {
                    $scope.top3Activitati = data.slice(0, 3);
                    $scope.activitati = data;
                }
            });
    };

    $scope.logout = function () {
        logat = false;
        window.localStorage.clear();
        //aici voi face requestul pentru a lua campaniile si activitatile userilor cele mai recente
        $rootScope.logat = false;
        $rootScope.user = "";
        $rootScope.firstName = "";
        $rootScope.lastName = "";
        $state.go('tabs.home');
        $scope.initializeaza();
    };

    $scope.goToCampaignPage = function(campaign_id)
    {
        var res = $http.get("https://nodeserve-cypmaster14.c9users.io/trimiteCampaniePeBazaID?campaign_id=" + campaign_id);

        res.success(function (data, status, headers, config) {
            if (status == 200) {
                $state.go("tabs.campaign",
                    {
                        campaign_name: data.campaign_name,
                        campaign_id: campaign_id,
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

        res.error(function (data, status, headers, config) {
            console.log("Eroare la navigarea spre campanie");
        });
    };

    $scope.moveToProfilePage=function(user)
    {
        $state.go('tabs.profile');
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.goToCampaigns=function(){
        $state.go('tabs.campanii');
    };

    $scope.goToUsersActivities=function(){
        $state.go('tabs.activitatiUseri', {
                 activitati: $scope.activitati,
                 getFirstWord: $scope.getFirstWord,
                 goToUserPage: $scope.goToUserPage,
                 getMiddleSentence: $scope.getMiddleSentence,
                 goToPage: $scope.goToPage
        });
    };


	$scope.goToPublicProfilePage=function(user){
		$state.go('tabs.publicProfilePage',{'user':user});
	}

    $scope.goToUserPage = function (user) {
		$state.go('tabs.publicProfilePage',{'user':user});
    }

    $scope.goToProductPage = function (barcode) {
        $state.go("tabs.product", { 'ok': 'ok', 'barcode': barcode }, { reload: true });
    }

    $scope.goToPage = function (activitate) {
        if (activitate.action_code == "votare_ingredient") {
            $scope.goToProductPage(activitate.link_id);
        } else {
            $scope.goToCampaignPage(activitate.link_id);
        }
    }

    $scope.clickOnCampaign = function (campaign) {
		$state.go("tabs.campaign", {
			campaign_name: campaign.nume, campaign_id: campaign.id, campaign_description: campaign.descriere,
			imagine: campaign.poza, creation_date: campaign.data, administrator: $rootScope.user,first_name:campaign.first_name,
            last_name:campaign.last_name,email_creator_campanie:campaign.email_creator_campanie,
            product_name: campaign.product_name, product_barcode: campaign.product_barcode
		});
    };


    $scope.moveToWorstUsers=function(){
      $state.go('tabs.restrictivi');
	  $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.moveToTopProducts = function () {
      $state.go('tabs.topProducts');
	  $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.getFirstWord = function getFirstWord(activity) {
        var firstWord = activity.action.split(" ")[0];
        return firstWord;
    };

    $scope.getMiddleSentence = function getMiddleSentence(activity) {
        var action = activity.action;
        action = action.split(" ").splice(3, action.length).join(" ");
        return action;

    };

}]);
