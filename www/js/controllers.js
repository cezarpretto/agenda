angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $ionicPopup, $timeout, $ionicLoading, $ionicActionSheet, $q, $rootScope, $window, $location, $document) {
	$scope.numeros = [];
	function init() {
		$rootScope.listaFavoritos = [];
		var deferred = $q.defer();
		var setUp = "";
		if(setUp) {
			deferred.resolve(true);
			return deferred.promise;
		}
		
		var openRequest = window.indexedDB.open("agenda",1);
	
		openRequest.onerror = function(e) {
			console.log("Error opening db");
			console.dir(e);
			deferred.reject(e.toString());
		};

		openRequest.onupgradeneeded = function(e) {
	
			var thisDb = e.target.result;
			var objectStore;
			
			//Create Note OS
			if(!thisDb.objectStoreNames.contains("cadNumeros")) {
				objectStore = thisDb.createObjectStore("cadNumeros", { keyPath: "id", autoIncrement:true });
				objectStore.createIndex("nome", "nome", { unique: false });
				objectStore.createIndex("numero","numero", {unique:false});
			}
	
		};

		openRequest.onsuccess = function(e) {
			db = e.target.result;
			
			db.onerror = function(event) {
				// Generic error handler for all errors targeted at this database's
				// requests!
				deferred.reject("Database error: " + event.target.errorCode);
			};
	
			setUp=true;
			deferred.resolve(true);
			$scope.getFavoritos();
		};	

		return deferred.promise;
	}	
	init();

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
 	//var db = db;
 	var trans = db.transaction(["cadNumeros"], "readwrite");
 	var store = trans.objectStore("cadNumeros");

 	var request = store.put({
 		"nome": registro.nome,
 		"numero" : registro.numero
 	});

 	trans.oncomplete = function(e){
 		$scope.showAlert("Número adicionado aos favoritos =)");
 		$scope.listaFavoritos = [];
 		$scope.getFavoritos();
 	};

 	trans.onerror = function(e) {
 		console.log(e.value);
 	};

 };

 $scope.getFavoritos = function(){
 	$rootScope.listaFavoritos = [];
 	var trans = db.transaction(["cadNumeros"], "readwrite");
  	var store = trans.objectStore("cadNumeros");
  	// Get everything in the store;
  	var keyRange = IDBKeyRange.lowerBound(0);
  	var cursorRequest = store.openCursor(keyRange);

  	cursorRequest.onsuccess = function(e) {
  		var result = e.target.result;
  		if(!!result == false)
  			return;
  		$rootScope.listaFavoritos.unshift(result.value);
  		//console.log($rootScope.listaFavoritos);
  		//console.log($rootScope.listaFavoritos);
  		result.continue();
  	};

  	//cursorRequest.onerror = html5rocks.indexedDB.onerror;

  };

})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $rootScope) {
	function init(){
	//console.log($rootScope.listaFavoritos);
	};
	init();
});
