angular.module('edec', ['ionic', 'ngCordova'])

.value('pagina',1)
.value('lastSearchedProduct','')
.value('logat',false)
.value('user',"")

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
   
    

})


.directive('gestureOnHold',function($ionicGesture ) {
    return function(scope,element,attrs) {
        $ionicGesture.on('hold',function() {
            scope.$apply(function() {
                scope.$eval(attrs.gestureOnHold);
            });
        },element);
    };
})

.config(function($httpProvider) {
    //Enable cross domain calls
   //  $httpProvider.defaults.useXDomain = true;

   //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

    //Remove the header containing XMLHttpRequest used to identify ajax call
    //that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
