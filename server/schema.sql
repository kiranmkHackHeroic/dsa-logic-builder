-- =============================================================
-- DSA Logic Builder — MySQL Schema
-- Run: mysql -u root -p < server/schema.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS dsa_logic_builder
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dsa_logic_builder;

-- -------------------------------------------
-- Users (replaces Supabase auth.users)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL PRIMARY KEY,  -- UUID stored as string
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(255) DEFAULT NULL,
  avatar_url    TEXT         DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_sign_in_at DATETIME   DEFAULT NULL
);

-- -------------------------------------------
-- Problem Progress
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS problem_progress (
  id                   CHAR(36)     NOT NULL PRIMARY KEY,
  user_id              CHAR(36)     NOT NULL,
  problem_id           VARCHAR(255) NOT NULL,
  current_step         INT          NOT NULL DEFAULT 1,
  completed_steps      JSON         DEFAULT NULL,   -- replaces INTEGER[]
  status               ENUM('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  understanding_text   TEXT         DEFAULT NULL,
  thinking_text        TEXT         DEFAULT NULL,
  brute_force_text     TEXT         DEFAULT NULL,
  optimization_text    TEXT         DEFAULT NULL,
  final_approach_text  TEXT         DEFAULT NULL,
  code_solution        TEXT         DEFAULT NULL,
  logic_score          INT          DEFAULT NULL,
  time_spent_thinking  INT          DEFAULT 0,
  time_spent_coding    INT          DEFAULT 0,
  started_at           DATETIME     DEFAULT NULL,
  completed_at         DATETIME     DEFAULT NULL,
  created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_user_problem (user_id, problem_id),
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------
-- User Streaks
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS user_streaks (
  id                       CHAR(36)  NOT NULL PRIMARY KEY,
  user_id                  CHAR(36)  NOT NULL UNIQUE,
  current_streak           INT       NOT NULL DEFAULT 0,
  longest_streak           INT       NOT NULL DEFAULT 0,
  last_activity_date       DATE      DEFAULT NULL,
  total_problems_solved    INT       NOT NULL DEFAULT 0,
  total_problems_attempted INT       NOT NULL DEFAULT 0,
  created_at               DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_streak_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------
-- Pattern Mastery
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS pattern_mastery (
  id                    CHAR(36)     NOT NULL PRIMARY KEY,
  user_id               CHAR(36)     NOT NULL,
  pattern_id            VARCHAR(255) NOT NULL,
  mastery_percentage    INT          NOT NULL DEFAULT 0,
  problems_completed    INT          NOT NULL DEFAULT 0,
  correct_first_attempts INT         NOT NULL DEFAULT 0,
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_user_pattern (user_id, pattern_id),
  CONSTRAINT fk_mastery_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------
-- User Roles
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
  id         CHAR(36)                          NOT NULL PRIMARY KEY,
  user_id    CHAR(36)                          NOT NULL,
  role       ENUM('admin','moderator','user')  NOT NULL,
  created_at DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_user_role (user_id, role),
  CONSTRAINT fk_role_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------
-- Trigger: auto-create streak row on user insert
-- -------------------------------------------
DELIMITER $$

CREATE TRIGGER trg_after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO user_streaks (id, user_id)
  VALUES (UUID(), NEW.id);
END$$

DELIMITER ;
