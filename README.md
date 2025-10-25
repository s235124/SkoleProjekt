# SkoleProjekt — Learning Management System (LMS)

## 🧩 Project Overview
**SkoleProjekt** is a fully functional Learning Management System (LMS) developed as part of a university project.  
It demonstrates the design and implementation of a modern full-stack web application using current web technologies.

The project was created to explore how digital tools can streamline learning, teaching, and course management — from user authentication and course creation to student enrollment.

---

## Features
- **User Roles & Access Control:** Separate dashboards and permissions for students, instructors, and (optionally) admins  
- **Course Management:** Instructors can create, edit, and delete courses and organize them into lessons/modules  
- **Student Experience:** Students can browse available courses, enroll, and track their learning progress  
- **Modern Frontend:** Built with **Next.js** and **TypeScript** for a fast, maintainable, and responsive interface  
- **Clean Architecture:** Organized components, hooks, and library files for scalability and readability  
- **Responsive UI:** Styled with **Tailwind CSS** for a polished and adaptive user interface  

---

## Tech Stack
| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (React) + TypeScript |
| **Styling** | Tailwind CSS, PostCSS |
| **Backend/API** | Next.js API Routes |
| **Tooling** | ESLint, TSConfig, npm scripts |
| **Language Breakdown** | Primarily TypeScript (~85%) with supporting JavaScript and CSS |

---

##  What We Learned & Demonstrated
- Building a **complete full-stack application** — UI, logic, and backend  
- Applying **TypeScript** for type safety and maintainable code  
- Creating reusable **React components** and **custom hooks**  
- Managing **state**, **routing**, and **data flow** in a scalable structure  
- Implementing responsive design principles with **Tailwind CSS**  
- Structuring projects for **deployment and collaboration**

---


##  Getting Started
```bash
Clone the Repository

git clone https://github.com/s235124/SkoleProjekt.git
cd SkoleProjekt
run npm install

This project requires a MySQL server to be running locally (or remotely) to store user, course, and enrollment data.

Create a new database, for example:
CREATE DATABASE skoleprojekt;

Configure the server details in the server/db.js file

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'skoleprojekt',
});

module.exports = db;

Then, run the the backend:
npm run server

And finally run the development server:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

