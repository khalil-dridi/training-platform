🎓 Training Platform

<p align="center">
  <img src="docs/screenshots/Home.png" alt="Training Platform Home" width="100%" />
</p>

<h2 align="center">Intelligent Learning & Professional Training Platform</h2>

<p align="center">
  A full-stack e-learning platform combining <b>Angular</b>, <b>Spring Boot</b>,
  <b>Machine Learning</b>, <b>Docker</b> and <b>Continuous Integration</b>.
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Angular-Frontend-DD0031?style=for-the-badge&logo=angular&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=openjdk&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/Python-ML-3776AB?style=for-the-badge&logo=python&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white"></a>
  <a href="#"><img src="https://img.shields.io/badge/Jenkins-CI-D24939?style=for-the-badge&logo=jenkins&logoColor=white"></a>
</p>

✨ Project Overview

Training Platform is an intelligent online learning platform designed to manage professional training from course creation to learner progress and personalized recommendations.

The platform provides dedicated experiences for:

Role

Experience

👨‍💼 Admin

Users, categories, instructor requests and platform management

👨‍🏫 Trainer

Courses, chapters, lessons, videos and students

👨‍🎓 Learner

Course discovery, enrollment, learning and progress tracking

🌍 Visitor

Public home page, course catalog and course details

The project also integrates a Machine Learning recommendation system that uses learner-related data to suggest relevant courses.

🚀 Key Features

🔐 Authentication & Security

Registration and login

JWT authentication

Google OAuth2

Role-based authorization

Password recovery

Email verification

Profile management

Password change

Protected routes and APIs

User notifications and validation feedback

👨‍💼 Admin Workspace

Admin dashboard

User management

Category management

Instructor request management

Admin profile

Confirmation dialogs

Notifications

👨‍🏫 Trainer Workspace

Trainer dashboard

Create, update and delete courses

Publish courses

Manage chapters

Manage lessons

Upload lesson videos

Manage students

View student/course details

Trainer profile

👨‍🎓 Learner Experience

Learner dashboard

Browse published courses

Course details

Enrollment

My Courses

Learning player

Lesson completion / uncompletion

Course progress tracking

Learner profile

Personalized course recommendations

🤖 Machine Learning

The MLA component focuses on personalized course recommendation.

Recommendation flow

┌───────────────────────────┐
│ Learner information       │
│ + learning activity       │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Dataset preparation       │
│ + feature handling        │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Recommendation model      │
│ Machine Learning pipeline │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Recommendation scores     │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Recommended courses       │
│ in learner interface      │
└───────────────────────────┘

MLA structure

mla/
├── dataset/
├── models/
├── notebooks/
└── src/
    ├── api.py
    ├── database.py
    ├── recommender.py
    ├── test_dataset.py
    └── test_recommender.py

🏗️ Architecture

                         ┌──────────────────────────┐
                         │      Angular Frontend    │
                         │ Admin / Trainer /        │
                         │ Learner / Public         │
                         └────────────┬─────────────┘
                                      │
                                   REST API
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │      Spring Boot API      │
                         │ Business + Security       │
                         └─────────┬─────────┬──────┘
                                   │         │
                     ┌─────────────┘         └──────────────┐
                     ▼                                      ▼
             ┌────────────────┐                    ┌────────────────┐
             │     MySQL      │                    │   Cloudinary   │
             │   Database     │                    │ Images/Videos  │
             └────────────────┘                    └────────────────┘
                                   │
                                   ▼
                          ┌────────────────────┐
                          │  MLA / Python API  │
                          │ Course Recommendation │
                          └────────────────────┘

🛠️ Technology Stack

Layer

Technologies

🎨 Frontend

Angular, TypeScript, Angular Material, SCSS, Reactive Forms

⚙️ Backend

Java 21, Spring Boot, Spring Security, Spring Data JPA, Hibernate

🔑 Security

JWT, OAuth2 / Google, role-based authorization

🗄️ Database

MySQL

🤖 MLA

Python, Pandas, NumPy, Scikit-learn

🐳 DevOps

Docker, Docker Compose, Jenkins

☁️ External Services

Cloudinary, Brevo SMTP, Google OAuth2

📸 Product Showcase

All screenshots below are stored in docs/screenshots/.

🌍 Public Experience

Home



Browse Courses



Public Course Details



🔐 Authentication

Login



Sign Up



Forgot Password



👨‍💼 Admin Workspace

Admin Dashboard



Manage Users



Categories



Instructor Requests



👨‍🏫 Trainer Workspace

Trainer Dashboard



My Courses



Create Course



Edit Course



Manage Courses



My Students



Course Details



👨‍🎓 Learner Workspace

Learner Dashboard



My Courses



Recommended Courses — MLA



👤 Profile

User Profile



📈 Learning Workflow

Browse Courses
      ↓
Course Details
      ↓
Enroll
      ↓
My Courses
      ↓
Learning Player
      ↓
Complete Lessons
      ↓
Course Progress
      ↓
Course Completed ✅

🐳 Docker & Local Execution

Prerequisites

Git

Docker Desktop

Start the platform

docker compose --env-file .env -f docker/docker-compose.yml up -d

Check containers

docker ps

Stop the platform

docker compose --env-file .env -f docker/docker-compose.yml down

⚠️ Never commit .env files or real credentials.

🔄 Continuous Integration

The project includes a Jenkins CI pipeline.

CI workflow

Git Push
   │
   ▼
Jenkins
   │
   ├── Backend validation
   ├── Frontend validation
   ├── MLA validation
   └── Build / Tests
          │
          ▼
      CI Result ✅

The goal is to automatically validate the project after source-code changes.

📂 Repository Structure

training-platform/
│
├── backend/
│   └── training-platform/
│
├── frontend/
│   └── training-platform-ui/
│
├── mla/
│   ├── dataset/
│   ├── models/
│   ├── notebooks/
│   └── src/
│
├── docker/
│   └── docker-compose.yml
│
├── docs/
│   ├── 01-project-vision.md
│   ├── 02-project-scope.md
│   ├── 03-functional-requirements.md
│   ├── 04-non-functional-requirements.md
│   ├── 05-user-stories.md
│   ├── 06-use-cases.md
│   └── screenshots/
│
├── Jenkinsfile
└── README.md

🔒 Security

Backend

Spring Security

JWT authentication

Role-based authorization

Protected REST endpoints

OAuth2 authentication

Environment-based configuration

Frontend

Route guards

Authentication interceptor

Role-aware navigation

Form validation

User feedback and notifications

📚 Documentation

Project documentation is available in docs/:

Project Vision

Project Scope

Functional Requirements

Non-Functional Requirements

User Stories

Use Cases

🎯 Academic Project

Training Platform was developed as an Integrated Academic Project combining:

Angular
   +
Spring Boot
   +
Machine Learning
   +
Docker
   +
Continuous Integration

The project demonstrates a complete workflow from user authentication and course management to intelligent recommendations and DevOps validation.

🔮 Future Improvements

Advanced learner analytics

More sophisticated recommendation models

Online quizzes and assessments

Certifications and digital badges

Real-time learning sessions

Expanded automated testing

Continuous deployment

Cloud deployment

Advanced monitoring and observability

👤 Author

<p align="center">
  <b>Khalil Dridi</b><br>
  Full-Stack Developer<br><br>
  <b>Training Platform</b><br>
  Academic Integrated Project
</p>

<p align="center">
  <b>Angular • Spring Boot • Machine Learning • Docker • Jenkins</b>
</p>