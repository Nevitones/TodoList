var TodoModelView = Backbone.View.extend({
	tagName: 'li',
	className: 'todo-list-item',
	model: new TodoModel(),
	events: {
		'click a': 'delete',
		'click input': 'close',
		'blur .description': 'close',
		'dblclick .description': 'edit',
		'keypress .description': 'onKeypress'
	},
	initialize: function(){
		this.template = _.template($('#todoItem').html());
	},

	render: function(){
		this.$el
			.html(this.template(this.model.toJSON()))
			.removeClass('done').addClass(this.model.get('done') ? 'done' : '');
		return this.$el;
	},
	delete: function(e) {
		e.preventDefault();
		this.model.destroy({
			success: function(){
				todoCollectionView.render();
			}
		});
	}, 
	edit: function(e){
		this.$el.find('.description').attr('contenteditable', true).focus();
	},
	onKeypress:function(e){
		if (e.keyCode === 13) {
			this.$el.find('.description').blur();
		}
	},
	close: function(e){
		var description = this.$el.find('.description')
							.removeAttr('contenteditable')
							.text(),
			done = this.$el.find('input').prop('checked');

		this.model.set('description', description.replace(/</g, '&lt').replace(/>/g, '&gt'));
		this.model.set('done', done);

		var self = this;

		this.model.save({}, {
			success: function(model){
				self.render();
				if (!model.id) {
					model.set('id', todoList.id);
				}
			}
		});
	},
});