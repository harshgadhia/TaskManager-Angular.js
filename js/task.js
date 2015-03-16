(function(){

var app = angular.module("taskManager", []);

app.factory('taskFactory', function() {

  var factory = {};
  
  var tasks = [
    { name: 'Design Model Classes for GEFP', time: 10, isCompleted: false  },
    { name: 'Implement the database design in postgres', time: 3, isCompleted: false },
    { name: 'Design UI/UX for GEFP', time: 4, isCompleted: false }
  ];
  
  var users = [
  { name: 'John', post: 'Developer', tasks: [{ name: 'Create a new Maven Web application in Eclipse', time: 0.5, isCompleted: false  }] },
  { name: 'Bob', post: 'Designer', tasks: [{ name: 'Upload source code to CSNS', time: 0.3, isCompleted: true  }] }
  ];

  factory.addNewTask = function(newTask) {
    if(typeof(newTask)!='undefined') {
      if(!newTask.hasOwnProperty('name') || typeof(newTask.name) == 'undefined') {
        return 'Please enter a task name';
      }
      else if(!newTask.hasOwnProperty('time') || isNaN(newTask.time)) {
        return 'Please enter time';
      }
      else if(isNaN(newTask.time)) {
        return 'Time should be numeric';
      }
      else {
        newTask.isCompleted=false;
        tasks.push(newTask);
        return true;
      }
    }
    else {
      return 'Please enter task information';
    }
  }

  factory.getTasks = function() {
    return tasks;
  }

  factory.deleteTask = function(task) {
    tasks.splice(tasks.indexOf(task), 1);
  }

  factory.assignTaskToUser = function(task) {
    var t = tasks[tasks.indexOf(task)];
    var user = task.user;
    users[users.indexOf(user)].tasks.push(t);
    users[users.indexOf(user)].totalTime+=parseFloat(t.time);
    tasks.splice(tasks.indexOf(task), 1);
  }

  factory.getUsers = function() {
    return users;
  }

  return factory;
});

app.controller("taskController", function($scope, taskFactory) {

  $scope.tasks = taskFactory.getTasks();
  $scope.users = taskFactory.getUsers();

  $scope.deleteTask = function(task) {
    taskFactory.deleteTask(task);
  }

  $scope.assignTask = function(task) {    
    if(typeof(task) != 'undefined' && typeof(task.user) != 'undefined' ) {
      taskFactory.assignTaskToUser(task);
    }
    else {
      console.log('User is not selected')
    }
  }

});

app.controller("newtaskController", function($scope, taskFactory) {
  
  $scope.addTask = function() {
    var status = taskFactory.addNewTask($scope.newtask);
    $scope.errorMessage = '';

    if(status == true) {
      $scope.newtask = {};  
    }
    else {
      $scope.errorMessage = status;
    }
    
  }

});

app.controller("userTaskController", function($scope, taskFactory) {
  $scope.users = taskFactory.getUsers();
  $scope.markCompleted = function(user, task) { 
    if(task.isCompleted==false) {
      var currUser = $scope.users[$scope.users.indexOf(user)];
      currUser.totalTime-=parseFloat(currUser.tasks[currUser.tasks.indexOf(task)].time);
      currUser.tasks[currUser.tasks.indexOf(task)].isCompleted=true;
    }
  }

  $scope.calculateTotalTime = function(user) {
    var total = 0;
    user.tasks.forEach(function(task) {
      if(!task.isCompleted) {
        total+=parseFloat(task.time);
      }
 
    });
    return total;
  }

});
})();