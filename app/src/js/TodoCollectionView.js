var TodoCollectionView = Backbone.View.extend({
	model: new TodoCollection(),
	el: '#todoList',
	render: function() {
		var todoCollection = new TodoCollection();
		var self = this;
		self.$el.empty();

		todoCollection.fetch({
			success: function(todos) {
				$.each(todos.models, function(index, todoModel){
					var todoModelView = new TodoModelView({model: todoModel});
					self.$el.append(todoModelView.render());
				});
			}
		});
	}
});