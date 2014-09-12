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
		this.listenTo(this.model, 'change:done', this.doneChanged);
	},

	render: function(){
		this.$el
			.html(this.template(this.model.toJSON()))
			.removeClass('done').addClass(this.model.get('done') ? 'done' : '');

		return this;
	},
	delete: function(e) {
		e.preventDefault();
		var self = this;
		self.model.destroy({
			success: function(model) {
				self.$el.animate({marginTop: -self.$el.outerHeight(), opacity:0}, 250, function() {
					self.remove();
				});
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

		this.model.set({
			'description': description.replace(/</g, '&lt').replace(/>/g, '&gt'),
			'done': done
		});

		this.model.save(); // CAN ADD A LOADING UNTIL SUCCESS CALLBACK
	},
	doneChanged: function() {
		this.render();
	}
});