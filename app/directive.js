(function() {
  angular.module('app')
  .directive('cardItem', cardItemDirective);

  function cardItemDirective() {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        onSave: '&',
        onDelete: '&'
      },
      templateUrl: 'templates/card.html',
      link: link
    };
  }

  cardItemDirective.$inject = [];

  function link(scope) {

    init();

    scope.$watch('item.id', function(val) {
      if (val) {
        init();
      }
    });

    function setInitNextDue() {
      if (scope.editItem.frequency == 1) {
        var validHourMin = scope.dailyList[0].value? scope.dailyList[0].value : scope.dailyList[1].value;
        var date = new Date(scope.editItem.nextDue);
        date.setHours(validHourMin.split(':')[0]);
        date.setMinutes(validHourMin.split(':')[1]);
        scope.editItem.nextDue = date.toString();
        scope.calcNextDue.time = validHourMin;
      } else if (scope.editItem.frequency == 2) {
        var validMin = scope.hourlyList[0].value? scope.hourlyList[0].value : scope.hourlyList[1].value;
        var date = new Date(scope.editItem.nextDue);
        date.setHours(new Date().getHours());
        date.setMinutes(validMin);
        scope.editItem.nextDue = date.toString();
        scope.calcNextDue.time = validMin;
      } else {
        scope.editItem.nextDue = new Date().toString();
      }
    }

    function init () {
      scope.isEditing = scope.item.id? false : true;
      scope.dynoSizeList = ['free'];
      scope.frequencyList = [
        { id: 1, name: 'Daily' },
        { id: 2, name: 'Hourly' },
        { id: 3, name: 'Every 10 minutes' }
      ];

      scope.calcNextDue = {};

      scope.dailyList = [];
      scope.hourlyList = [];
      calcDailyList();

      scope.editItem = {
        id: scope.item.id, 
        code: scope.item.code, 
        dynoSize: scope.item.dynoSize, 
        frequency: scope.item.frequency, 
        lastRun: scope.item.lastRun, 
        nextDue: scope.item.nextDue
      };

      if (!scope.item.id) {
        setInitNextDue();
      } else {
        if (scope.editItem.frequency == 1) {
          scope.calcNextDue.time = moment(scope.editItem.nextDue).format('HH:mm');
        } else {
          scope.calcNextDue.time = moment(scope.editItem.nextDue).format('mm');
        }
      }
    }

    function calcDailyList() {
      var times = [];
      var temp = 0;

      if (moment().format('mm') > 30) {
        temp = (parseInt(moment().format('HH')) + 1) * 60;
      } else {
        temp = moment().format('HH') * 60 + 30;
      }

      //loop to increment the time and push results in array
      for (var i = temp; i < 24 * 60; i+=30) {
        var hh = Math.floor(i / 60);
        var mm = (i % 60);
        times.push({
          name: ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2),
          value: ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2),
          disabled: false
        });
      }

      times.push({
        name: '=====',
        value: null,
        disabled: true
      });

      for (var i = 0; i < temp; i+=30) {
        var hh = Math.floor(i/60);
        var mm = (i % 60);
        times.push({
          name: ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2),
          value: ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2),
          disabled: false
        });
      }

      scope.dailyList = times;

      // hourly list

      var start = Math.floor(moment().format('mm') / 10) * 10 + 10;
      var hours = [];

      if (moment().format('mm') % 10 == 0) {
        var start = moment().format('mm');
      }

      for (var i = start; i < 60; i += 10) {
        hours.push({
          name: ':' + (i == 0? '0' + i : i),
          value: i + '',
          disabled: false
        });
      }

      hours.push({
        name: '=====',
        value: null,
        disabled: true
      });

      for (var i = 0; i < start; i += 10) {
        hours.push({
          name: ':' + (i == 0? '0' + i : i),
          value: i + '',
          disabled: false
        });
      }

      scope.hourlyList = hours;
    }

    scope.saveChange = function() {
      if (!scope.isEditing) {
        scope.isEditing = !scope.isEditing;
      } else {
        var date = new Date(scope.editItem.nextDue);
        if (scope.editItem.frequency == 1) {
          date.setHours(scope.calcNextDue.time.split(':')[0]);
          date.setMinutes(scope.calcNextDue.time.split(':')[1]);
        } else if (scope.editItem.frequency == 2) {
          date.setHours(new Date().getHours());
          date.setMinutes(scope.calcNextDue.time);
        } else {
          date = new Date();
        }
        scope.editItem.nextDue = date.toString();
        scope.onSave({ item: scope.editItem });
        scope.isEditing = !scope.isEditing;
      }
    }

    scope.cancel = function() {
      if (scope.isEditing) {
        if (scope.item.id) {
          scope.isEditing = !scope.isEditing;
        } else {
          scope.onDelete({ id: scope.item.id });
        }
      } else {
        scope.onDelete({ id: scope.item.id });
      }
    }

    scope.getFrequency = function(id) {
      return scope.frequencyList.find(function(val) {
        return val.id == id;
      }).name;
    }

    scope.getDateByFormat = function(date, format) {
      return moment(date).format(format);
    }

    scope.changeFrequency = function() {
      setInitNextDue();
    }
  }
})()
