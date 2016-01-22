var appNptes = angular.module('appNotes', ['ui.bootstrap']);
appNptes.controller('notesCtrl', function ($scope, $http, $location) {

  //Variables and functions
  $scope.notes=[];
  $scope.results=[];
  $scope.summary=[];

  $scope.keywords=[];
  $scope.keywords_search=[];

  $scope.getNotesByDate= function(){
    $http({
      method: 'POST',
      url: '/ajax/getNotesByDate',
      data:{selectedDate:$scope.selectedDate},
    }).then(function successCallback(response) {
        $scope.notes=response.data;
      }, function errorCallback(response) {
        alert('Ajax Error');
      });
  }
  $scope.$watch('selectedDate', $scope.getNotesByDate);


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
        $scope.getNotesByDate();
        alert('Note added');
      }, function errorCallback(response) {
        alert('Ajax Error');
      });
  }


  $scope.searchNotes =function(){
    var valid = $scope.from && $scope.to && $scope.about_search;
    if(!valid){
      alert("Must have from date, to date, about");
      return false;
    }

    var searchPara ={
      from:$scope.from,
      to:$scope.to,
      about:$scope.about_search,
      keyword:$scope.keyword_search,
      detail:$scope.detail_search,
    };

 
    $http({
      method: 'POST',
      url: '/ajax/searchNotes',
      data:searchPara
    }).then(function successCallback(response) {
        $scope.summary=response.data.summary;
        $scope.results=response.data.notes;
      }, function errorCallback(response) {
        alert('Ajax Error');
      });
  }

  $scope.searchKeyword =function(text, from){
    $http({
      method: 'POST',
      url: '/ajax/searchKeyword',
      data:{'keyword':text}
    }).then(function successCallback(response) {
        if(from=='keyword'){
          $scope.keywords=response.data;
        }else{
          $scope.keywords_search=response.data;
        }
        
      }, function errorCallback(response) {
        alert('Ajax Error');
      });
  }

  $scope.fetchKeyword= function(x, from){
    if(from=='keyword'){
      $scope.keyword=x;
      $scope.keywords=[];
    }else{
      $scope.keyword_search=x;
      $scope.keywords_search=[];
    }
  }




  //Init
  $scope.showAddNote=false;
  $scope.showNoteCalendar=false;
  $scope.showLifeD=true;
  
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