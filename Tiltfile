# Tiltfile for Todo App
# Automates the Kubernetes development loop

# Only allow this Tiltfile to run against our local k3d dev-cluster
allow_k8s_contexts('k3d-dev-cluster')

# Local registry for faster image pushes (no need to push to remote registry)
default_registry('k3d-registry.localhost:5111')

# Load Kubernetes manifests
k8s_yaml(kustomize('k8s'))

# ============================================================================
# API Service
# ============================================================================
docker_build(
    'todo-api',
    context='./api',
    dockerfile='./api/Dockerfile',
    live_update=[
        # If requirements.txt changes, we need a full rebuild (must be first)
        fall_back_on('./api/requirements.txt'),
        # Sync app.py changes directly into the container
        sync('./api/app.py', '/app/app.py'),
    ],
)

k8s_resource(
    'api',
    port_forwards=[
        port_forward(5001, 5001, name='API'),
        port_forward(5678, 5678, name='Debug'),
    ],
    labels=['backend'],
)

# ============================================================================
# Frontend Service
# ============================================================================
docker_build(
    'todo-frontend',
    context='./frontend',
    dockerfile='./frontend/Dockerfile',
    live_update=[
        # If package.json changes, we need a full rebuild (must be first)
        fall_back_on('./frontend/package.json'),
        # Sync server.js and public folder changes directly into the container
        sync('./frontend/server.js', '/app/server.js'),
        sync('./frontend/public', '/app/public'),
    ],
)

k8s_resource(
    'frontend',
    port_forwards=[
        port_forward(3000, 3000, name='Frontend'),
    ],
    labels=['frontend'],
    resource_deps=['api'],  # Frontend depends on API being ready
)
