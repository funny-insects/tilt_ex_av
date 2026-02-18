from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
import logging
import os
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Enable remote debugging if DEBUG_MODE is set
if os.environ.get('DEBUG_MODE') == '1':
    import debugpy
    debugpy.listen(('0.0.0.0', 5678))
    logger.info('Debugpy listening on port 5678 - waiting for debugger to attach...')

app = Flask(__name__)
CORS(app)

# Valid priority levels
VALID_PRIORITIES = ['low', 'medium', 'high']
DEFAULT_PRIORITY = 'medium'

# In-memory todo storage
todos = []


def get_default_due_date():
    """Returns a default due date 7 days from now"""
    default_date = datetime.now() + timedelta(days=7)
    return default_date.strftime('%Y-%m-%d')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})


@app.route('/api/todos', methods=['GET'])
def get_todos():
    logger.info(f"GET /api/todos - Returning {len(todos)} todos")
    return jsonify(todos)


@app.route('/api/todos', methods=['POST'])
def create_todo():
    data = request.get_json()
    logger.info(f"POST /api/todos - Received data: {data}")
    
    if not data or 'title' not in data:
        logger.warning("POST /api/todos - Missing title in request")
        return jsonify({"error": "Title is required"}), 400
    
    # Use provided due_date or default to 7 days from now
    due_date = data.get('due_date')
    if not due_date:
        due_date = get_default_due_date()
        logger.info(f"No due_date provided, using default: {due_date}")
    else:
        logger.info(f"Using provided due_date: {due_date}")
    
    # Handle priority field - default to medium
    priority = data.get('priority', DEFAULT_PRIORITY).lower()
    if priority not in VALID_PRIORITIES:
        logger.warning(f"Invalid priority '{priority}', defaulting to {DEFAULT_PRIORITY}")
        priority = DEFAULT_PRIORITY
    logger.info(f"Setting priority to: {priority}")
    
    todo = {
        "id": str(uuid.uuid4()),
        "title": data['title'],
        "completed": False,
        "due_date": due_date,
        "priority": priority
    }
    todos.append(todo)
    logger.info(f"Created todo: {todo['id']} - '{todo['title']}' due {todo['due_date']}")
    return jsonify(todo), 201


@app.route('/api/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    logger.info(f"PUT /api/todos/{todo_id} - Received data: {data}")
    
    for todo in todos:
        if todo['id'] == todo_id:
            if 'title' in data:
                todo['title'] = data['title']
            if 'completed' in data:
                todo['completed'] = data['completed']
            if 'due_date' in data:
                todo['due_date'] = data['due_date']
                logger.info(f"Updated due_date to: {data['due_date']}")
            if 'priority' in data:
                priority = data['priority'].lower()
                if priority in VALID_PRIORITIES:
                    todo['priority'] = priority
                    logger.info(f"Updated priority to: {priority}")
                else:
                    logger.warning(f"Invalid priority '{priority}' - keeping existing: {todo.get('priority', DEFAULT_PRIORITY)}")
            logger.info(f"Updated todo: {todo_id}")
            return jsonify(todo)
    
    logger.warning(f"PUT /api/todos/{todo_id} - Todo not found")
    return jsonify({"error": "Todo not found"}), 404


@app.route('/api/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    logger.info(f"DELETE /api/todos/{todo_id}")
    original_length = len(todos)
    todos = [todo for todo in todos if todo['id'] != todo_id]
    if len(todos) < original_length:
        logger.info(f"Deleted todo: {todo_id}")
        return jsonify({"message": "Todo deleted"}), 200
    logger.warning(f"DELETE /api/todos/{todo_id} - Todo not found")
    return jsonify({"error": "Todo not found"}), 404


if __name__ == '__main__':
    logger.info("Starting Flask API server on port 5001")
    # Disable Flask's reloader when debugging to avoid issues with debugpy
    use_reloader = os.environ.get('DEBUG_MODE') != '1'
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=use_reloader)
