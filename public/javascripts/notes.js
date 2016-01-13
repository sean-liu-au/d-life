var appNptes = angular.module('appNotes', []);
appNptes.controller('notesCtrl', function ($scope) {

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