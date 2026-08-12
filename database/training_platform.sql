-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 12 août 2026 à 19:31
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `training_platform`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image_public_id` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `created_at`, `updated_at`, `description`, `image_public_id`, `image_url`, `name`) VALUES
(5, '2026-08-12 15:51:35.000000', '2026-08-12 15:51:35.000000', 'ProgrammingLearn programming fundamentals and develop applications using different programming languages.', 'training-platform/categories/th8hewrganfy2tjp9h4y', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786549894/training-platform/categories/th8hewrganfy2tjp9h4y.png', 'Programming'),
(6, '2026-08-12 15:52:27.000000', '2026-08-12 15:52:27.000000', 'Develop server-side logic, APIs, services, and backend applications.', 'training-platform/categories/nhcgm0oqceuoaol8crcv', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786549946/training-platform/categories/nhcgm0oqceuoaol8crcv.avif', 'Backend'),
(7, '2026-08-12 15:53:18.000000', '2026-08-12 15:53:18.000000', 'Build modern, interactive, and responsive web interfaces.', 'training-platform/categories/mn1vohjmgfxz1xnxma0d', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786549997/training-platform/categories/mn1vohjmgfxz1xnxma0d.webp', 'Frontend'),
(8, '2026-08-12 15:54:32.000000', '2026-08-12 15:54:32.000000', 'Learn how to design, manage, and work with relational and NoSQL databases.', 'training-platform/categories/l8aniempzc2aenxrybdv', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786550072/training-platform/categories/l8aniempzc2aenxrybdv.jpg', 'Database'),
(9, '2026-08-12 15:55:16.000000', '2026-08-12 15:55:16.000000', 'Automate software development, testing, deployment, and application operations.', 'training-platform/categories/rxgzw2jrsucvcuidciu1', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786550115/training-platform/categories/rxgzw2jrsucvcuidciu1.webp', 'DevOps'),
(10, '2026-08-12 15:56:46.000000', '2026-08-12 15:56:46.000000', 'Learn how to develop, deploy, and manage applications on cloud platforms.', 'training-platform/categories/fnylxvhvsg9nlnf0lvbo', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786550206/training-platform/categories/fnylxvhvsg9nlnf0lvbo.jpg', 'Cloud'),
(11, '2026-08-12 15:58:06.000000', '2026-08-12 15:58:06.000000', 'Analyze data and use statistics, Machine Learning, and AI to extract useful insights.', 'training-platform/categories/lrf9tnoahjp6rcqss1c7', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786550285/training-platform/categories/lrf9tnoahjp6rcqss1c7.jpg', 'Data Science'),
(12, '2026-08-12 15:58:53.000000', '2026-08-12 15:58:53.000000', 'Design and develop mobile applications for Android and other platforms.', 'training-platform/categories/m3zg0cyq8ox8altqaq1x', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786550332/training-platform/categories/m3zg0cyq8ox8altqaq1x.webp', 'Mobile'),
(13, '2026-08-12 16:00:30.000000', '2026-08-12 16:00:30.000000', 'Learn how to protect applications, systems, and data from security threats and attacks.', 'training-platform/categories/xjvim2esinug56a0pj82', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786550430/training-platform/categories/xjvim2esinug56a0pj82.jpg', 'Cybersecurity');

-- --------------------------------------------------------

--
-- Structure de la table `chapters`
--

CREATE TABLE `chapters` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `position` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `course_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `courses`
--

CREATE TABLE `courses` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `description` longtext NOT NULL,
  `language` varchar(50) NOT NULL,
  `level` enum('ADVANCED','BEGINNER','INTERMEDIATE') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `short_description` varchar(300) NOT NULL,
  `status` enum('DRAFT','PUBLISHED') NOT NULL,
  `thumbnail_public_id` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(500) NOT NULL,
  `title` varchar(200) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `trainer_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses`
--

INSERT INTO `courses` (`id`, `created_at`, `updated_at`, `description`, `language`, `level`, `price`, `short_description`, `status`, `thumbnail_public_id`, `thumbnail_url`, `title`, `category_id`, `trainer_id`) VALUES
(6, '2026-08-12 16:30:37.000000', '2026-08-12 16:52:43.000000', 'This course introduces the fundamental concepts of Java programming, including variables, data types, control structures, methods, arrays, and basic object-oriented programming. Learners will build simple Java applications and develop a strong programming foundation.', 'java', 'BEGINNER', 45.00, 'Learn the fundamentals of Java programming from scratch.', 'PUBLISHED', 'training-platform/courses/b4ehck4mqr6ba5ethwlo', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786552236/training-platform/courses/b4ehck4mqr6ba5ethwlo.jpg', 'Java Programming Fundamentals', 5, 3),
(7, '2026-08-12 16:32:14.000000', '2026-08-12 16:52:45.000000', 'Learn classes, objects, inheritance, encapsulation, polymorphism, abstraction, interfaces, and advanced object-oriented design principles using Java. This course prepares learners for professional Java development.', 'Java', 'INTERMEDIATE', 55.00, 'Master object-oriented programming concepts using Java.', 'PUBLISHED', 'training-platform/courses/jwrpaqmxtiwmyaa1bo9x', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786552333/training-platform/courses/jwrpaqmxtiwmyaa1bo9x.png', 'Object-Oriented Programming with Java', 5, 3),
(8, '2026-08-12 16:33:59.000000', '2026-08-12 16:52:47.000000', 'Explore advanced Java concepts including generics, collections, streams, lambda expressions, exception handling, multithreading, and advanced application design. The course focuses on writing efficient and maintainable Java applications.', 'Java', 'ADVANCED', 65.00, 'Develop advanced programming skills with Java.', 'PUBLISHED', 'training-platform/courses/yw3kdehfc3rqini7frks', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786552438/training-platform/courses/yw3kdehfc3rqini7frks.jpg', 'Advanced Java Programming', 5, 3),
(9, '2026-08-12 16:36:00.000000', '2026-08-12 16:52:50.000000', 'This course introduces Python syntax, variables, data types, conditions, loops, functions, lists, dictionaries, modules, and file handling. Learners will develop practical Python programs through hands-on exercises.', 'Python', 'BEGINNER', 40.00, 'Learn Python programming from the basics.', 'PUBLISHED', 'training-platform/courses/obujaqas01wbds4lrkw2', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786552559/training-platform/courses/obujaqas01wbds4lrkw2.jpg', 'Python Programming Fundamentals', 5, 3),
(10, '2026-08-12 16:37:50.000000', '2026-08-12 16:52:52.000000', 'Learn how to design Python applications using classes, objects, inheritance, encapsulation, polymorphism, and abstraction. Practical exercises help learners apply object-oriented principles to real programming problems.', 'Python', 'INTERMEDIATE', 50.00, 'Learn object-oriented programming using Python.', 'PUBLISHED', 'training-platform/courses/ogbxohxhdydr2sqjuwev', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786552669/training-platform/courses/ogbxohxhdydr2sqjuwev.jpg', 'Object-Oriented Programming with Python', 5, 3),
(11, '2026-08-12 16:38:58.000000', '2026-08-12 16:52:55.000000', 'Explore advanced Python features including decorators, generators, comprehensions, context managers, asynchronous programming, modules, and advanced data structures. The course focuses on writing efficient and maintainable Python applications.', 'Python', 'ADVANCED', 55.00, 'Master advanced Python programming techniques.', 'PUBLISHED', 'training-platform/courses/mcx0ximkeeaeklzas5f6', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786552737/training-platform/courses/mcx0ximkeeaeklzas5f6.jpg', 'Advanced Python Programming', 5, 3),
(12, '2026-08-12 16:40:08.000000', '2026-08-12 16:52:58.000000', 'earn C++ syntax, variables, operators, conditions, loops, functions, arrays, pointers, and basic object-oriented programming. The course provides a solid foundation for developing C++ applications.', 'C++', 'BEGINNER', 45.00, 'Learn the fundamentals of C++ programming.', 'PUBLISHED', 'training-platform/courses/jhd7wirsyhiv3fcwraaa', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786552808/training-platform/courses/jhd7wirsyhiv3fcwraaa.png', 'C++ Programming Fundamentals', 5, 3),
(13, '2026-08-12 16:42:25.000000', '2026-08-12 16:53:00.000000', 'Learn classes, objects, constructors, inheritance, polymorphism, encapsulation, templates, and other important object-oriented concepts using C++. Practical exercises develop strong C++ programming skills.\r\n', 'C++', 'INTERMEDIATE', 60.00, 'Master object-oriented programming concepts with C++.', 'PUBLISHED', 'training-platform/courses/aeqlfclj4e989j1d2an4', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786552944/training-platform/courses/aeqlfclj4e989j1d2an4.jpg', 'Object-Oriented Programming with C++', 5, 3),
(14, '2026-08-12 16:45:27.000000', '2026-08-12 16:53:02.000000', 'Learn JavaScript variables, data types, functions, arrays, objects, conditions, loops, events, and basic DOM manipulation. This course provides the programming foundation required for modern web development.', 'JavaScript', 'BEGINNER', 40.00, 'Learn the fundamentals of JavaScript programming.', 'PUBLISHED', 'training-platform/courses/zogxsvil2ywb6iofm2fi', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786553127/training-platform/courses/zogxsvil2ywb6iofm2fi.jpg', 'JavaScript Programming Fundamentals', 5, 3),
(15, '2026-08-12 16:47:37.000000', '2026-08-12 16:53:06.000000', 'Explore advanced JavaScript concepts including asynchronous programming, promises, modules, closures, higher-order functions, error handling, and modern ES6+ features. Learners will build more robust and maintainable applications.', 'JavaScript', 'ADVANCED', 70.00, 'Develop advanced JavaScript programming skills.', 'PUBLISHED', 'training-platform/courses/gxs0qx78fcgnezro61cp', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786553256/training-platform/courses/gxs0qx78fcgnezro61cp.jpg', 'Advanced JavaScript Programming', 5, 3),
(16, '2026-08-12 16:49:00.000000', '2026-08-12 16:53:12.000000', 'Study arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and algorithmic complexity. Learners will solve practical programming problems and improve their problem-solving skills.', 'Multiple', 'INTERMEDIATE', 60.00, 'Learn essential data structures and algorithms.', 'PUBLISHED', 'training-platform/courses/zmy9ovihditvvstv5wy6', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786553339/training-platform/courses/zmy9ovihditvvstv5wy6.jpg', 'Data Structures and Algorithms', 5, 3),
(17, '2026-08-12 16:50:52.000000', '2026-08-12 16:53:09.000000', 'Learn how to analyze programming problems, design efficient algorithms, optimize solutions, and evaluate algorithm complexity. The course develops logical thinking and problem-solving abilities applicable to different programming languages.', 'Multiple', 'INTERMEDIATE', 60.00, 'Improve programming skills through algorithmic problem solving.', 'PUBLISHED', 'training-platform/courses/fzmo3wtpyloiiyg0sjot', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786553451/training-platform/courses/fzmo3wtpyloiiyg0sjot.jpg', 'Algorithms and Problem Solving', 5, 3),
(18, '2026-08-12 17:00:54.000000', '2026-08-12 17:01:03.000000', 'This course introduces Spring Boot and backend application development. Learners will work with project structure, dependency injection, configuration, controllers, services, and basic REST APIs. By the end of the course, learners will be able to create a simple Spring Boot backend application.', 'Java', 'BEGINNER', 40.00, 'Learn the fundamentals of backend development with Spring Boot.', 'PUBLISHED', 'training-platform/courses/s5f6vcjn8ioonbdktvol', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786554053/training-platform/courses/s5f6vcjn8ioonbdktvol.jpg', 'Spring Boot Fundamentals', 6, 5),
(19, '2026-08-12 17:03:13.000000', '2026-08-12 17:03:47.000000', 'Explore advanced Spring Boot development including advanced dependency injection, configuration, validation, exception handling, asynchronous processing, and application architecture. The course focuses on building scalable and maintainable backend applications.', 'Java', 'ADVANCED', 70.00, 'Master advanced backend development with Spring Boot.', 'PUBLISHED', 'training-platform/courses/iygx2tfs4y7anjpv2evw', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786554192/training-platform/courses/iygx2tfs4y7anjpv2evw.jpg', 'Advanced Spring Boot Development', 6, 5),
(20, '2026-08-12 17:06:54.000000', '2026-08-12 17:12:03.000000', 'This course introduces authentication and authorization using Spring Security. Learners will implement login security, roles, permissions, password management, and protected REST endpoints in Spring Boot applications.', 'Java', 'INTERMEDIATE', 40.00, 'Learn how to secure Spring Boot applications.', 'PUBLISHED', 'training-platform/courses/esqf0zlq4fbhujzotp4v', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786554413/training-platform/courses/esqf0zlq4fbhujzotp4v.jpg', 'Spring Security Fundamentals', 6, 5),
(21, '2026-08-12 17:11:57.000000', '2026-08-12 17:12:06.000000', 'Learn server-side development with Node.js. The course covers modules, asynchronous programming, HTTP servers, Express.js, middleware, routing, and REST API development. Learners will build a complete Node.js backend application.', 'JavaScript', 'BEGINNER', 50.00, 'Build backend applications using Node.js.', 'PUBLISHED', 'training-platform/courses/haiwtt9omusmjznbwpje', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786554716/training-platform/courses/haiwtt9omusmjznbwpje.png', 'Node.js Backend Development', 6, 5),
(22, '2026-08-12 17:15:45.000000', '2026-08-12 17:18:41.000000', 'Explore important backend architecture principles and software design patterns. The course covers layered architecture, dependency inversion, SOLID principles, repository patterns, service layers, and techniques for building maintainable backend systems.', 'Multiple', 'ADVANCED', 70.00, 'Learn professional backend architecture and design patterns.', 'PUBLISHED', 'training-platform/courses/a71ag3sr387kohot6udq', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786554944/training-platform/courses/a71ag3sr387kohot6udq.jpg', 'Backend Architecture and Design Patterns', 6, 5);

-- --------------------------------------------------------

--
-- Structure de la table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `completed` bit(1) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `enrolled_at` datetime(6) DEFAULT NULL,
  `progress` int(11) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `learner_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `instructor_requests`
--

CREATE TABLE `instructor_requests` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `admin_comment` varchar(1000) DEFAULT NULL,
  `cv_public_id` varchar(255) DEFAULT NULL,
  `cv_url` varchar(500) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `instructor_requests`
--

INSERT INTO `instructor_requests` (`id`, `created_at`, `updated_at`, `admin_comment`, `cv_public_id`, `cv_url`, `status`, `user_id`) VALUES
(1, '2026-08-09 13:21:28.000000', '2026-08-09 13:28:16.000000', NULL, 'training-platform/instructor-requests/cv/lnxqq0sq56haiaq8lbaw', 'https://res.cloudinary.com/dqrtwfpbq/raw/upload/v1786281687/training-platform/instructor-requests/cv/lnxqq0sq56haiaq8lbaw', 'APPROVED', 3);

-- --------------------------------------------------------

--
-- Structure de la table `lessons`
--

CREATE TABLE `lessons` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `preview` bit(1) NOT NULL,
  `title` varchar(200) NOT NULL,
  `video_public_id` varchar(255) DEFAULT NULL,
  `video_url` varchar(500) NOT NULL,
  `chapter_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `completed` bit(1) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `learner_id` bigint(20) NOT NULL,
  `lesson_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `token` varchar(100) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `created_at`, `updated_at`, `expires_at`, `token`, `used`, `user_id`) VALUES
(1, '2026-08-07 19:50:45.000000', '2026-08-07 19:51:37.000000', '2026-08-07 20:50:45.000000', '07064da7-7035-45dd-bf95-a494af4790ef', b'1', 3),
(2, '2026-08-07 19:51:24.000000', '2026-08-07 19:51:24.000000', '2026-08-07 20:51:24.000000', 'fd4985fd-e2e7-47a2-b1ae-9d92c4025d61', b'0', 3);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `avatar_public_id` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(500) NOT NULL,
  `email` varchar(150) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `provider` enum('GOOGLE','LOCAL') NOT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','LEARNER','TRAINER') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `avatar_public_id`, `avatar_url`, `email`, `enabled`, `first_name`, `last_name`, `password`, `phone`, `provider`, `provider_id`, `role`) VALUES
(1, '2026-08-07 19:41:49.000000', '2026-08-09 14:09:16.000000', NULL, 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1785902252/avatar_jbenlj.png', 'admin@trainingplatform.com', b'1', 'System', 'Administrator', '$2a$10$uRhNSx.GP1z6ilFc6lxuwODq77e5BZ9YJIx7uI.y06CoaTlHXQofy', '29553824', 'LOCAL', NULL, 'ADMIN'),
(3, '2026-08-07 19:47:57.000000', '2026-08-11 21:52:53.000000', 'training-platform/users/avatars/jvxqt0s9bdll7o8bnok4', 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1786485162/training-platform/users/avatars/jvxqt0s9bdll7o8bnok4.png', 'dridikhalil852@gmail.com', b'1', 'Khalil', 'Dridi', '$2a$10$IuTWssLaID7SMQbtQ7IjAOVi4zPLQWGtz808noMnYGmlziNkFDBtm', '29553824', 'GOOGLE', '116242461552569521006', 'TRAINER'),
(4, '2026-08-10 12:00:49.000000', '2026-08-10 12:00:49.000000', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIMqx_yDhQy291VTFXn2OEmTsQ4dyxxMhvUEtNmZFEXldJ-1g=s96-c', 'nabihakhmais3@gmail.com', b'1', 'Nabiha', 'Khmais', NULL, NULL, 'GOOGLE', '107105900599234088212', 'LEARNER'),
(5, '2026-08-12 16:57:21.000000', '2026-08-12 16:57:21.000000', NULL, 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1785902252/avatar_jbenlj.png', 'TrainerA@gmail.com', b'1', 'Trainer', 'Trainer', '$2a$10$rj9uhxPDo.1Sdd96pzUY4eWZf07m7Yre/NachPhu94hLDU54sVH12', '', 'LOCAL', NULL, 'TRAINER'),
(6, '2026-08-12 17:20:46.000000', '2026-08-12 17:20:46.000000', NULL, 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1785902252/avatar_jbenlj.png', 'khalildridi@gmail.com', b'1', 'Khalil', 'Dridi', '$2a$10$8gyaoy/ygmBJguwQqQXVDOx1cggqpkF0NcZu27y52UlWKNreeoApi', '+21629553824', 'LOCAL', NULL, 'LEARNER'),
(7, '2026-08-12 17:28:08.000000', '2026-08-12 17:28:30.000000', NULL, 'https://res.cloudinary.com/dqrtwfpbq/image/upload/v1785902252/avatar_jbenlj.png', 'khalildridi859@gmail.com', b'1', 'Khalil', 'Dridi', '$2a$10$82QYOGdnh9kJVnr1/oifuuq3/SdHr6NreXWFg49OQ/qUjCjGoJKcK', '+21629553824', 'LOCAL', NULL, 'LEARNER');

-- --------------------------------------------------------

--
-- Structure de la table `verification_tokens`
--

CREATE TABLE `verification_tokens` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `token` varchar(100) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `verification_tokens`
--

INSERT INTO `verification_tokens` (`id`, `created_at`, `updated_at`, `expires_at`, `token`, `used`, `user_id`) VALUES
(1, '2026-08-07 19:47:57.000000', '2026-08-07 19:50:09.000000', '2026-08-08 19:47:57.000000', '045f9b8e-a13f-4426-8e5b-ead53b58d528', b'1', 3),
(2, '2026-08-12 16:57:21.000000', '2026-08-12 16:57:21.000000', '2026-08-13 16:57:21.000000', '2caad2d5-b844-4fbf-b819-c9212dad03cf', b'0', 5),
(3, '2026-08-12 17:20:46.000000', '2026-08-12 17:20:46.000000', '2026-08-13 17:20:46.000000', '4e885d22-1261-47b5-9e7c-5cdb6b46b334', b'0', 6),
(4, '2026-08-12 17:28:08.000000', '2026-08-12 17:28:30.000000', '2026-08-13 17:28:08.000000', 'efafb5fa-6b7a-4450-aa44-313ddfb6d45c', b'1', 7);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`);

--
-- Index pour la table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chapter_course` (`course_id`);

--
-- Index pour la table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK72l5dj585nq7i6xxv1vj51lyn` (`category_id`),
  ADD KEY `FKcmvsq5ti7ts1othsm8pn1rp2y` (`trainer_id`);

--
-- Index pour la table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_enrollment_learner_course` (`learner_id`,`course_id`),
  ADD KEY `fk_enrollment_course` (`course_id`);

--
-- Index pour la table `instructor_requests`
--
ALTER TABLE `instructor_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_request_user` (`user_id`),
  ADD KEY `idx_request_status` (`status`);

--
-- Index pour la table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_lesson_chapter` (`chapter_id`);

--
-- Index pour la table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_lesson_progress_learner_lesson` (`learner_id`,`lesson_id`),
  ADD KEY `idx_lesson_progress_learner` (`learner_id`),
  ADD KEY `idx_lesson_progress_lesson` (`lesson_id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK71lqwbwtklmljk3qlsugr1mig` (`token`),
  ADD KEY `FKk3ndxg5xp6v7wd4gjyusp15gq` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- Index pour la table `verification_tokens`
--
ALTER TABLE `verification_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6q9nsb665s9f8qajm3j07kd1e` (`token`),
  ADD KEY `FK54y8mqsnq1rtyf581sfmrbp4f` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `instructor_requests`
--
ALTER TABLE `instructor_requests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `verification_tokens`
--
ALTER TABLE `verification_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `fk_chapter_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Contraintes pour la table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `FK72l5dj585nq7i6xxv1vj51lyn` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `FKcmvsq5ti7ts1othsm8pn1rp2y` FOREIGN KEY (`trainer_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_enrollment_learner` FOREIGN KEY (`learner_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `instructor_requests`
--
ALTER TABLE `instructor_requests`
  ADD CONSTRAINT `fk_request_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `fk_lesson_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`);

--
-- Contraintes pour la table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `fk_lesson_progress_learner` FOREIGN KEY (`learner_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_lesson_progress_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

--
-- Contraintes pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `FKk3ndxg5xp6v7wd4gjyusp15gq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `verification_tokens`
--
ALTER TABLE `verification_tokens`
  ADD CONSTRAINT `FK54y8mqsnq1rtyf581sfmrbp4f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
