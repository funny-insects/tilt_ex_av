# Todo App Monorepo

A simple todo application with two microservices:
- **Frontend**: Vanilla HTML/JavaScript served by Express.js
- **API**: Python Flask REST API

## Project Structure

```
├── api/                 # Python Flask API service
│   ├── app.py          # Flask application
│   └── requirements.txt # Python dependencies
│
├── frontend/            # Express.js frontend service
│   ├── server.js       # Express server
│   ├── package.json    # Node.js dependencies
│   └── public/         # Static assets
│       ├── index.html  # Main HTML page
│       ├── app.js      # Frontend JavaScript
│       └── styles.css  # Styles
```

## Running Locally

### API Service (Port 5000)

```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Service (Port 3000)

```bash
cd frontend
npm install
npm start
```

Then open http://localhost:3000 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/todos | Get all todos |
| POST | /api/todos | Create a todo |
| PUT | /api/todos/:id | Update a todo |
| DELETE | /api/todos/:id | Delete a todo |

## Environment Variables

### Frontend
- `PORT`: Server port (default: 3000)
- `API_URL`: URL of the API service (default: http://localhost:5000)
