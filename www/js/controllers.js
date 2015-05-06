angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $ionicPopup, $timeout, $ionicLoading, $ionicActionSheet, $q, $rootScope, $window, $location, $document, $rootElement) {
	$scope.numeros = [];
	//$scope.buscar('planos');
	$rootScope.listaFavoritos = [];
	function init() {
		//$rootScope.listaFavoritos = [];
		db = openDatabase('agendaDB', '1.0', 'Base de dados agenda', 2 * 1024 * 1024);
		db.transaction(function(tx){
			tx.executeSql('create table if not exists cad_numeros (id INTEGER PRIMARY KEY AUTOINCREMENT, nome, telefone)');
		});
	};	
	init();
	//$rootScope.getFavoritos();

	$scope.buscar = function(busca){
		if(busca != undefined){
			$scope.show("Buscando...");
			return $http.get('http://planosassessoria.com.br/chupetao/file.php?busca=' + busca).success(function(data, status){
				$scope.numeros = data;
				$scope.hide();
				if(data == "]"){
					$scope.numeros = [];
					$scope.showAlert("Nenhum número encontrado =(");
				}
			}).error(function(erro, status){
				$scope.hide();
				if(status == 0){
					$scope.showAlert("Sem conexão com a internet =(");
				}
			});
		}else{
			$scope.showAlert("Digite um número ou nome para pesquisar =)");
		}
	};

	$scope.show = function(texto) {
    $ionicLoading.show({
      template: texto
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.showAlert = function(texto) {
     var alertPopup = $ionicPopup.alert({
       title: 'Agenda telefônica Água Boa',
       template: texto
     });
     alertPopup.then(function(res) {
       //console.log('Thank you for not eating my delicious ice cream cone');
     });
   };

   $scope.opcao = function(registro) {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Ligar' },
       { text: 'Número favorito' }
     ],
     titleText: 'Opções',
     cancelText: 'Cancelar',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
     	//console.log(index);
     	if(index == 1){
     		$scope.addFavorito(registro);
     	}else if(index == 0){
     		window.location.href = 'tel:66'+registro.numero;
     		//$document.location.href = 'tel:'+registro.numero;
     	}
     }
   });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 5000);

 };

 $scope.addFavorito = function(registro){
 	db.transaction(function(tx){
 		tx.executeSql('insert into cad_numeros (nome, telefone) values (?, ?)', [registro.nome, registro.numero]);
 		$scope.showAlert('Número adicionado =)');
 	});
 	$rootScope.getFavoritos();
 };

 $rootScope.getFavoritos = function(){
 	try{
 		db.transaction(function(tx){
	 		tx.executeSql('select id, nome, telefone from cad_numeros', [], function(tx, results){
	 			var len = results.rows.length, i;
	 			var teste = []
	 			$rootScope.listaFavoritos = [];
	 			for(i = 0; i < len; i++){
	 				teste.unshift(results.rows.item(i));
	 			}
	 			$rootScope.listaFavoritos = teste;
	 		});
	 	});
 	}catch(e){
 		console.log(e);
 	}
  };

  $rootScope.deleteFavorito = function(registro){
  	db.transaction(function(tx){
 		tx.executeSql('delete from cad_numeros where id = ?', [registro.id]);
 		$scope.showAlert('Número deletado =)');
 	});
  };

})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $rootScope, $ionicActionSheet, $timeout) {
	function init(){
		//db = openDatabase('agendaDB', '1.0', 'Base de dados agenda', 2 * 1024 * 1024);
		//$rootScope.getFavoritos();
	};
	init();

$scope.opcaoFavorito = function(registro) {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
   	buttons: [
   		{ text: 'Ligar' },
   		{ text: 'Deletar' }
   	],
   	titleText: 'Opções',
   	cancelText: 'Cancelar',
   	cancel: function() {
          
      },
      buttonClicked: function(index) {
     	//console.log(index);
     	if(index == 1){
     		$rootScope.deleteFavorito(registro);
     		$rootScope.getFavoritos();
     	}else if(index == 0){
     		window.location.href = 'tel:66'+registro.telefone;
     		//$document.location.href = 'tel:'+registro.numero;
     	}
     }
 });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
   	hideSheet();
   }, 5000);

};

});
