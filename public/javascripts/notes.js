var appNptes = angular.module('appNotes', ['ui.bootstrap']);
appNptes.controller('notesCtrl', function ($scope, $http, $location) {

  //Variables and functions
  $scope.notes=[];
  $scope.results=[];
  $scope.resultsShow=[];
  $scope.summary=[['',''],[1,2]];

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
        $scope.resultsShow=response.data.notes;
        $scope.drawBarChart();
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


$scope.drawBarChart =function () {
      var data = google.visualization.arrayToDataTable($scope.summary);

      var options = {
        width:'100%',
        hAxis: {
        },
        vAxis: {
          textPosition:'none'
        },
        legend: {position: 'none'},
        bars: 'vertical'
      };
      var container=document.getElementById('chart_div');
      container.style.display = 'block';
      var chart = new google.charts.Bar(container);

      google.visualization.events.addListener(chart, 'ready', function () {
        if(!$scope.results.length){
          container.style.display = 'none';
        }
      });


      google.visualization.events.addListener(chart, 'select', function (e) {        
        var selected=chart.getSelection()[0];

        if(selected){
          var selectedKeyword=data.getValue(selected.row,selected.column-1);

          $scope.resultsShow=$scope.results.filter(function(val){
            return val.keyword==selectedKeyword;
          });          
        }else{
          $scope.resultsShow=$scope.results;
        }

        $scope.$apply();
      });

      chart.draw(data, options);
    }

  /******
    Initiate variables for application
  ******/
  $scope.showAddNote=false;
  $scope.showNoteCalendar=true;
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

  $scope.members=members;

  //Googel chart
  google.charts.load('current', {packages: ['corechart', 'bar']});

  //Script
  $scope.open1=function(){
    $scope.popup1.open = true;
  }

  $scope.open2=function(){
    $scope.popup2.open = true;
  }


});