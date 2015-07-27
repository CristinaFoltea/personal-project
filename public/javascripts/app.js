var myTravel = angular.module('myTravel', ['ngResource', 'ngRoute'])
    // myTravel.config(function($routeProvider){
    //   $routeProvider
    //   .when('/', {
    //     templateUrl : './views/index.html',
    //     controller : 'firstCTRL'
    //   })
    // })
  myTravel.controller('firstCTRL', ['$scope', '$http', '$location', '$log', function($scope, $http, $location, $log) {
    $log.info($location.path())
    $scope.name ='cristina';
      $scope.submit = function (){
        $http.get('/places')
        .success(function(result){
          $scope.location = JSON.parse(result)
          console.log(result)
        })
        .error(function(data, error){
          console.log(data)
        });
      }
    }]);
