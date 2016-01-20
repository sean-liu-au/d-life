var appNptes = angular.module('appNotes', ['ui.bootstrap']);
appNptes.controller('notesCtrl', function ($scope, $http, $location) {

  //Variables and functions
  $scope.notes=[];

  $scope.getNotes= function(){
    $http({
      method: 'GET',
      url: '/ajax/getNotes'
    }).then(function successCallback(response) {
        $scope.notes=response.data;
      }, function errorCallback(response) {
        alert('Ajax Error');
      });
  }

  $scope.addNote =function(){

    var valid = $scope.keyword && $scope.detail;
    if(!valid){
      alert("Empty note not allowed.");
      return false;
    }

    var note ={
      about:$scope.about,
      keyword:$scope.keyword,
      detail:$scope.detail,
      value:$scope.value
    };

 
    $http({
      method: 'POST',
      url: '/ajax/addNote',
      data:note
    }).then(function successCallback(response) {
        $scope.keyword='';
        $scope.detail='';
        $scope.value='';
        $scope.getNotes();
        alert('Note added');
      }, function errorCallback(response) {
        alert('Ajax Error');
      });
  }

  //Init
  $scope.getNotes();

  $scope.showAddNote=false;
  $scope.showToday=true;
  $scope.showLifeD=false;
  
  //Calenda
  $scope.popup1 = {
    open: false
  };

  $scope.popup2 = {
    open: false
  };

  $scope.format = 'dd-MMMM-yyyy';
  $scope.altInputFormats = ['M!/d!/yyyy'];


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


  //Script
  $scope.open1=function(){
    $scope.popup1.open = true;
  }

  $scope.open2=function(){
    $scope.popup2.open = true;
  }


});