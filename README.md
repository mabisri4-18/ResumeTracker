# ResumeTracker – Smart Resume Analytics Platform

A full-stack web application that allows users to upload and manage their resumes, share a public resume link, and track resume views through an analytics dashboard.

## 🌐 Live Demo

- **Live Application:** https://resume-tracker-delta.vercel.app/
- **GitHub Repository:** https://github.com/mabisri4-18/ResumeTracker.git

## 📌 About the Project

ResumeTracker is a web-based resume management and analytics platform designed to help users manage their resumes and understand how often they are viewed.

Users can create an account, log in securely, upload a resume, and obtain a shareable public link. When someone accesses the shared resume, the application records the view and makes the information available through the user's dashboard.

The project combines frontend development, backend API development, database management, authentication, cloud file storage, and analytics in a single application.

## ✨ Features

- **User Authentication:** Register and log in securely using JWT-based authentication.
- **Resume Upload:** Upload PDF resumes through the application.
- **Cloud Storage:** Store resume files using Supabase Storage.
- **Public Resume Sharing:** Generate a shareable link for accessing a resume.
- **View Tracking:** Record visits to shared resume links.
- **Analytics Dashboard:** Display total resume views and individual view records.
- **REST API:** Connect the React frontend to the Spring Boot backend through REST endpoints.
- **Database Integration:** Store user information and resume metadata in MySQL.
- **Responsive Web Interface:** Access the application through a web browser.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven
- REST APIs
- JWT Authentication
- BCrypt Password Hashing

### Database and Storage
- MySQL 8
- Supabase Storage

### Tools and Deployment
- Git and GitHub
- Visual Studio Code
- Postman
- Vercel

## 🏗️ System Architecture

```text
          User
           |
           v
    React + Vite Frontend
           |
           | REST API / HTTP
           v
    Spring Boot Backend
           |
     +-----+------+
     |            |
     v            v
  MySQL DB    Supabase Storage
     |            |
     v            v
 User Data     Resume PDFs
 Resume Data
 View Records

Public Resume Link
         |
         v
 Spring Boot Redirect Endpoint
         |
         v
 Record Resume View
         |
         v
 Redirect to Stored Resume
```

## 🔄 Application Workflow

1. A new user registers and logs in.
2. The backend authenticates the user and issues a JWT.
3. The user uploads a PDF resume.
4. The backend stores the resume file in Supabase Storage and saves its metadata in MySQL.
5. The application provides a public resume link.
6. When a visitor opens the link, the backend records the view and redirects the visitor to the stored resume.
7. The user checks the resume-view statistics on the dashboard.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following software:

- Java Development Kit (JDK) 17
- Node.js and npm
- MySQL Server 8
- Git
- A Supabase account and Storage bucket

### 1. Clone the Repository

```bash
git clone https://github.com/mabisri4-18/ResumeTracker.git
cd ResumeTracker
```

### 2. Configure the Database

Create a MySQL database:

```sql
CREATE DATABASE resume_tracker;
```

Configure your backend database connection in the Spring Boot configuration file.

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/resume_tracker
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Ensure the database credentials and Hibernate/JPA settings match your local environment.

### 3. Configure Supabase Storage

1. Create a Supabase project.
2. Create a private Storage bucket named `resumes`.
3. Configure the Supabase project URL and the required storage credentials in the backend.
4. Keep service-role keys and other secrets in environment variables or a local, untracked configuration file.

**Security note:** Never commit database passwords, JWT secrets, or Supabase service-role keys to GitHub.

### 4. Run the Backend

Open a terminal in the backend project directory:

```bash
cd backend/resume-tracker/resume-tracker
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

`http://localhost:8080`

### 5. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal, usually:

`http://localhost:5173`

**Note:** Update the frontend API base URL if necessary to point to your local Spring Boot backend.

## 🔗 API Overview

The following endpoints describe the application's main API operations.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/dashboard` | Retrieve dashboard information |
| GET | `/r/{username}` | Access the public resume link and record a view |

Authenticated endpoints require the appropriate JWT authorization header.

```http
Authorization: Bearer <your-jwt-token>
```

The exact request fields and response formats depend on the backend implementation.

## 📊 Analytics

ResumeTracker maintains resume-view information to help users understand engagement with their shared resumes.

The dashboard can display:

- Total resume views
- Resume information
- Individual view records
- Resume-sharing details

Additional analytics, such as browser, device, referral source, and approximate visitor location, can be introduced as future enhancements if they are not already implemented.

## 🔒 Security

- JWT-based authentication for protected API endpoints.
- BCrypt password hashing.
- Server-side authentication and authorization.
- Private resume storage with controlled access.
- Environment-based configuration for sensitive credentials.

## 🔮 Future Enhancements

- Daily, weekly, and monthly analytics.
- Browser and device statistics.
- Referral-source analytics.
- Approximate geographic analytics with privacy safeguards.
- Resume profile pages with additional professional information.
- Resume download and sharing insights.
- Automated backend and frontend testing.
- Improved dashboard visualizations.

## 🎯 Project Objectives

- Build a full-stack web application using modern technologies.
- Understand REST API development and integration.
- Implement secure authentication and authorization.
- Integrate relational database management with cloud file storage.
- Track and present user activity through analytics.
- Apply practical software development and version-control workflows.

## 👩‍💻 Author

**Abisri M.**

B.E. Computer Science and Engineering – Internet of Things

GitHub: [mabisri4-18](https://github.com/mabisri4-18)

## 📄 License

No license has been specified here. Add a `LICENSE` file and update this section if you choose to distribute the project under an open-source license.
