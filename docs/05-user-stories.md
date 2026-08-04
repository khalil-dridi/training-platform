# User Stories

## Document Information

| Field | Value |
|--------|-------|
| Document | User Stories |
| Version | 1.0 |
| Author | K Dridi |
| Date | 04/08/2026 |
| Status | Draft |

---

## 1. Introduction

This document defines the main user stories of the Intelligent Training & Certification Management Platform.

The user stories describe the expected system behavior from the perspective of the platform users.

The main actors are:

- Administrator
- Trainer
- Learner

The user stories are organized according to the three selected modules:

1. User Management
2. Training Catalog Management
3. Enrollment & Sessions

---

## 2. User Management

### US-001 – User Registration

**As a learner,**  
I want to create an account,  
so that I can access the platform and its services.

#### Acceptance Criteria

- The user must provide the required information.
- The email address must be unique.
- The password must be securely stored.
- Invalid information must be rejected.
- A user account must be created after successful registration.

---

### US-002 – User Login

**As a registered user,**  
I want to authenticate using my credentials,  
so that I can securely access my account.

#### Acceptance Criteria

- The user provides an email and password.
- Invalid credentials are rejected.
- Successful authentication generates a JWT.
- The authenticated user can access authorized resources.

---

### US-003 – Manage Profile

**As a learner,**  
I want to manage my profile information,  
so that my personal and professional information remains up to date.

#### Acceptance Criteria

- The learner can view their profile.
- The learner can update their information.
- Invalid information must be rejected.

---

### US-004 – Manage Skills

**As a learner,**  
I want to manage my professional skills,  
so that the platform can understand my competencies and provide relevant training recommendations.

#### Acceptance Criteria

- Skills can be added.
- Skills can be updated.
- Skills can be removed.
- Skills are associated with the learner profile.

---

### US-005 – Manage Users

**As an administrator,**  
I want to manage platform users,  
so that I can control access to the system.

#### Acceptance Criteria

The administrator can:

- View users.
- Create users.
- Update users.
- Delete users.
- Activate users.
- Deactivate users.

---

### US-006 – Manage Roles

**As an administrator,**  
I want to manage user roles,  
so that users have appropriate permissions.

#### Acceptance Criteria

- Users can have an assigned role.
- Roles determine access permissions.
- Unauthorized operations must be rejected.

---

## 3. Training Catalog Management

### US-007 – Create Training

**As an administrator,**  
I want to create a training course,  
so that learners can discover new training opportunities.

#### Acceptance Criteria

- Required training information must be provided.
- Training information must be validated.
- The training must be stored successfully.

---

### US-008 – Update Training

**As an administrator,**  
I want to update training information,  
so that the training catalog remains accurate.

#### Acceptance Criteria

- Existing training can be modified.
- Updated information must be validated.
- Changes must be persisted.

---

### US-009 – Delete Training

**As an administrator,**  
I want to remove a training course,  
so that obsolete training courses are no longer available.

#### Acceptance Criteria

- Only authorized users can delete training.
- The requested training must exist.
- The system must handle invalid deletion requests.

---

### US-010 – Manage Categories

**As an administrator,**  
I want to manage training categories,  
so that training courses can be properly organized.

#### Acceptance Criteria

- Categories can be created.
- Categories can be updated.
- Categories can be deleted.
- Training courses can be associated with categories.

---

### US-011 – Browse Training Catalog

**As a learner,**  
I want to browse available training courses,  
so that I can discover training opportunities.

#### Acceptance Criteria

- Available training courses are displayed.
- Training information is accessible.
- Results support pagination.

---

### US-012 – Search Training

**As a learner,**  
I want to search for training courses,  
so that I can quickly find relevant courses.

#### Acceptance Criteria

- Training can be searched by title.
- Relevant results are returned.
- No-result searches are handled correctly.

---

### US-013 – Filter Training

**As a learner,**  
I want to filter training courses,  
so that I can narrow the catalog according to my needs.

#### Acceptance Criteria

Training can be filtered by:

- Category
- Level
- Duration

---

### US-014 – View Training Details

**As a learner,**  
I want to view detailed information about a training course,  
so that I can decide whether it matches my needs.

#### Acceptance Criteria

The system displays the available information about the selected training course.

---

## 4. Enrollment & Sessions

### US-015 – Create Training Session

**As an administrator,**  
I want to create training sessions,  
so that learners can enroll in scheduled training activities.

#### Acceptance Criteria

- A session is associated with a training course.
- Session information must be validated.
- Session capacity must be defined.
- The session must be stored successfully.

---

### US-016 – Manage Training Sessions

**As an administrator,**  
I want to manage training sessions,  
so that scheduled training activities remain accurate.

#### Acceptance Criteria

The administrator can:

- View sessions.
- Update sessions.
- Delete sessions.
- Manage session status.
- Manage session capacity.

---

### US-017 – Enroll in Training Session

**As a learner,**  
I want to enroll in an available training session,  
so that I can participate in the training.

#### Acceptance Criteria

- The learner must be authenticated.
- The session must exist.
- The session must have available capacity.
- Duplicate enrollment must be prevented.
- Successful enrollment must be recorded.

---

### US-018 – Cancel Enrollment

**As a learner,**  
I want to cancel an enrollment,  
so that I can withdraw from a training session when necessary.

#### Acceptance Criteria

- The enrollment must exist.
- The enrollment must belong to the learner.
- Cancellation must respect applicable business rules.
- The enrollment status must be updated.

---

### US-019 – View Enrollment History

**As a learner,**  
I want to view my enrollment history,  
so that I can track the training sessions I have joined.

#### Acceptance Criteria

- The learner can view previous enrollments.
- The learner can view current enrollments.
- Enrollment status is displayed.

---

## 5. Machine Learning Recommendation

### US-020 – Receive Training Recommendations

**As a learner,**  
I want to receive personalized training recommendations,  
so that I can discover courses that match my profile and competencies.

#### Acceptance Criteria

The recommendation mechanism considers available information such as:

- Learner profile.
- Learner skills.
- Previous enrollments.

The system returns relevant training recommendations available in the training catalog.

---

## 6. User Story Summary

| ID | User Story | Actor | Priority |
|----|------------|-------|----------|
| US-001 | User Registration | Learner | High |
| US-002 | User Login | User | High |
| US-003 | Manage Profile | Learner | High |
| US-004 | Manage Skills | Learner | High |
| US-005 | Manage Users | Administrator | High |
| US-006 | Manage Roles | Administrator | High |
| US-007 | Create Training | Administrator | High |
| US-008 | Update Training | Administrator | High |
| US-009 | Delete Training | Administrator | High |
| US-010 | Manage Categories | Administrator | High |
| US-011 | Browse Training Catalog | Learner | High |
| US-012 | Search Training | Learner | Medium |
| US-013 | Filter Training | Learner | Medium |
| US-014 | View Training Details | Learner | High |
| US-015 | Create Training Session | Administrator | High |
| US-016 | Manage Training Sessions | Administrator | High |
| US-017 | Enroll in Training Session | Learner | High |
| US-018 | Cancel Enrollment | Learner | Medium |
| US-019 | View Enrollment History | Learner | Medium |
| US-020 | Receive Training Recommendations | Learner | High |