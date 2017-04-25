(function() {
  angular.module('app')
  .controller('MainCtrl', MainCtrl);

  function MainCtrl($scope) {
    $scope.isShowAddBtn = true;
    $scope.items = [
      { id: 1, code: 'rake scrape:moneymaker', dynoSize: 'free', frequency: 2, lastRun: 'never', nextDue: "Fri, 21 Apr 2017 09:20:42" }
    ];

    $scope.saveItem = function(data) {
      console.log(data.item);
      var id = 'item_' + new Date().getTime();
      var item = $scope.items.find(function(item) {
        return item.id == data.item.id;
      });
      item.code = data.item.code;
      item.dynoSize = data.item.dynoSize;
      item.frequency = data.item.frequency;
      item.lastRun = data.item.lastRun;
      item.nextDue = data.item.nextDue;
      if (!item.id) {
        console.log('create new item');
        item.id = id;
        $scope.isShowAddBtn = true;
      }
    }

    $scope.deleteItem = function(data) {
      var index = $scope.items.findIndex(function(item) {
        return item.id == data.id;
      });
      $scope.items.splice(index, 1);
      if (data.id == null) {
        $scope.isShowAddBtn = true;
      }
    }

    $scope.addItem = function() {
      $scope.items.push({
        id: null, 
        code: '', 
        dynoSize: 'free', 
        frequency: 1, 
        lastRun: 'never', 
        nextDue: new Date().toString()
      });

      $scope.isShowAddBtn = false;
    }
  }

  MainCtrl.$inject = ['$scope'];
})()
