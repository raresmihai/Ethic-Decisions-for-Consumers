angular.module('edec').controller('ProductCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', '$sce', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, $sce, logat, user) {

    if ($stateParams.barcode != "empty") {
        $scope.barcode = $stateParams.barcode;
        $scope.productInfo = {
            barcode: $scope.barcode,
            user: $rootScope.user
        };

        makeRequest();

        function makeRequest() {
            var productResponse = $http.post('https://nodeserve-cypmaster14.c9users.io/productPage', $scope.productInfo);

            productResponse.success(function (data, status, headers, config) {
                if (status == 200) {
                    if (data.mesaj.localeCompare("Gasit") == 0) {
                        $scope.mesaj = data;
                        $scope.comentarii = data.comentarii;
                        $scope.campanii = data.campanii;
                        $scope.nume = data.name;
                        var category = data.category;
                        if (category != "IT, comunicatii si foto" && category != "Tv, electrocasnice si electronice") {
                            $scope.ingrSource = "html/ingredientsButton.html";
                            var ingredients = getProductIngredients(data.product_ingredients, data.user_voted_ingredients);
                            $scope.likedIngredients = getIngredients(ingredients, "Like");
                            $scope.dislikedIngredients = getIngredients(ingredients, "Dislike");
                            $scope.alertedIngredients = getIngredients(ingredients, "Alert");
                            $scope.neutralIngredients = getIngredients(ingredients, "Neutral");
                            $scope.neutralIngredientsDisplayMessage = getNeutralIngredientsDisplayMessage($scope);
                        } 
                        else {
                            $scope.ingrSource = "html/specificationButton.html";
                            $scope.spectypeobjs = data.spectypeobjs;
                            getProductSpecifications($scope.spectypeobjs, data.user_voted_ingredients);
                            $scope.likedSpecifications = getSpecifications($scope.spectypeobjs, "Like");
                            $scope.dislikedSpecifications = getSpecifications($scope.spectypeobjs, "Dislike");
                            $scope.alertedSpecifications = getSpecifications($scope.spectypeobjs, "Alert");
                            $scope.neutralSpecifications = getSpecifications($scope.spectypeobjs, "Neutral");
                            $scope.neutralSpecificationsDisplayMessage = getNeutralSpecificationsDisplayMessage($scope);
                        }

                        var getProductRating=$http.get('https://nodeserve-cypmaster14.c9users.io/rating?barcode='+$scope.barcode);

                        getProductRating.success(function(data,status,headers,config){

                            if(status==200)
                            {
                              switch (data.scor) {
                                case 1:
                                  console.log("Rating produs este:"+1);
                                  $('#group-3-24').prop('checked',true);
                                  break;
                                case 2:
                                  console.log("Rating produs este:"+2);
                                  $('#group-3-23').prop('checked',true);
                                  break;
                                case 3:
                                  console.log("Rating produs este:"+3);
                                  $('#group-3-22').prop('checked',true);
                                  break;
                                case 4:
                                  console.log("Rating produs este:"+4);
                                  $('#group-3-21').prop('checked',true);
                                  break;
                                default:
                                  console.log("Rating produs este:"+5);
                                  $('#group-3-20').prop('checked',true);
                              }
                            }
                        });

                        getProductRating.error(function(data,status,headers,config){

                        });

                        var getSimilarProducts = $http.get('https://nodeserve-cypmaster14.c9users.io/getSimilarProducts?user=' + $rootScope.user + '&barcode=' + $scope.barcode + '&category=' + category);
                        getSimilarProducts.success(function (data, status, headers, config) {
                            if (status == 200) {
                                if (data == "no products") {
                                    $scope.noProducts = true;
                                } else {
                                    $scope.noProducts = false;
                                    var displayedSimilarProducts = getDisplayedSimilarProducts(data);
                                    var reqParams = {
                                        similarProducts: displayedSimilarProducts,
                                        user: $rootScope.user
                                    }
                                    var getLikesReq = $http.post('https://nodeserve-cypmaster14.c9users.io/getNumberOfLikes', reqParams);
                                    getLikesReq.success(function (data, status, headers, config) {
                                        if (status == 200) {
                                            displayedSimilarProducts = data;
                                            displayedSimilarProducts = getRandomSubarray(displayedSimilarProducts, 10) // get 10 random products
                                            displayedSimilarProducts.sort(function (a, b) { //descending sort by similarity
                                                return b.similarity - a.similarity;
                                            });
                                            $scope.similarProducts = displayedSimilarProducts;
                                            $scope.displayProductName = displayProductName;
                                            $scope.clickOnSimilarProduct = clickOnSimilarProduct;
                                        }
                                    });
                                }
                            }
                        });
                        getSimilarProducts.error(function (data, status, headers, config) {
                            alert("Error on request la obtinerea recomandarilor pentru produs " + status + ' ' + headers);
                        });
                    }
                    else {
                        if ($rootScope.logat === true) {
                            if ($rootScope.reputation > 500) {
                                $rootScope.barcodeDeIntrodus = $scope.barcode;
                                $state.go("tabs.addProduct", { 'ok': 'ok' });
                            }
                            else {
                                $state.go("tabs.home");
                                $scope.showAlert("Product", "Reputatie insuficienta");
                            }

                        }
                        else {
                            $state.go("tabs.home");
                            $scope.showAlert("Product", "Product was not found");
                        }

                    }
                }
            });

            productResponse.error(function (data, status, headers, config) {
                alert("Error on request la obtinerea produsului" + status + ' ' + headers);

            });
        }

        function clickOnSimilarProduct(barcode) {
            $state.go("tabs.product", { 'ok': 'ok', 'barcode': barcode });
        }


        function displayProductName(name) {
            var length = name.length;
            var words = name.split(" ");

            if (length <= 30) {
                return $sce.trustAsHtml("<h3>" + name + "</h3>");
            }
            if (length <= 60) {
                var firstLine = words.slice(0, words.length / 2).join(" ");
                var secondLine = words.slice(words.length / 2, words.length).join(" ");
                return $sce.trustAsHtml("<h3>" + firstLine + "<br />" + secondLine + "</h3>");
            }
            var firstLine = words.slice(0, words.length / 3).join(" ");
            var secondLine = words.slice(words.length / 3, words.length / 3 * 2).join(" ");
            var thirdLine = words.slice(words.length / 3 * 2, words.length).join(" ");
            return $sce.trustAsHtml("<h3>" + firstLine + "<br />" + secondLine + "<br />" + thirdLine + "</h3>");
        }

        function getDisplayedSimilarProducts(products) {
            var displayed_similar_products = [];
            for (var i in products) {
                var longest_common_beggining_sequence = getBeginningCommonSubsequence($scope.nume.toUpperCase(), products[i].name.toUpperCase());
                var longest_common_consecutive_sequence = getLongestCommonSubsequence($scope.nume.toUpperCase(), products[i].name.toUpperCase());
                var ingredients_common_ratio = products[i].commonIngr * 2 / products[i].totalNrIngr;
                var similarity_ratio = 45 / 100 * ingredients_common_ratio + 35 / 100 * longest_common_beggining_sequence + 20 / 100 * longest_common_consecutive_sequence;
                var similarProduct = {
                    barcode: products[i].barcode,
                    name: products[i].name,
                    image: products[i].image,
                    similarity: similarity_ratio,
                    commonIngr: products[i].commonIngr,
                    likes: 0
                };
                displayed_similar_products.push(similarProduct);
            }
            displayed_similar_products.sort(function (a, b) { //descending sort by similarity
                return b.similarity - a.similarity;
            });
            displayed_similar_products.splice(21, displayed_similar_products.length); //get top 20 products
            displayed_similar_products = displayed_similar_products.splice(1, displayed_similar_products.length); //remove the same product
            return displayed_similar_products;
        }

        function getBeginningCommonSubsequence(current_product, similar_product) {
            var cp_words = current_product.split(" ");
            var sp_words = similar_product.split(" ");
            var i = 0;
            while (i < cp_words.length && i < sp_words.length && cp_words[i] == sp_words[i]) {
                i++;
            }
            return i / cp_words.length;
        }

        function getLongestCommonSubsequence(current_product, similar_product) {
            var cp_words = current_product.split(" ");
            var sp_words = similar_product.split(" ");
            var longestCommonSubstring = 0;
            // init 2D array with 0
            var table = [],
                    len1 = cp_words.length,
                    len2 = sp_words.length,
                    row, col;
            for (row = 0; row <= len1; row++) {
                table[row] = [];
                for (col = 0; col <= len2; col++) {
                    table[row][col] = 0;
                }
            }
            // fill table
            var i, j;
            for (i = 0; i < len1; i++) {
                for (j = 0; j < len2; j++) {
                    if (cp_words[i] === sp_words[j]) {
                        if (table[i][j] === 0) {
                            table[i + 1][j + 1] = 1;
                        } else {
                            table[i + 1][j + 1] = table[i][j] + 1;
                        }
                        if (table[i + 1][j + 1] > longestCommonSubstring) {
                            longestCommonSubstring = table[i + 1][j + 1];
                        }
                    } else {
                        table[i + 1][j + 1] = 0;
                    }
                }
            }
            return longestCommonSubstring / len1;
        }

        function getRandomSubarray(arr, size) {
            var shuffled = arr.slice(0), i = arr.length, temp, index;
            while (i--) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(0, size);
        }

        function translateOption(option) {
            if ($scope.mesaj.category != "IT, comunicatii si foto" && $scope.mesaj.category != "Tv, electrocasnice si electronice") {
                switch (option) {
                    case "Like":
                        return "va  place ingredientul ";
                    case "Dislike":
                        return "nu va place ingredientul ";
                    case "Alert":
                        return "considerati un pericol ingredientul "
                }
            }
            else {
                switch (option) {
                    case "Like":
                        return "va  place aceasta specificatie?";
                    case "Dislike":
                        return "nu va place aceasta specificatie?";
                    case "Alert":
                        return "considerati un pericol aceasta specificatie?"
                }
            }
        }

        $scope.showPopup = function (ingredient, optiune) {

            $scope.data = {};
            var subtitle = "De ce " + translateOption(optiune);
            if ($scope.mesaj.category != "IT, comunicatii si foto" && $scope.mesaj.category != "Tv, electrocasnice si electronice") {
                subtitle = subtitle + ingredient + "?";
            }
            $ionicPopup.show({
                template: '<input type="text" placeholder="Introduceti motivul" ng-model="data.model">',
                title: "Preferinta noua",
                subTitle: subtitle,
                scope: $scope,
                buttons: [
                  { text: 'Anuleaza' },
                  {
                      text: 'Salveaza',
                      type: 'button-positive',
                      onTap: function (e) {
                          if (!$scope.data.model) {
                              e.preventDefault();
                          }
                          else {
                              var obj = {
                                  ingredient: ingredient,
                                  user: $rootScope.user,
                                  optiune: optiune,
                                  motiv: $scope.data.model,
                                  barcode: $scope.barcode,
                                  product_name: $scope.nume
                              };


                              var res = $http.post('https://nodeserve-cypmaster14.c9users.io/optiuneIngredient', obj);

                              res.success(function (data, status, headers, config) {

                                  if (status == 200) {
                                      //$scope.showAlert('Preferinta noua', data);
                                      $scope.showAlert = function (data) {
                                          var alertPopup = $ionicPopup.alert({
                                              title: "Preferinta noua",
                                              template: data
                                          });

                                          var getMyReputationRequest=$http.get('https://nodeserve-cypmaster14.c9users.io/getReputation?email='+$rootScope.user);

                                          getMyReputationRequest.success(function(data,status,headers,config){
                                              if(status==200)
                                              {
                                                console.log("Reputaie:"+data.reputatie);
                                                $rootScope.reputation=data.reputatie;
                                                window.localStorage.setItem("reputation",$rootScope.reputation);
                                              }
                                          });

                                          getMyReputationRequest.error(function(data,status,headers,config){

                                          });

                                          makeRequest();
                                      }(data);
                                  }
                              });


                              res.error(function (data, status, headers, config) {
                                  alert("Error on request la trimiterea optiunii asupra ingredientului" + status + ' ' + headers);

                              });
                          }

                      }
                  }
                ]
            });
        };

        $scope.likeImage = function (ingredient, optiune) {

            if (!$rootScope.user) {
                $scope.showAlert('Login', 'You must login first');
                return;
            }


            $scope.showPopup(ingredient, optiune);
        };

        $scope.ratingValue = 1;
        $scope.setRating = function (rating) {
            document.getElementById('group-3-' + (5 - $scope.ratingValue)).checked = "false";
            document.getElementById('group-3-' + (5 - $scope.ratingValue)).removeAttribute('checked');
            $scope.ratingValue = rating;
            document.getElementById('group-3-' + (5 - rating)).checked = "true";
            document.getElementById('group-3-' + (5 - rating)).setAttribute('checked', "true");
        };

        $scope.postareComentariu = function () {
            if (!$rootScope.logat || $rootScope.logat === false) {
                $scope.showAlert('Login', 'You must login first');
                return;
            }
            if ($scope.iol && $scope.iol.length !== 0 && $scope.titlu && $scope.titlu.length !== 0) {
                var review = $scope.iol;

                var obj = {
                    email: $rootScope.user,
                    barcode: $scope.barcode,
                    title: $scope.titlu,
                    grade: $scope.ratingValue,
                    review: review

                };

                $scope.titlu = "";
                $scope.iol = "";
                var res = $http.post('https://nodeserve-cypmaster14.c9users.io/adaugaComentariu', obj);
                res.success(function (data, status, headers, config) {

                    if (status == 200) {
                        $scope.showAlert('Titlu', 'Mesajul a fost postat cu succes');
                        var resComments = $http.get('https://nodeserve-cypmaster14.c9users.io/reviews?barcode=' + $scope.barcode);

                        resComments.success(function (data, status, headers, config) {
                            if (status == 200) {
                                $scope.comentarii = data.comentarii;
                                var getMyReputationRequest=$http.get('https://nodeserve-cypmaster14.c9users.io/getReputation?email='+$rootScope.user);

                                getMyReputationRequest.success(function(data,status,headers,config){
                                    if(status==200)
                                    {
                                      console.log("Reputaie:"+data.reputatie);
                                      $rootScope.reputation=data.reputatie;
                                      window.localStorage.setItem("reputation",$rootScope.reputation);

                                      var getProductRating=$http.get('https://nodeserve-cypmaster14.c9users.io/rating?barcode='+$scope.barcode);

                                      getProductRating.success(function(data,status,headers,config){

                                          if(status==200)
                                          {
                                            switch (data.scor) {
                                              case 1:
                                                console.log("Rating produs este:"+1);
                                                $('#group-3-24').prop('checked',true);
                                                break;
                                              case 2:
                                                console.log("Rating produs este:"+2);
                                                $('#group-3-23').prop('checked',true);
                                                break;
                                              case 3:
                                                console.log("Rating produs este:"+3);
                                                $('#group-3-22').prop('checked',true);
                                                break;
                                              case 4:
                                                console.log("Rating produs este:"+4);
                                                $('#group-3-21').prop('checked',true);
                                                break;
                                              default:
                                                console.log("Rating produs este:"+5);
                                                $('#group-3-20').prop('checked',true);
                                            }
                                          }
                                      });

                                      getProductRating.error(function(data,status,headers,config){

                                      });

                                    }
                                });

                                getMyReputationRequest.error(function(data,status,headers,config){

                                });
                            }

                        });

                        resComments.error(function (data, status, headers, config) {
                            alert("Error on request la obtinerea comentariilor" + status + ' ' + headers);
                        });
                    }
                });


                res.error(function (data, status, headers, config) {
                    if (status == 409) {
                        $scope.showAlert('Comentariu', "Ati postat deja un comentariu");
                    }

                });




            }

            else {
                $scope.showAlert('Comentariu', 'Completati toate campurile');
                return;
            }
        };

        function showPreferenceMenu(ingredient) {
            var hideSheet = $ionicActionSheet.show({
                titleText: "Alegeti preferinta",
                buttons: [
                            { text: '<i class="icon ion-happy-outline"></i>Imi place ' },
                            { text: '<i class="icon ion-sad-outline"></i><em>Nu imi place</em>' },
                            { text: '<i class="icon ion-android-alert"></i><b>Pericol</b>' },
                ],
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index) {
                    var optiune = "";
                    switch (index) {
                        case 0:
                            optiune = "Like";
                            break;
                        case 1:
                            optiune = "Dislike";
                            break;
                        case 2:
                            optiune = "Alert";
                            break;
                    }

                    var aux = $scope.showPopup(ingredient, optiune);
                    return true; //Pentru a disparea meniul cu optiuni dupa ce dau click
                }
            });
        }

        function showReasonMenu(ingredient, reason) {
            var template = reason + "<br>Doriti sa schimbati preferinta?"
            var confirmPopup = $ionicPopup.confirm({
                title: 'Motivul optiunii',
                template: template,
                cancelText: 'Nu',
                okText: 'Da'
            }).then(function (response) {
                if (response) {
                    showPreferenceMenu(ingredient);
                }
            });
        }

        $scope.showAditionalMenu = function (ingredient, option, reason) {
            if (!$rootScope.user) {
                $scope.showAlert('Login', 'Va rugam sa va autentificati');
                return;
            }
            if (option === "Neutral") {
                showPreferenceMenu(ingredient);
            } else {
                showReasonMenu(ingredient, reason);
            }
        };

        //get ingredients depending on option (Like,Dislike,Alert,Neutral)
        function getIngredients(ingredients, option) {
            var returnedIngredientes = [];
            for (var i in ingredients) {
                if (ingredients[i].option === option) {
                    returnedIngredientes.push(ingredients[i]);
                }
            }
            return returnedIngredientes;
        }

        function getSpecifications(spectypeobjs, option) {
            var returnedSpecifications = [];
            var spectypeobjs_size = spectypeobjs.length;
            for (var i = 0; i < spectypeobjs_size; i++) {
                subspectypeobjs = spectypeobjs[i].subspectypeobjs;
                var newSpectypeobj = new Object();
                newSpectypeobj.spectype = spectypeobjs[i].spectype;
                newSpectypeobj.subspectypeobjs = [];
                for (var j = 0; j < subspectypeobjs.length; j++) {
                    specvalobjs = subspectypeobjs[j].specvalobjs;
                    var newSubspectypeobj = new Object();
                    newSubspectypeobj.subspectype = subspectypeobjs[j].subspectype;
                    newSubspectypeobj.specvalobjs = [];
                    for (var e = 0; e < specvalobjs.length; e++) {
                        if (specvalobjs[e].option === option) {
                            newSubspectypeobj.specvalobjs.push(specvalobjs[e]);
                        }
                    }
                    if (newSubspectypeobj.specvalobjs.length > 0) {
                        newSpectypeobj.subspectypeobjs.push(newSubspectypeobj);
                    }
                }
                if (newSpectypeobj.subspectypeobjs.length > 0) {
                    returnedSpecifications.push(newSpectypeobj);
                }
            }
            return returnedSpecifications;
        }

        //merge product ingredients with the ingredients voted by user
        function getProductIngredients(product_ingredients, user_voted_ingredients) {

            var returned_ingredients = [];

            //add exactly matched ingredients
            var product_ingredients_size = product_ingredients.length;
            for (var i = 0; i < product_ingredients_size; i++) {
                for (var j in user_voted_ingredients) {
                    if (product_ingredients[i].toUpperCase() == user_voted_ingredients[j].ingredient_name.toUpperCase()) {
                        var ingredient = {
                            name: user_voted_ingredients[j].ingredient_name,
                            option: user_voted_ingredients[j].preference,
                            reason: user_voted_ingredients[j].reason
                        };
                        returned_ingredients.push(ingredient);
                        product_ingredients.splice(i, 1);
                        i--;
                        product_ingredients_size--;
                        break;
                    }
                }
            }

            if ($scope.mesaj.category != "IT, comunicatii si foto" && $scope.mesaj.category != "Tv, electrocasnice si electronice") {
                //add substring ingredients : lapte -> lapte praf
                for (var i = 0; i < product_ingredients_size; i++) {
                    for (var j in user_voted_ingredients) {
                        if (deductedIngredient(product_ingredients[i].toUpperCase(), user_voted_ingredients[j].ingredient_name.toUpperCase())) {
                            var ingredient = {
                                name: product_ingredients[i],
                                option: user_voted_ingredients[j].preference,
                                reason: deductReason(user_voted_ingredients[j].ingredient_name, user_voted_ingredients[j].preference)
                            };
                            returned_ingredients.push(ingredient);
                            product_ingredients.splice(i, 1);
                            i--;
                            product_ingredients_size--;
                            break;
                        }
                    }
                }
            }

            //add remaining ingredients(not voted)
            for (var i in product_ingredients) {
                var ingredient = {
                    name: product_ingredients[i],
                    option: "Neutral",
                    reason: ""
                }
                returned_ingredients.push(ingredient);
            }
            return returned_ingredients;
        };

        function getProductSpecifications(spectypeobjs, user_voted_ingredients) {

            //add exactly matched ingredients
            var spectypeobjs_size = spectypeobjs.length;
            for (var i = 0; i < spectypeobjs_size; i++) {
                subspectypeobjs = spectypeobjs[i].subspectypeobjs;
                for (var j = 0; j < subspectypeobjs.length; j++) {
                    specvalobjs = subspectypeobjs[j].specvalobjs;
                    for (var e = 0; e < specvalobjs.length; e++) {
                        for (var k in user_voted_ingredients) {
                            if (specvalobjs[e].specification_id.toUpperCase() == user_voted_ingredients[k].ingredient_name.toUpperCase()) {
                                specvalobjs[e].option = user_voted_ingredients[k].preference;
                                specvalobjs[e].reason = user_voted_ingredients[k].reason;
                                break;
                            }
                        }
                    }
                }
            }
        };

        //check all cases of substring appearance: (beginning) lapte -> lapte praf | (middle) grau -> faina de grau macinata | (end) cacao -> pudra de cacao
        function deductedIngredient(product_ingredient, voted_ingredient) {
            var index = product_ingredient.indexOf(voted_ingredient);
            switch (index) {
                case -1:
                    return false;
                case 0: //beginning
                    if (product_ingredient[index + voted_ingredient.length] == ' ') return true;
                    return false;
                case (product_ingredient.length - voted_ingredient.length): //end
                    if (product_ingredient[product_ingredient.length - voted_ingredient.length - 1] == ' ') return true;
                    return false;
                default: //middle
                    if (product_ingredient[index - 1] == ' ' && product_ingredient[index + voted_ingredient.length] == ' ') return true;
                    return false;
            }
        }

        function deductReason(name, option) {
            switch (option) {
                case "Like":
                    return "Ingredientul " + name + " se numara printre preferintele dumneavoastra.";
                case "Dislike":
                    return "Ingredientul " + name + " a fost semnalat ca fiind dezagreabil pentru dumneavoastra.";
                case "Alert":
                    return "Ingredientul " + name + " a fost semanalat ca fiind un pericol pentru dumneavoastra.";
            }
        }

        //Get the displayed message for neutral ingredients depending on the other voted ingredients, if they exist
        function getNeutralIngredientsDisplayMessage(scope) {
            if (scope.likedIngredients.length + scope.dislikedIngredients.length + scope.alertedIngredients.length > 0) {
                return "Alte ingrediente";
            } else {
                return "";
            }
        }

        function getNeutralSpecificationsDisplayMessage(scope) {
            if (scope.likedSpecifications.length + scope.dislikedSpecifications.length + scope.alertedSpecifications.length > 0) {
                return "Alte specificatii";
            } else {
                return "";
            }
        }

        $scope.clickOnCampaign = function (campaign) {
            $state.go("tabs.campaign", {
                campaign_name: campaign.campaign_name, campaign_id: campaign.campaign_id, campaign_description: campaign.description,
                imagine: campaign.imagine, creation_date: campaign.creation_date, administrator: $rootScope.user, product_name: $scope.mesaj.name, product_barcode: $scope.barcode,
                first_name:campaign.first_name,
                last_name:campaign.last_name,email_creator_campanie : campaign.email_creator_campanie
            });
        };
        $scope.clickOnCreateCampaign = function (barcode) {
            if (!$rootScope.logat || $rootScope.logat == false) {
                $scope.showAlert('LogIn', 'Trebuie sa fiti logat!');
                return;
            }
            $state.go("tabs.createCampaign", { "ok": "ok", 'barcode': barcode, 'name': $scope.mesaj.name});
        }
    }
}]);
