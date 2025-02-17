# RASP Web Application

This project is a web application for managing vehicle license plates and facial recognition for people. It uses Node.js for the backend and a simple HTML/CSS/JavaScript frontend.

## Project Structure

- `server/`: Contains the backend server code.
- `app/`: Contains the frontend code.
- `routes/`: Contains the route handlers for the backend.
- `utils/`: Contains utility scripts and helper functions.
- `certs/`: Contains SSL certificates for secure connections.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/rasp-webapp.git
    cd rasp-webapp
    ```

2. Install the Node.js dependencies:
    ```sh
    npm install
    ```

3. Create a Python virtual environment and install the required Python dependencies (this may take a while):
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    pip install cmake face-recognition opencv-python
    ```

### Running the Application

1. Start the backend server:
    ```sh
    node server/server.js
    ```

2. Open `app/index.html` in your web browser to access the frontend.

### Project Details

#### Backend

The backend server is built using Express.js and provides APIs for managing people and vehicle license plates.

- **Port**: 3000
- **Middlewares**:
  - `express.json()`: Parses incoming JSON requests.
  - `cors()`: Enables Cross-Origin Resource Sharing.
  - `express.static()`: Serves static files from the `face-recon/coletas_faciais` directory.

#### Frontend

The frontend is a simple HTML/CSS/JavaScript application that allows users to add and manage vehicle license plates and people.

- **Libraries Used**:
  - Materialize CSS for styling.
  - Google Fonts for icons.

### Routes

- `/pessoas`: Routes for managing people.
- `/placas`: Routes for managing vehicle license plates.

### License

This project is licensed under the MIT License.
