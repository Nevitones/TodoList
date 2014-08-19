var util = require('util'),
	http = require('http'),
	// url = require('url'),
	fs = require('fs'),
	querystring = require('querystring'),
	colors = require('colors'),
	address,
	port;
	
	address = process.argv.length >= 3 ? process.argv[2] : '127.0.0.1';
	port = process.argv.length >= 4 ? process.argv[3] : '9090';

http.createServer(function(request, response){
	var data = '';
	request.on('data', function(chunk) {
		data += chunk;
	});

	request.on('end', function() {

		fs.readFile('todo-list.json', {'encoding': 'utf8'}, function(error, fileContent) {
			if (error) throw error;

			var todoList = JSON.parse(fileContent),
				nextId = todoList.length ? todoList[todoList.length - 1].id + 1 : 0,
				// todoItem = data.length ? querystring.parse(data.toString()) : undefined,
				todoItem = data.length ? JSON.parse(data) : undefined,
				id = parseInt(request.url.substr(1), 10),
				onlyGetAllowed = todoItem === undefined && isNaN(id);
			
			switch(request.method) {
				case 'GET':
					setHeaders(onlyGetAllowed, response, JSON.stringify(todoList));
				break;
				case 'POST':
				case 'PUT':
					// todoItem.done = (todoItem.done === 'true'); // Convert from string to boolean
					// if (todoItem.id) {
					if (request.method === 'PUT') {
						todoList.some(function(item, index, array){
							if (item.id === parseInt(todoItem.id, 10)) {
								item.description = todoItem.description;
								item.done = todoItem.done;
								return true;
							}
						});
					} else {
						todoItem.id = nextId;
						todoItem.description = todoItem.description.replace(/</g, '&lt').replace(/>/g, '&gt');
						todoList.push(todoItem);
					}
					fs.writeFile('todo-list.json', JSON.stringify(todoList), function (error) {
						if (error) throw error;
						
						if (todoItem.id === nextId) {
							console.log('ADD:\t', util.inspect(todoItem).green);
						} else {
							console.log('UPDATE\t', util.inspect(todoItem).yellow);
						}
						console.log('\ttodo-list.json updated!\n');
						setHeaders(!onlyGetAllowed, response, JSON.stringify(todoItem));
					});
				break;
				case 'DELETE':
					todoList.some(function(item, index, array){
						if (item.id === id) {
							todoItem = todoList.splice(index, 1);
							return true;
						}
					});

					fs.writeFile('todo-list.json', JSON.stringify(todoList), function (error) {
						if (error) throw error;
						console.log('DELETE:\t', util.inspect(todoItem).red);
						console.log('\ttodo-list.json updated!\n');
						setHeaders(!onlyGetAllowed, response, JSON.stringify(todoItem));
					});
				break;
				case 'OPTIONS':
					setHeaders(true, response);
					/*
						Unlike simple requests (discussed above), "preflighted" requests first send an HTTP request by the OPTIONS method
						to the resource on the other domain, in order to determine whether the actual request is safe to send.
						Cross-site requests are preflighted like this since they may have implications to user data.
					*/
				break;
				default:
					setHeaders(false, response);
			}

		});
	});
}).listen(port, address);

function setHeaders(isMethodAllowed, response, data) {
	if (isMethodAllowed) {
		response.writeHead(200, {'Content-Type': 'application/json',
								'Access-Control-Allow-Origin': '*',
								'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE',
								'Access-Control-Allow-Headers': 'Content-Type'});
		response.end(data);
	} else {
		response.writeHead(405, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE'});
		response.end('405 Method Not Allowed');
	}
}

console.log('Server running at ' + address + ':' + port);