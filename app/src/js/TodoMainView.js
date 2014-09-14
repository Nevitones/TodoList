var TodoMainView = Backbone.View.extend({
	el: 'body',
	events: {
		'click button': 'addItem'
	},

	initialize: function() {
		this.template = templates.TodoMainView;
		this.$el.append(this.template());
		this.todoCollectionView = new TodoCollectionView({
			el: this.$el.find('#todoList')
		}).render();
	},

	addItem: function() {
		this.todoCollectionView.collection.add(new TodoModel());
	}
});