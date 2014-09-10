// js/collections/todos.js

'use strict';

var app = app || {};
var TodoList = Backbone.Collection.extend({
  // reference the Todo model
  model: app.Todo,
  // use localstorage as the persistance layer
  localStorage: new Backbone.LocalStorage('todos-backbone'),
  
  // filter the list
  completed: function() {
    return this.filter(function(todo) {
      return todo.get('completed');
    });
  },
  remaining: function() {
    return this.without.apply(this, this.completed);
  },
  // keep the todos in sequential order with a monotonically increasing index
  nextOrder: function() {
    if (!this.length) {
      return 1;
    }
    return this.last().get('order') + 1;
  },
  // I don't get the name or purpose of this method.
  comparator: function(todo) {
    return todo.get('order');
  }
});

app.Todos = new TodoList();