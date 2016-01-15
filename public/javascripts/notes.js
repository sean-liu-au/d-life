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
      }, function errorCallback(response) {
        alert('Ajax Error');
      });
  }

  $scope.addNote =function(){
    var valid = $('#keyword').val() && $('#detail').val();
    if(!valid){
      alert("Empty note not allowed.");
      return false;
    }

    var note ={
      about:$('#about').val(),
      keyword:$('#keyword').val(),
      detail:$('#detail').val(),
      value:$('#value').val()
    };

    console.log(note);

    $http({
      method: 'POST',
      url: '/ajax/addNote',
      data:note
    }).then(function successCallback(response) {
        $('#keyword').val('');
        $('#detail').val('');
        $scope.getNotes();
        alert('Note added');
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