# NoteNexus

A **collaborative note-taking application** where users can register, log in, and manage their notes with privacy controls. Users can add, edit, view, and delete notes based on visibility settings (Public/Private). The platform ensures that only note owners can delete their private notes.

---

## Project Overview

**NoteNexus** is designed to simplify collaborative note management with the following key features:
- **User Authentication**: Secure registration and login system.
- **Home Page**: A personalized welcome screen with a navigation bar.
- **Add Notes**: Create notes with visibility options (`Public` or `Private`).
- **View Notes**: Displays public notes from all users and private notes of the current user.
- **Edit and Delete Notes**: Edit or delete notes with ownership-based access control.
- **Responsive Design**: Accessible and user-friendly across devices.

---

## Steps to Set Up and Run the Code

### Prerequisites:
Ensure you have the following installed:
  - **Node.js** (v14+ recommended)
  - **MongoDB** (local or hosted)

### 1. Clone the Repository
```bash
git clone <repository_url>
cd NoteNexus
```

### 2. Install Dependencies

Run the following command to install all required packages:

```bash
cd note-nexus-frontend
npm install
```

```bash
cd note-nexus-backend
npm install
```
  
### 3. Configuring Environment Variables

Create a .env file in note-nexus-backend with the following values:

```bash
MONGO_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret key>
```

### 4. Start the Application

```bash
cd note-nexus-frontend
npm start
```

```bash
cd note-nexus-backend
npm start
```

### 5. Access the Application

Open http://localhost:3000 in your browser to use the app.

---

## Dependencies and Prerequisites

Backend:

- **`Node.js`**: JavaScript runtime for server-side logic.
- **`Express.js`**: Web framework for the backend.
- **`MongoDB`**: Database for storing user and note data.
- **`Mongoose`**: ODM for MongoDB.
- **`JWT`**: Authentication via JSON Web Tokens.

Frontend:

- **`React.js`**: Frontend framework for the user interface.
- **`Tailwind CSS`**: Styling framework for consistent and responsive design.

---

## Explanation of the Main Files

Backend:

- **`note-nexus-backend/index.js`**: Entry point for the backend server. Configures middleware and routes.

- **`note-nexus-backend/routes/`**: Contains all API route definitions.
    - **`Routes.js`**: Manages authentication-related routes and also handles CRUD operations for notes.

- **`note-nexus-backend/models/`**: Mongoose schemas and models.
    - **`User.js`**: Schema for user data.
    - **`Note.js`**: Schema for notes data.

- **`note-nexus-backend/controllers/`**: 
    - **`UserController.js`**: Defines the core logic for each route.

Frontend:

- **`note-nexus-frontend/src/components/`**: Contains React components.
    - **`AddNote.jsx`**: Component for creating and adding new notes with visibility options (Public or Private).  
    - **`App.jsx`**: Central routing component that manages navigation between all pages and components of the application.  
    - **`AuthProvider.jsx`**: Context provider for managing user authentication state across the application.  
    - **`Changepassword.jsx`**: Component for allowing users to change their account password securely.  
    - **`DeleteNote.jsx`**: Component responsible for confirming and handling the deletion of notes.  
    - **`EditNote.jsx`**: Component for editing the content and visibility settings of existing notes.  
    - **`Editprofile.jsx`**: Component that enables users to update their profile details.  
    - **`Home.jsx`**: The home page displayed after login, serving as the main dashboard for users.  
    - **`Login.jsx`**: Component for user login, handling authentication and redirecting upon success.  
    - **`Main.jsx`**: The initial webpage displayed when the application starts.  
    - **`MainNav.jsx`**: Navigation bar component shown before login or during registration.  
    - **`Nav.jsx`**: Navigation bar component displayed after login, providing options for navigating the application.  
    - **`ProtectedLayout.jsx`**: Wrapper component ensuring access to certain routes is restricted to authenticated users only.  
    - **`Register.jsx`**: Component for new user registration, collecting user details and creating an account.  
    - **`ViewNote.jsx`**: Component for viewing the details of a single note, including its content and metadata.  
    - **`ViewNotes.jsx`**: Component for displaying a list of notes in a table format with pagination and sorting features.

- **`note-nexus-frontend/src/App.js`**:  The entry point for the React application  and the main layout and structure of the app are managed.

- **`note-nexus-frontend/src/index.css`**: Manages the overall styling of the application, including layout, typography, and theme.

- **`note-nexus-frontend/src/assets/`**: Folder containing all images and media files necessary for the application.

- **`note-nexus-frontend/src/config.js`**: Contains the base URL for the API. The `BASE_URL` can be set to either a local server URL (`http://localhost:8080`) for development or a production server URL (`https://note-nexus.onrender.com`) for deployment. 

- **`note-nexus-frontend/postcss.config.js`**: Configuration file for PostCSS, which is used for processing CSS. It integrates with Tailwind CSS to optimize and transform the CSS for the application, ensuring compatibility with different browsers and enhancing performance.

- **`note-nexus-frontend/tailwind.config.js`**: Configuration file for Tailwind CSS, allowing customization of the default Tailwind setup. It includes options for defining theme colors, fonts, breakpoints, and other settings specific to the project’s styling requirements.


