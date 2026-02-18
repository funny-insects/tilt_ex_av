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

## Running with Docker Compose

```bash
docker-compose up
```

This will start both the API and frontend services in containers. Access the app at http://localhost:3000.

## Running with Kubernetes

### Prerequisites
- [k3d](https://k3d.io/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed

### Setup

1. Create a k3d cluster with a local registry:
```bash
k3d cluster create dev-cluster --registry-create k3d-registry.localhost:5111
```

2. Create the tilt namespace:
```bash
kubectl create namespace todo-app
```

3. Apply the Kubernetes manifests:
```bash
kubectl apply -f k8s/
```

4. Access the services using port-forwarding or the service endpoints.

## Running with Tilt

[Tilt](https://tilt.dev/) provides a fast development workflow with live updates.

### Prerequisites
- [Tilt](https://docs.tilt.dev/install.html) installed
- k3d cluster running (see Kubernetes setup above)

### Start Development

```bash
tilt up
```

This will:
- Build and deploy both services
- Set up live reload for code changes
- Provide a web UI at http://localhost:10350

Press `space` to open the Tilt UI in your browser, or press `q` to quit.

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
