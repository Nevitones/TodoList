var TodoCollectionView = Backbone.View.extend({
	initialize: function() {
		this.collection = new TodoCollection();
		this.listenTo(this.collection, 'add', this.itemAdded);
	},

	render: function() {
		this.$el.empty();
		this.collection.fetch();
		return this;
	},

	itemAdded: function(model) {
		var todoModelView = new TodoModelView({model: model});
		this.$el.append(todoModelView.render().$el);
		todoModelView.render().$el
				.css({marginTop: -todoModelView.render().$el.outerHeight(), opacity:0})
				.animate({marginTop: 0, opacity:1}, 250);

		if (model.isNew()) {
			todoModelView.edit();
		}
	}
});