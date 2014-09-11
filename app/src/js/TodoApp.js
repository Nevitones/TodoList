var todoCollectionView = new TodoCollectionView();

todoCollectionView.render();

$(document).on('ready', function(){

	$('button').on('click', function(e) {
		e.preventDefault();

		var todoModel = new TodoModel();
		todoCollectionView.model.add(todoModel);
	});

});