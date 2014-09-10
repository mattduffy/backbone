// js/views/app.js

'use strict';

var app = app || {};
app.appView = Backbone.View.extend({
  // bind this.el to the existing <section> DOM element that will contain the list in index.html
  el: '#todoapp',
  
  statsTemplate: _.template($('#stats-template').html()),
  
  // initialize this view object
  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    
    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
  },
  
  // add a single Todo instance to the list
  addOne: function(todo) {
    var view = new app.TodoView({ model: todo});
    $('#todo-list').append(view.render().el);
  },
  
  // add all of the todos to the list at once
  addAll: function() {
    // clear the todo-list DOM container first
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  }
});