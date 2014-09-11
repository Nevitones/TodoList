var TodoCollection = Backbone.Collection.extend({
	url: 'http://localhost:9595',
	model: TodoModel,
	initialize: function(){
		this.on('add', this.onAdd, this);
	},
	onAdd: function(model){
		if (!model.id) {
			var todoModelView = new TodoModelView({model: model});
			todoCollectionView.$el.append(todoModelView.render());
			todoModelView.edit();
		}
	}
});