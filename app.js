// Selecters

const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.select');
const todoContainer = document.querySelector('.todo-container');
const deleteCompletedButton = document.querySelector('.delete-completed');
deleteCompletedButton.classList.add('delete-completed-remove');

// Functions
const removeLocalStorageTodos = function (todo) {
	let todos;
	if (localStorage.getItem('todos') === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}

	const todoIndex = todo.children[0].innerText;
	for (let i = 0; i < todos.length; i++) {
		if (todos[i][0] == todoIndex) {
			todos.splice(todos.indexOf(todos[i]), 1);
		}
	}
	localStorage.setItem('todos', JSON.stringify(todos));
};

const saveLocalTodos = function (todo) {
	// Check if already have todos
	let todos;
	if (localStorage.getItem('todos') === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}

	todos.push([todo, false]);

	localStorage.setItem('todos', JSON.stringify(todos));
};

const getTodos = function () {
	let todos;
	if (localStorage.getItem('todos') === null) {
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}
	todos.forEach(function (todo) {
		// Create todo wrapper
		const todoDiv = document.createElement('div');
		todoDiv.classList.add('todo');
		if (todo[1]) {
			todoDiv.classList.add('completed');
		}

		// Create li
		const todoItem = document.createElement('li');
		todoItem.innerText = todo[0];
		todoItem.classList.add('todo-item');
		todoDiv.appendChild(todoItem);

		// Checkmark button
		const completeBtn = document.createElement('button');
		completeBtn.innerHTML = '<i class="fas fa-check"></i>';
		completeBtn.classList.add('complete-btn');
		todoDiv.appendChild(completeBtn);

		// Trash button
		const trashBtn = document.createElement('button');
		trashBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
		trashBtn.classList.add('trash-btn');
		todoDiv.appendChild(trashBtn);

		// Append todoDiv to ul
		todoList.appendChild(todoDiv);
	});
};

const addTodo = function (event) {
	if (!todoInput.value) return -1;

	event.preventDefault();

	// Create todo wrapper
	const todoDiv = document.createElement('div');
	todoDiv.classList.add('todo');

	// Create li
	const todoItem = document.createElement('li');
	todoItem.innerText = todoInput.value;
	todoItem.classList.add('todo-item');
	todoDiv.appendChild(todoItem);

	// Add todo to local storage
	saveLocalTodos(todoInput.value.trim());

	// Checkmark button
	const completeBtn = document.createElement('button');
	completeBtn.innerHTML = '<i class="fas fa-check"></i>';
	completeBtn.classList.add('complete-btn');
	todoDiv.appendChild(completeBtn);

	// Trash button
	const trashBtn = document.createElement('button');
	trashBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	trashBtn.classList.add('trash-btn');
	todoDiv.appendChild(trashBtn);

	// Append todoDiv to ul
	todoList.appendChild(todoDiv);

	// Clear todoInput value
	todoInput.value = '';
};

const deleteCheck = function (event) {
	const item = event.target;
	// Delete TODO
	if (item.classList[0] === 'trash-btn') {
		const todo = item.parentElement;
		// Animation
		todo.classList.add('fall');
		removeLocalStorageTodos(todo);

		// Wait little bit for transition
		setTimeout(() => {
			todo.remove();
		}, 500);
	}

	// Checkmark
	if (item.classList[0] === 'complete-btn') {
		// Check current todo
		item.parentElement.classList.toggle('completed');

		// Save chacked state in local storage
		const checkedTodo = item.parentElement.children[0].innerText;
		let todos = JSON.parse(localStorage.getItem('todos'));
		todos.forEach(function (todo) {
			if (todo[0] == checkedTodo) todo[1] = !todo[1];
		});
		localStorage.setItem('todos', JSON.stringify(todos));
	}
};

const filterTodo = function (e) {
	if (e.target.value == 'completed') {
		deleteCompletedButton.classList.remove('delete-completed-remove');
	} else {
		deleteCompletedButton.classList.add('delete-completed-remove');
	}
	const todos = todoList.childNodes;
	let countCompleted = 0;
	todos.forEach(function (todo) {
		switch (e.target.value) {
			case 'all':
				todo.style.display = 'flex';
				break;
			case 'completed':
				if (todo.classList.contains('completed')) {
					todo.style.display = 'flex';
				} else {
					todo.style.display = 'none';
				}
				break;
			case 'uncompleted':
				if (!todo.classList.contains('completed')) {
					todo.style.display = 'flex';
					countCompleted++;
				} else {
					todo.style.display = 'none';
				}
				break;
		}
	});
};

const deleteCompleted = function () {
	// Remove completed todos
	const todosInterface = todoList.children;
	let todo;
	for (let i = 0; i < todosInterface.length; i++) {
		todo = todosInterface[i];
		if (todo.classList.contains('completed')) {
			todo.classList.add('fall');
			todo.remove();
			i--;
		}
	}

	// Remove completed todos from local storage
	const todos = JSON.parse(localStorage.getItem('todos'));
	for (let i = 0; i < todos.length; i++) {
		if (todos[i][1]) {
			todos.splice(todos.indexOf(todos[i]), 1);
			i--;
		}
	}
	localStorage.setItem('todos', JSON.stringify(todos));

	// deleteCompletedButton.classList.add('delete-completed-remove');
	// console.slog(todosInterface[0].classList.contains('completed'));
};

// Event listeners

todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);
deleteCompletedButton.addEventListener('click', deleteCompleted);
document.addEventListener('DOMContentLoaded', getTodos);
