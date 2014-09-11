var TodoModel = Backbone.Model.extend({
	defaults: function(){
		return {
			done: false,
			description: ''
		};
	}
});