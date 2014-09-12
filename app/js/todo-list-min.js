var TodoModel = Backbone.Model.extend({
    defaults: function() {
        return {
            done: false,
            description: ""
        };
    }
});

var TodoCollection = Backbone.Collection.extend({
    url: "http://localhost:9595",
    model: TodoModel
});

var TodoModelView = Backbone.View.extend({
    tagName: "li",
    className: "todo-list-item",
    model: new TodoModel(),
    events: {
        "click a": "delete",
        "click input": "close",
        "blur .description": "close",
        "dblclick .description": "edit",
        "keypress .description": "onKeypress"
    },
    initialize: function() {
        this.template = _.template($("#todoItem").html());
        this.listenTo(this.model, "change:done", this.doneChanged);
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON())).removeClass("done").addClass(this.model.get("done") ? "done" : "");
        return this;
    },
    "delete": function(e) {
        e.preventDefault();
        var self = this;
        self.model.destroy({
            success: function(model) {
                self.$el.animate({
                    marginTop: -self.$el.outerHeight(),
                    opacity: 0
                }, 250, function() {
                    self.remove();
                });
            }
        });
    },
    edit: function(e) {
        this.$el.find(".description").attr("contenteditable", true).focus();
    },
    onKeypress: function(e) {
        if (e.keyCode === 13) {
            this.$el.find(".description").blur();
        }
    },
    close: function(e) {
        var description = this.$el.find(".description").removeAttr("contenteditable").text(), done = this.$el.find("input").prop("checked");
        this.model.set({
            description: description.replace(/</g, "&lt").replace(/>/g, "&gt"),
            done: done
        });
        this.model.save();
    },
    doneChanged: function() {
        this.render();
    }
});

var TodoCollectionView = Backbone.View.extend({
    initialize: function() {
        this.collection = new TodoCollection();
        this.listenTo(this.collection, "add", this.itemAdded);
    },
    render: function() {
        this.$el.empty();
        this.collection.fetch();
        return this;
    },
    itemAdded: function(model) {
        var todoModelView = new TodoModelView({
            model: model
        });
        this.$el.append(todoModelView.render().$el);
        todoModelView.render().$el.css({
            marginTop: -todoModelView.render().$el.outerHeight(),
            opacity: 0
        }).animate({
            marginTop: 0,
            opacity: 1
        }, 250);
        if (model.isNew()) {
            todoModelView.edit();
        }
    }
});

var TodoMainView = Backbone.View.extend({
    el: "body",
    events: {
        "click button": "addItem"
    },
    initialize: function() {
        this.$el.append($("#todoMain").html());
        this.todoCollectionView = new TodoCollectionView({
            el: this.$el.find("#todoList")
        }).render();
    },
    addItem: function() {
        this.todoCollectionView.collection.add(new TodoModel());
    }
});

var todoMainView = new TodoMainView();