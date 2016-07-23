angular.module('edec').controller('CampaignCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
	
	$scope.getNumberOfMembersFor=function(campaign){	
		var membersResponse = $http.post('https://nodeserve-cypmaster14.c9users.io/getNumberOfMembersFor',campaign);
		
		membersResponse.success(function(data,status,headers,config){
			if (status == 200){
				$scope.campaign_nrUsers=data.nrUsers;
			}
		});
		
		membersResponse.error(function (data, status, headers, config) {
            alert("Error on request la obtinerea numarului de membri" + status + ' ' + headers);

        });
	}
	
	$scope.goToPoductPage=function(product_barcode){
		$state.go("tabs.product", { 'ok': 'ok', 'barcode': product_barcode }, {
          reload: true
      });
	}
	
	if ($stateParams.campaign_id!=null) {
		$scope.campaign_name=$stateParams.campaign_name;
        $scope.campaign_id = $stateParams.campaign_id;
		$scope.campaign_description=$stateParams.campaign_description;
		$scope.campaign_image=$stateParams.imagine;
		$scope.creation_date=$stateParams.creation_date.substring(0,10);
		$scope.administrator=$stateParams.administrator;
        $scope.first_name=$stateParams.first_name;
        $scope.last_name=$stateParams.last_name;
        $scope.product_barcode = $stateParams.product_barcode;
        console.log($scope.product_barcode);
		$scope.product_name=$stateParams.product_name;
        //console.log($scope.product_name);
		$scope.getNumberOfMembersFor($stateParams);
        $scope.isLogged=$rootScope.logat;
        $scope.email_creator_campanie=$stateParams.email_creator_campanie;
		
		var aAderat = $http.get('https://nodeserve-cypmaster14.c9users.io/aderatCampanie?campaignId=' + $scope.campaign_id + '&administrator=' + $scope.administrator);
		aAderat.success(function (data, status, headers, config) {
            if (status == 200) {
                $scope.aAderat = data.aAderat;
				if($scope.aAderat==1){
					$scope.buttonText="Ati aderat la aceasta campanie!";
				}
				else{
					$scope.buttonText="Aderati la campanie!";
				}
			}

        });
		var resComments = $http.get('https://nodeserve-cypmaster14.c9users.io/contents?campaignId=' + $scope.campaign_id);
        resComments.success(function (data, status, headers, config) {
            if (status == 200) {
                $scope.comentarii = data.comentarii;
                }
        });
	}
	else{
		alert("empty");
	}
	$scope.joinCampaign=function(){
	 if (!$rootScope.logat || $rootScope.logat == false) {
        $scope.showAlert('LogIn', 'Trebuie sa fiti logat!');
        return;
     }	
	 else{
        var aAderat = $http.get('https://nodeserve-cypmaster14.c9users.io/aderareCampanie?campaignId=' + $scope.campaign_id + '&administrator=' + $scope.administrator);
		aAderat.success(function (data, status, headers, config) {
            if (status == 200) {
				$scope.showAlert("Ati aderat cu succes!");
				$scope.buttonText="Ati aderat la aceasta campanie!";
				$scope.aAderat=1;
				var membersResponse = $http.post('https://nodeserve-cypmaster14.c9users.io/getNumberOfMembersFor',$stateParams);
				membersResponse.success(function(data,status,headers,config){
					if (status == 200){
						$scope.campaign_nrUsers=data.nrUsers;
					}
		}		);
		
		membersResponse.error(function (data, status, headers, config) {
            alert("Error on request la obtinerea numarului de membri" + status + ' ' + headers);

        });
            }
        });
	 }
	}
	$scope.postareComentariu = function () {
            if (!$rootScope.logat || $rootScope.logat == false) {
                $scope.showAlert('LogIn', 'Trebuie sa fiti logat!');
                return;
            }
            if ( $scope.iol && $scope.iol.length !== 0 && $scope.titlu  && $scope.titlu.length!==0) {
                var content = $scope.iol;

                var obj = {
                    email: $rootScope.user,
                    title: $scope.titlu,
                    content: content,
					campaign_id:$scope.campaign_id
                };

                $scope.titlu = "";
                $scope.iol = "";
                var res = $http.post('https://nodeserve-cypmaster14.c9users.io/adaugaComentariuCampanie',obj);
                res.success(function (data, status, headers, config) {

                    if (status == 200) {
                        $scope.showAlert('Postare mesaj', 'Mesajul a fost postat cu succes');
                        var resComments = $http.get('https://nodeserve-cypmaster14.c9users.io/contents?campaignId=' + $scope.campaign_id);
                        resComments.success(function (data, status, headers, config) {
                            if (status == 200) {
                                $scope.comentarii = data.comentarii;
                            }

                        });

                        resComments.error(function (data, status, headers, config) {
                            alert("Error on request la obtinerea comentariilor" + status + ' ' + headers);
                        });
                    }
                });


                res.error(function (data,status,headers,config) {
                    if(status==409)
                    {
                      $scope.showAlert('Comentariu',"Comentariul nu a putut fi procesat");
                    }

                });


            }
			else{
              $scope.showAlert('Comentariu','Completati toate campurile');
              return;
            }

    };
    $scope.goToUserPage=function(user){
        $state.go('tabs.publicProfilePage',{'user':user});
    }
}]);
   