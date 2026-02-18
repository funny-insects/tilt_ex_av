let API_URL = 'http://localhost:5001';

// Fetch API URL from server config
async function loadConfig() {
    try {
        const response = await fetch('/config');
        const config = await response.json();
        API_URL = config.apiUrl;
    } catch (error) {
        console.log('Using default API URL:', API_URL);
    }
}

// DOM Elements
const todoInput = document.getElementById('todoInput');
const dueDateInput = document.getElementById('dueDateInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Fetch all todos
async function fetchTodos() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        
        const response = await fetch(`${API_URL}/api/todos`);
        if (!response.ok) throw new Error('Failed to fetch todos');
        
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        showError('Failed to load todos. Make sure the API is running.');
        console.error('Error fetching todos:', error);
    } finally {
        loading.style.display = 'none';
    }
}

// Render todos to the DOM
function renderTodos(todos) {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty">No todos yet. Add one above!</li>';
        return;
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        const dueDate = todo.due_date ? `<span class="due-date">Due: ${todo.due_date}</span>` : '';
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo('${todo.id}', this.checked)">
            <div class="todo-content">
                <span class="todo-title">${escapeHtml(todo.title)}</span>
                ${dueDate}
            </div>
            <button class="delete-btn" onclick="deleteTodo('${todo.id}')">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

// Add a new todo
async function addTodo() {
    const title = todoInput.value.trim();
    if (!title) return;

    const todoData = { title };
    
    // Add due_date if provided
    if (dueDateInput.value) {
        todoData.due_date = dueDateInput.value;
    }

    try {
        errorDiv.style.display = 'none';
        const response = await fetch(`${API_URL}/api/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todoData)
        });

        if (!response.ok) throw new Error('Failed to add todo');

        todoInput.value = '';
        dueDateInput.value = '';
        fetchTodos();
    } catch (error) {
        showError('Failed to add todo');
        console.error('Error adding todo:', error);
    }
}

// Toggle todo completion
async function toggleTodo(id, completed) {
    try {
        errorDiv.style.display = 'none';
        const response = await fetch(`${API_URL}/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });

        if (!response.ok) throw new Error('Failed to update todo');
        fetchTodos();
    } catch (error) {
        showError('Failed to update todo');
        console.error('Error updating todo:', error);
    }
}

// Delete a todo
async function deleteTodo(id) {
    try {
        errorDiv.style.display = 'none';
        const response = await fetch(`${API_URL}/api/todos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete todo');
        fetchTodos();
    } catch (error) {
        showError('Failed to delete todo');
        console.error('Error deleting todo:', error);
    }
}

// Show error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Initialize
loadConfig().then(fetchTodos);
