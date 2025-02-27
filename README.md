# Collaborative Code Editor with Real-Time Synchronization and Code Execution

This is a collaborative code editor that allows multiple users to work together on the same code in real-time. It supports multiple programming languages, provides a code execution feature, and allows users to input standard inputs for their programs. The project leverages **Socket.IO** for real-time synchronization, a code execution API for running programs, and a modern, user-friendly interface.

## Features

- **Real-Time Collaboration:** Multiple users can edit the same code simultaneously with live synchronization.
- **Multi-Language Support:** Run code in Python, Java, C, C++, and JavaScript.
- **Code Execution with Input:** Execute code directly from the editor with support for standard input and output.
- **Room Management:** Users can create and join rooms using unique Room IDs.
- **Console Output:** Displays the output of code execution in a console-like interface.
- **Dynamic Language Selection:** Users can switch programming languages from the dropdown menu.

## Technologies Used

- **Frontend:** React, React Router, Axios, Toast Notifications.
- **Backend:** Node.js, Express, Socket.IO.
- **Code Execution:** JDoodle API (or similar).
- **Real-Time Communication:** Socket.IO.
- **Styling:** CSS for a modern and responsive UI.

---

## Setup Instructions

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v14 or later)
- npm or Yarn
- A JDoodle API account (or similar) for code execution
- React Developer Tools (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/alokranjan609/Realtime-code-editor
cd code-editor
```
### 2. Install Dependencies
Install both frontend and backend dependencies:
```bash
npm install
```
### 3. Configure Environment Variables
Create a .env file in the root directory for the backend and frontend. Below is an example:
```bash
REACT_APP_BACKEND_URL=http://localhost:5000
```
### 4. Start the Development Servers
Start both the backend and frontend servers.
```bash
#for backend
npm run server:dev
```
```bash
#for frontend
npm run start
```
The application will be available at http://localhost:3000.

### Project Structure
```bash              
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── App.css          # CSS files
│   │   └── App.js           # Main React app
├── server.js                  # Backend
├── .env                     # Environment variables
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```
### Usage
- Open the application at http://localhost:3000.
- Enter your username and create or join a room.
- Write your code in the editor, provide input in the input area, and click Run to execute.
- View the output in the console output section.

### API Reference
The project uses the JDoodle API for code execution. Below is an example of a request payload:
```bash
{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret",
  "script": "print(\"Hello, World!\")",
  "stdin": "input values",
  "language": "python3",
  "versionIndex": "3"
}
```
### Contribution
Contributions are welcome! Follow these steps to contribute:
- Fork the repository.
- Create a new branch (git checkout -b feature-branch-name).
- Make your changes and commit them (git commit -m "Description of changes").
- Push to the branch (git push origin feature-branch-name).
- Open a pull request.



