# Project Scope

# Document Information

| Field | Value |
|--------|-------|
| Document | Project Scope |
| Version | 1.0 |
| Author | K Dridi |
| Date | 04/08/2026 |
| Status | Draft |

---

# 1. Purpose

This document defines the functional boundaries of the Intelligent Training & Certification Management Platform. It specifies the features included in the project, the selected modules, the intended users, and the functionalities that are intentionally excluded from the current version.

The purpose of this document is to ensure a clear understanding of the project scope among all stakeholders and to prevent unnecessary feature expansion during development.

---

# 2. Project Description

The Intelligent Training & Certification Management Platform is a web application that enables organizations to manage learners, training courses, and enrollment processes through a centralized system.

The platform aims to simplify administrative operations while providing learners with personalized training recommendations based on their profiles and competencies.

---

# 3. In Scope

The following functionalities are included in the project.

## Module 1 – User Management

### Authentication & Authorization

- User Registration
- User Login
- JWT Authentication
- Password Encryption
- Role-Based Access Control

### User Management

- Create User
- Update User
- Delete User
- View User Details
- Activate / Deactivate User

### Profile Management

- Personal Information
- Skills Management
- Profile Update

---

## Module 2 – Training Catalog Management

### Training Management

- Create Training
- Update Training
- Delete Training
- View Training Details

### Category Management

- Create Category
- Update Category
- Delete Category

### Search & Filtering

- Search by Title
- Search by Category
- Filter by Level
- Filter by Duration

---

## Module 3 – Enrollment & Sessions

### Enrollment

- Enroll in Training
- Cancel Enrollment
- View Enrollment History

### Session Management

- Create Session
- Update Session
- Manage Session Capacity
- Session Status

---

## Additional Features

- REST API
- Swagger Documentation
- Global Exception Handling
- Input Validation
- Pagination
- Sorting
- Search
- Docker Support
- Jenkins CI/CD Pipeline
- Machine Learning Recommendation Service

---

# 4. Out of Scope

The following features will NOT be implemented in this version of the project.

- Online Payment
- Discussion Forum
- Chat System
- Email Notifications
- SMS Notifications
- Certificate Generation
- Quiz & Examination Module
- Attendance Tracking
- Video Streaming
- Mobile Application
- Microservices Architecture
- Kubernetes Deployment
- Cloud Deployment

---

# 5. Target Users

The platform supports the following roles.

## Administrator

Responsible for managing users, training courses, categories, sessions, and overall platform administration.

## Trainer

Responsible for monitoring training sessions and enrolled learners.

## Learner

Responsible for managing personal profiles, browsing available training courses, enrolling in training sessions, and receiving intelligent training recommendations.

---

# 6. Business Constraints

The project must satisfy the following constraints.

- Spring Boot must be used for backend development.
- Angular must be used for frontend development.
- PostgreSQL will be used as the relational database.
- Docker will be used for containerization.
- Jenkins will be used for Continuous Integration.
- Machine Learning must be integrated for training recommendation.
- The project follows an Agile development approach.

---

# 7. Assumptions

The following assumptions are considered during project development.

- Users have internet access.
- Administrators are responsible for maintaining the training catalog.
- Learners complete their profiles accurately.
- The recommendation system relies on learner profiles and training information.

---

# 8. Deliverables

The project will deliver:

- Spring Boot Backend
- Angular Frontend
- PostgreSQL Database
- REST API
- Swagger Documentation
- Docker Configuration
- Jenkins Pipeline
- Machine Learning Recommendation Module
- Technical Documentation
- UML Diagramss