var appNptes = angular.module('appNotes', []);
appNptes.controller('notesCtrl', function ($scope, $http, $location) {

  //Variables and functions
  $scope.notes=[];

  $scope.getNotes= function(){
    $http({
      method: 'GET',
      url: '/ajax/getNotes'
    }).then(function successCallback(response) {
        $scope.notes=response.data;
        console.log('~~~~',$scope.notes);
      }, function errorCallback(response) {
        alert('Ajax Error');
      });
  }

  //Init
  $scope.getNotes();

  $scope.showAddNote=true;

  $scope.members=[
    {
    "email":"guomengjie@gmail.com",
    "lastname":"Guo",
    "firstname":"Monica",
    },
    {
    "email":"botfc.au@gmail.com",
    "lastname":"Liu",
    "firstname":"Sean",
    }
  ];

});