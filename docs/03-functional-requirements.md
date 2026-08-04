# Functional Requirements

# Document Information

| Field | Value |
|--------|-------|
| Document | Functional Requirements |
| Version | 1.0 |
| Author | K Dridi |
| Date | 04/08/2026 |
| Status | Draft |

---

# 1. Introduction

This document describes the functional requirements of the Intelligent Training & Certification Management Platform. It specifies the system functionalities that must be implemented to satisfy business needs.

The requirements are organized according to the selected project modules.

---

# 2. Module 1 – User Management

## FR-001 User Registration

The system shall allow new users to create an account.

---

## FR-002 User Authentication

The system shall authenticate users using JWT authentication.

---

## FR-003 User Login

The system shall allow registered users to log into the platform.

---

## FR-004 User Logout

The system shall allow authenticated users to securely log out.

---

## FR-005 Role Management

The administrator shall be able to assign and update user roles.

Supported roles include:

- Administrator
- Trainer
- Learner

---

## FR-006 User Management

The administrator shall be able to:

- Create users
- Update users
- Delete users
- View user details
- Activate or deactivate user accounts

---

## FR-007 Profile Management

Users shall be able to:

- View profile
- Update profile
- Upload profile picture
- Manage personal information

---

## FR-008 Skills Management

Users shall be able to add, update and remove professional skills.

---

# 3. Module 2 – Training Catalog Management

## FR-009 Training Management

The administrator shall be able to:

- Create training
- Update training
- Delete training
- View training information

---

## FR-010 Category Management

The administrator shall manage training categories.

---

## FR-011 Search Training

Users shall be able to search training courses by title.

---

## FR-012 Filter Training

Users shall be able to filter training courses by:

- Category
- Level
- Duration

---

## FR-013 View Training Details

Users shall be able to consult complete training information.

---

# 4. Module 3 – Enrollment & Sessions

## FR-014 Training Enrollment

Learners shall be able to enroll in available training sessions.

---

## FR-015 Cancel Enrollment

Learners shall be able to cancel an enrollment before the session starts.

---

## FR-016 Enrollment History

Learners shall be be able to consult their enrollment history.

---

## FR-017 Session Management

Administrators shall be able to:

- Create sessions
- Update sessions
- Delete sessions
- Define session capacity
- Manage session status

---

## FR-018 Session Availability

The system shall automatically verify seat availability before accepting a new enrollment.

---

# 5. Machine Learning Requirements

## FR-019 Training Recommendation

The system shall recommend relevant training courses based on:

- User skills
- User profile
- Previous enrollments

---

# 6. Security Requirements

## FR-020 Authentication

Only authenticated users shall access protected resources.

---

## FR-021 Authorization

The system shall restrict access according to user roles.

---

# 7. System Requirements

## FR-022 REST API

The backend shall expose RESTful APIs.

---

## FR-023 API Documentation

The backend shall provide Swagger/OpenAPI documentation.

---

## FR-024 Validation

The system shall validate all user inputs before processing requests.

---

## FR-025 Exception Handling

The system shall provide centralized exception handling.

---

## FR-026 Pagination

The system shall support pagination for large datasets.

---

## FR-027 Sorting

The system shall support sorting of search results.

---

## FR-028 Logging

The system shall record important application events for monitoring and debugging purposes.