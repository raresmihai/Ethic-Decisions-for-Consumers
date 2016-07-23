angular.module('edec').config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    

    $stateProvider
      .state('tabs', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
      })
      .state('tabs.home', {
          url: "/home",
          cache: false,
          views: {
              'home-tab': {
                  templateUrl: "templates/home.html"
              }
          }
      })
      .state('tabs.campanii', {
          url: "/campanii",
          cache: false,
          views: {
              'home-tab': {
                  templateUrl: "templates/campanii.html"
              }
          }
      })
      .state('tabs.activitatiUseri', {
          url: "/activitatiUseri",
          params: {
              activitati: null,
              getFirstWord: null,
              goToUserPage: null,
              getMiddleSentence: null,
              goToPage:null
          },
          cache: false,
          views: {
              'home-tab': {
                  templateUrl: "templates/activitatiUseri.html"
              }
          }
      })
      .state('tabs.facts', {
          url: "/facts",
          views: {
              'home-tab': {
                  templateUrl: "templates/facts.html"
              }
          }
      })

      .state('tabs.profile', {
        url:"/profile",
		cache: false,
        views:{
            "home-tab":{
              templateUrl:"templates/profile.html"
            }
        }
      })

      .state('tabs.addProduct',{
        url:"/addProduct",
		cache: false,
        views:{
            "home-tab":{
              templateUrl:"templates/addProduct.html"
            }
        }
      })

      .state('tabs.restrictivi',{
        url:"/restrictivi",
        views:{
            "home-tab":{
              templateUrl:"templates/restrictivi.html"
            }
        }
      })

      .state('tabs.topProducts',{
        url:"/topProducts",
        views:{
            "home-tab":{
              templateUrl:"templates/topProducts.html"
            }
        }
      })

      .state('tabs.register',{
          url:"/register",
          views: {
              'home-tab': {
                  templateUrl: "templates/register.html"
              }
          }
      })
	  .state('tabs.campaign',{
		url:"/campaign",
		 params: {	campaign_name: null,
					campaign_id: null,
					campaign_description: null,
					imagine: null,
					creation_date: null,
					administrator: null,
          first_name: null,
          last_name: null,
					product_name: null,
					product_barcode: null,
          email_creator_campanie:null
		 },
		views: {
			'home-tab':{
				templateUrl: "templates/campaign.html"
			}
		}
	  })
	  .state('tabs.createCampaign',{
		url:"/createCampaign",
		cache: false,
		params:
		{ "ok":"ok",
             "barcode" : "empty",
			  "name": "empty"
		},
		views: {
			'home-tab':{
				templateUrl: "templates/createCampaign.html"
			}
		}
	  })

      .state('tabs.product', {
          url: "/product",
          cache: false,
          params:
         { "ok":"ok",
             "barcode" : "empty"},
          views: {
              'home-tab': {
                  templateUrl: "templates/product.html"
              }
          }
      })

	  .state('tabs.publicProfilePage', {
          url: "/publicProfilePage",
          params: {
			  user : null,
		  },
          views: {
              'home-tab': {
                  templateUrl: "templates/publicProfilePage.html"
              }
          }
      })

      .state('tabs.search', {
          url: "/search",
		  cache: false,
          views: {
              'search-tab': {
                  templateUrl: "templates/search.html"
              }
          }
      })


      .state('tabs.scan', {
          url: "/scan",
          cache: false,
          views: {
              'scan-tab': {
                  templateUrl: "templates/scan.html"
              }
          }
      });

    $urlRouterProvider.otherwise("/tab/home");

})
