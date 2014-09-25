// js/views/app.js

'use strict';

var app = app || {};
app.AppView = Backbone.View.extend({
  // bind this.el to the existing <section> DOM element that will contain the list in index.html
  el: '#todoapp',
  
  statsTemplate: _.template($('#stats-template').html()),
  
  // events to delegate
  events: {
    'keypress #new-todo': 'createOnEnter',
    'clear #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },
  
  // initialize this view object
  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    
    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);

	//new
	this.listenTo(app.Todos, 'change:completed', this.filterOne);
	this.listenTo(app.Todos, 'filter', this.filterAll);
	this.listenTo(app.Todos, 'all', this.render);

	app.Todos.fetch();
  },

  //new
  //re-rendering the app just means refreshing the statistics; the rest of the app doesn't change.
  render: function() {
    var completed = app.Todos.completed().length;
	var remaining = app.Todos.remaining().length;
	if (app.Todos.length) {
	  this.$main.show();
	  this.$footer.show();
	  this.$footer.html(this.statsTemplate({
	    completed: completed,
		remaining: remaining
	  }));

	  this.$('#filters li a')
	    .removeClass('selected')
		.filter('[href="#' + ( app.TodoFilter || '' ) + '"]')
		.addClass('selected');
    } else {
	  this.$main.hide();
	  this.$footer.hide();
	}
	this.allCheckbox.checked = !remaining;
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
  },
  
  //new 
  filterOne: function(todo) {
    todo.trigger('visible');
  },

  //new
  filterAll: function() {
    app.Todos.each(this.addOne, this);
  },
  
  //new
  // generate the new attributes for a new Todo item.
  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
	  order: app.Todos.nextOrder(),
	  completed: false 
	};
  },

  //new
  // if you hit return in the main input field, create a new Todo model, persisting to localStorage.
  createOnEnter: function(event) {
    if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
	  return;
	}
	app.Todos.create(this.newAttributes());
	this.$input.val('');
  },

  //new
  // Clear all completed todo items, destroying their models.
  clearCompleted: function() {
	console.log('clearing completed items');
    _.invoke(app.Todos.completed(), 'destroy');
	return false;
  },

  //new
  toggleAllCompleted: function() {
    var completed = this.allCheckbox.checked;
	app.Todos.each(function(todo) {
	  console.log('completed item: %s', todo.title);
      todo.save({completed: completed}); 
	});
  }

});
