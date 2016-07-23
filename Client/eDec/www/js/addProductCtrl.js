angular.module('edec').controller('AddProductCtrl',['$scope','$state','$stateParams','$http','$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {

  $scope.preiaBarcode=function(){
    $scope.barcodeProdus=$rootScope.barcodeDeIntrodus;
    $scope.numeProdus="";
    $scope.pretProdus=null;
    $scope.linkPoza=null;
    $scope.categorieSelectata=null;
  };

  $scope.adaugaInputIngredient=function(){

    var srcdiv=$('#listaIngrediente');

    $('<p><label class="item item-input item-stacked-label" for="ingredient"><span class="input-label">Ingredient</span><input type="text" id="ingredient" size="30" value="" placeholder="Ingredient:" name="ingredientProdus"/></label> <button  id="remScnt"  class="button button-clear button-light">Remove</button></p>').appendTo(srcdiv);
    return false;
  };

  $('#listaIngrediente').on('click','#remScnt', function() {
      var i=$('#listaIngrediente p').size()+1;
      if( i > 2 ) {
          $(this).parents('p').remove();
          i--;
      }
      return false;
  });

$scope.insereazaProdus=function()
{
  var produs=new Object();
  //produs.barcode=$scope.barcodeProdus;
  produs.barcode=$rootScope.barcodeDeIntrodus;
  produs.nume=$scope.numeProdus;
  produs.pret=$scope.pretProdus;
  produs.poza=$scope.linkPoza;
  produs.categorie=$scope.categorieSelectata;
  console.log(JSON.stringify(produs));
  if(!(verificaCampCompletat(produs.poza)))
  {
	$scope.showAlert('Formular','Completati toate campurile');
	return false;
  }
  if(!(produs.poza.toLocaleLowerCase().includes('carrefour')|| produs.poza.toLocaleLowerCase().includes('emag')))
  {
    $scope.showAlert('Poza','Poza nu este valida(Incarcati una de la Carrefour sau Emag)');
    return false;
  }

  if(!(verificaCampCompletat(produs.nume) && verificaCampCompletat(produs.pret) && verificaCampCompletat(produs.poza)))
  {
    $scope.showAlert('Formular','Completati toate campurile');
    return false;
  }
  var ingrediente=document.querySelectorAll("p>label>input");
  var listaDeIngrediente=[];
  for(var i=0;i<ingrediente.length;i++)
  {
    if(ingrediente[i].value.localeCompare("")===0)
    {
      $scope.showAlert('Ingrediente','Completari toate campurile cu  ingredientele');
      return false;
    }

    if(verificaDuplicatIngredient(listaDeIngrediente,ingrediente[i].value)===false)
    {
      $scope.showAlert('Ingrediente','Aveti ingrediente duplicate');
      return false;
    }
    listaDeIngrediente.push(ingrediente[i].value);
  }

  produs.ingrediente=listaDeIngrediente;

  //Fac request-ul de inregistare a ingredientui

  var res=$http.post('https://nodeserve-cypmaster14.c9users.io/addProduct',produs);
  res.success(function(data,status,headers,config){
    if(status==200)
    {
      $scope.showAlert('Inserare produs','Produsul a fost inserat cu succes');
      $state.go('tabs.addProduct');
    }
  });

  res.error(function(data,status,headers,config){
    if(status==409)
    {
      $scope.showAlert('Inserare produs','Produsul nu a putut fi inserat');
    }

  });
};

function verificaDuplicatIngredient(lista,ingredient){
  for(var i=0;i<lista.length;i++ )
  {
    if(lista[i].localeCompare(ingredient)===0)
      return false;
  }
  return true;
}

function verificaCampCompletat(camp)
{
  if(!camp || camp.localeCompare("")===0)
    return false;
  return true;
}

$scope.afiseazaCategorieSelectata=function(categorie)
{
  console.log("Categoria selectata este:"+categorie);
};


}]);
