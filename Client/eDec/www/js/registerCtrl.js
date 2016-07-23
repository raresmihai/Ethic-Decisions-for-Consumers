angular.module('edec').controller("registerPerson", ['$scope', '$http', '$window', '$ionicPopup', '$timeout', function ($scope, $http, $window, $ionicPopup, $timeout) {

    $scope.showAlert = function (titlu, mesaj) {
        var alertPopup = $ionicPopup.alert({
            title: titlu,
            template: mesaj
        });

        alertPopup.then(function (res) {

        });
    };

    $scope.register = function () {

        if (!$scope.email || !$scope.firstName || !$scope.lastName || !$scope.password) {

            $scope.showAlert('Try Again', "All field must be completed");
            return;
        }

        var email = $scope.email;
        var firstName = $scope.firstName;
        var lastName = $scope.lastName;
        var password = $scope.password;

        var obj = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password
        };

        var res = $http.post('https://nodeserve-cypmaster14.c9users.io/register', obj);
        res.success(function (data, status, headers, config) {
            if (status == 200) {
                $scope.mesaj = data;

                if ($scope.mesaj.text.localeCompare('Account created') == 0) {
                    $scope.showAlert('Register', 'Succes');
                    $window.location.href = "/#/tab/facts";
                }

                else {
                    $scope.showAlert('Registration failed', $scope.mesaj.text);
                }
            }
        });

        res.error(function (data, status, headers, config) {
            alert("Error on request" + status + ' ' + headers);

        });

    };

}]);