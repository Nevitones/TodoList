var TodoCollection = Backbone.Collection.extend({
	url: 'http://localhost:9595',
	model: TodoModel
});