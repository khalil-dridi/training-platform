🎓 Training Platform

<p align="center">
  <img src="docs/screenshots/Home.png" alt="Training Platform Home" width="100%">
</p>

<h2 align="center">Intelligent Learning & Professional Training Platform</h2>

<p align="center">
  Full-stack e-learning platform combining <b>Angular</b>, <b>Spring Boot</b>,
  <b>Machine Learning</b>, <b>Docker</b> and <b>Jenkins CI</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-Frontend-DD0031?style=for-the-badge&logo=angular&logoColor=white">
  <img src="https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
  <img src="https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=openjdk&logoColor=white">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/Python-ML-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/Jenkins-CI-D24939?style=for-the-badge&logo=jenkins&logoColor=white">
</p>

✨ Overview

Training Platform is an intelligent online learning platform for managing professional training from course creation and lesson delivery to learner progress and personalized recommendations.

👥 User Roles

Role

Responsibilities

👨‍💼 Admin

Users, categories, instructor requests and platform management

👨‍🏫 Trainer

Courses, chapters, lessons, videos and students

👨‍🎓 Learner

Discovery, enrollment, learning and progress tracking

🌍 Visitor

Public home, course catalog and course details

🚀 Core Features

🔐 Authentication & Security

Registration and login

JWT authentication

Google OAuth2

Role-based authorization

Password recovery

Email verification

Profile management

Password change

Protected routes and REST endpoints

Notifications and validation feedback

👨‍💼 Admin

Dashboard

User management

Category management

Instructor request management

Profile management

Confirmation dialogs and notifications

👨‍🏫 Trainer

Dashboard

Course CRUD

Course publishing

Chapter and lesson management

Video upload

Student management

Course/student details

Profile management

👨‍🎓 Learner

Dashboard

Public course discovery

Enrollment

My Courses

Learning player

Lesson completion

Course progress tracking

Personalized recommendations

Profile management

🤖 Machine Learning

The MLA module provides personalized course recommendations based on learner-related information and learning activity.

Learner Data
     ↓
Dataset Preparation
     ↓
Feature Processing
     ↓
Recommendation Model
     ↓
Recommendation Scores
     ↓
Recommended Courses

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

                    ┌─────────────────────────┐
                    │     Angular Frontend    │
                    │ Admin / Trainer /       │
                    │ Learner / Public        │
                    └───────────┬─────────────┘
                                │ REST API
                                ▼
                    ┌─────────────────────────┐
                    │      Spring Boot        │
                    │ Business + Security     │
                    └───────┬─────────┬───────┘
                            │         │
                            ▼         ▼
                    ┌───────────┐ ┌──────────────┐
                    │   MySQL   │ │  Cloudinary  │
                    │ Database  │ │ Images/Video  │
                    └───────────┘ └──────────────┘
                            │
                            ▼
                    ┌────────────────────┐
                    │   MLA / Python     │
                    │ Recommendation API │
                    └────────────────────┘

🛠️ Technology Stack

Layer

Technologies

Frontend

Angular, TypeScript, Angular Material, SCSS, Reactive Forms

Backend

Java 21, Spring Boot, Spring Security, Spring Data JPA, Hibernate

Database

MySQL

Security

JWT, OAuth2 / Google, role-based authorization

MLA

Python, Pandas, NumPy, Scikit-learn

DevOps

Docker, Docker Compose, Jenkins

Services

Cloudinary, Brevo SMTP, Google OAuth2

📸 Complete Product Showcase

All screenshots are stored in docs/screenshots/ and are intentionally displayed directly in the README.

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



Recommended Courses • MLA



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

🐳 Docker

Start the platform

docker compose --env-file .env -f docker/docker-compose.yml up -d

Check containers

docker ps

Stop the platform

docker compose --env-file .env -f docker/docker-compose.yml down

⚠️ Never commit .env files or real credentials.

🔄 Continuous Integration

The project uses Jenkins for continuous integration.

Git Push
   ↓
Jenkins
   ├── Backend validation
   ├── Frontend validation
   ├── MLA validation
   └── Build / Tests
          ↓
       CI Result ✅

📂 Repository Structure

training-platform/
├── backend/
├── frontend/
├── mla/
│   ├── dataset/
│   ├── models/
│   ├── notebooks/
│   └── src/
├── docker/
│   └── docker-compose.yml
├── docs/
│   ├── 01-project-vision.md
│   ├── 02-project-scope.md
│   ├── 03-functional-requirements.md
│   ├── 04-non-functional-requirements.md
│   ├── 05-user-stories.md
│   ├── 06-use-cases.md
│   └── screenshots/
├── Jenkinsfile
└── README.md

🔒 Security

Backend

Spring Security

JWT authentication

Role-based authorization

Protected endpoints

OAuth2 authentication

Environment-based secrets

Frontend

Route guards

Authentication interceptor

Role-aware navigation

Form validation

Notifications

📚 Documentation

Project Vision

Project Scope

Functional Requirements

Non-Functional Requirements

User Stories

Use Cases

🎯 Academic Project

Training Platform demonstrates the integration of:

Angular + Spring Boot + Machine Learning + Docker + Continuous Integration

as a complete academic full-stack project.

🔮 Future Improvements

Advanced learner analytics

More sophisticated recommendation models

Online quizzes and assessments

Certifications and digital badges

Real-time learning sessions

Expanded automated testing

Continuous deployment

Cloud deployment

Monitoring and observability

👤 Author

<p align="center">
  <b>Khalil Dridi</b><br>
  Full-Stack Developer<br><br>
  <b>Training Platform</b><br>
  Academic Integrated Project
</p>

<p align="center">
  Angular • Spring Boot • Machine Learning • Docker • Jenkins
</p>
