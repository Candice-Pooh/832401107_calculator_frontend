# Calculator Frontend

## 1. Project Overview

This repository contains the frontend of a
front-end and back-end separated calculator system.

The application provides an interactive calculator
interface and communicates with a Flask backend
through RESTful APIs.

All mathematical calculations are performed
by the backend.

## 2. Technology Stack

- HTML5
- CSS3
- JavaScript
- Fetch API
- GitHub Pages

The frontend does not require a JavaScript framework.

## 3. Project Structure

```text
calculator_frontend/
│
├── index.html
├── style.css
├── script.js
├── codestyle.md
└── README.md
```

## 4. Features

The frontend provides:

- Interactive calculator buttons
- Mathematical expression input
- Addition, subtraction, multiplication, and division
- Decimal and negative number input
- Parentheses
- Clear and backspace functions
- Calculation result display
- Calculation history display
- Individual history record deletion
- Backend connection status
- Error messages
- Responsive layout
- Keyboard input support

## 5. Frontend Architecture

The frontend contains three main files.

### index.html

Defines the structure of the calculator,
input fields, buttons, history panel,
and application layout.

### style.css

Controls the visual appearance,
responsive layout, typography,
button styles, and interface states.

### script.js

Handles user interaction and communicates
with the backend.

The JavaScript code does not independently
evaluate mathematical expressions.

Instead, it sends expressions to Flask
and displays the returned results.

## 6. Running Locally

Clone or download the repository.

Open the project folder in Visual Studio Code.

Use the Live Server extension to open index.html.

The frontend can run locally at:

http://127.0.0.1:5500

For local backend testing, configure
API_BASE_URL in script.js as:

```javascript
const API_BASE_URL = "http://127.0.0.1:5000";
```

The Flask backend must be running.

## 7. Backend API Connection

The deployed application uses:

```javascript
const API_BASE_URL = "https://candice0chen.pythonanywhere.com";
```

The frontend communicates with three main APIs:

POST /api/calculate

GET /api/history

DELETE /api/history/{id}

All requests are made through JavaScript Fetch API.

## 8. Frontend and Backend Separation

The frontend is responsible for:

- Displaying the calculator
- Collecting user input
- Sending API requests
- Rendering calculation results
- Displaying history records
- Handling user interactions

The backend is responsible for:

- Validating expressions
- Performing mathematical calculations
- Handling mathematical errors
- Storing calculation history
- Retrieving history records
- Deleting database records

If the backend becomes unavailable,
the frontend cannot perform new calculations.

## 9. Deployment

The frontend is deployed using GitHub Pages.

Live Website:

https://candice-pooh.github.io/832401107_calculator_frontend/

Deployment configuration:

- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

## 10. Repository Information

Student ID: 832401107

Frontend Repository:
https://github.com/Candice-Pooh/832401107_calculator_frontend

Backend Repository:
https://github.com/Candice-Pooh/832401107_calculator_backend