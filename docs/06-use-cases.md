# Use Cases

# Document Information

| Field | Value |
|--------|-------|
| Document | Use Cases |
| Version | 1.0 |
| Author | K Dridi |
| Date | 04/08/2026 |
| Status | Draft |

---

# 1. Introduction

This document describes the main use cases of the Intelligent Training & Certification Management Platform. It identifies the system actors and the interactions they perform with the platform.

The use cases are organized according to the selected project modules.

---

# 2. System Actors

The platform includes the following actors.

## Visitor

A non-authenticated user who can access public pages and register for an account.

---

## Learner

A registered user who can manage their profile, browse training courses, enroll in sessions, and receive training recommendations.

---

## Trainer

A user responsible for supervising training sessions.

---

## Administrator

The administrator manages users, training courses, categories, sessions, and platform configuration.

---

# 3. Use Cases

## Authentication

| ID | Use Case | Actor |
|----|----------|-------|
| UC-001 | Register | Visitor |
| UC-002 | Login | Visitor |
| UC-003 | Logout | Learner, Trainer, Administrator |

---

## User Management

| ID | Use Case | Actor |
|----|----------|-------|
| UC-004 | View Profile | Learner |
| UC-005 | Update Profile | Learner |
| UC-006 | Manage Skills | Learner |
| UC-007 | View Users | Administrator |
| UC-008 | Create User | Administrator |
| UC-009 | Update User | Administrator |
| UC-010 | Delete User | Administrator |
| UC-011 | Manage Roles | Administrator |

---

## Training Catalog

| ID | Use Case | Actor |
|----|----------|-------|
| UC-012 | View Training Catalog | Learner |
| UC-013 | View Training Details | Learner |
| UC-014 | Search Training | Learner |
| UC-015 | Filter Training | Learner |
| UC-016 | Create Training | Administrator |
| UC-017 | Update Training | Administrator |
| UC-018 | Delete Training | Administrator |
| UC-019 | Manage Categories | Administrator |

---

## Enrollment & Sessions

| ID | Use Case | Actor |
|----|----------|-------|
| UC-020 | Create Session | Administrator |
| UC-021 | Update Session | Administrator |
| UC-022 | Delete Session | Administrator |
| UC-023 | Enroll in Session | Learner |
| UC-024 | Cancel Enrollment | Learner |
| UC-025 | View Enrollment History | Learner |

---

## Machine Learning

| ID | Use Case | Actor |
|----|----------|-------|
| UC-026 | Receive Training Recommendations | Learner |

---

# 4. Use Case Relationships

Some use cases depend on others.

- Login is required before accessing protected features.
- Enrollment requires an existing training session.
- Session creation requires an existing training.
- Training recommendation requires an authenticated learner profile.
- Profile management influences training recommendations.

---

# 5. Use Case Priorities

| Priority | Description |
|----------|-------------|
| High | Essential for the first release |
| Medium | Important but not critical |
| Low | Optional improvements |

---

# 6. First Release Scope

The first release of the application includes:

- Authentication
- User Management
- Training Catalog
- Enrollment & Sessions
- Training Recommendation