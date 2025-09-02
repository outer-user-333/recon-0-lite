
-- =================================================================
-- Finalized Database Schema for the Recon-0 Platform
-- Version: 1.0
-- Description: This script contains the complete schema for all
-- features, including MVP and future enhancements.
-- =================================================================

-- Enable the UUID extension if it's not already enabled.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =================================================================
-- Section 1: Core User and Organization Entities
-- =================================================================

-- Table to store public profile information for all users.
-- This extends Supabase's built-in `auth.users` table.
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL CHECK (char_length(username) >= 3),
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT NOT NULL CHECK (role IN ('hacker', 'organization')),
    reputation_points INT DEFAULT 0,
    skills TEXT[],
    preferences JSONB, -- For user-specific settings like notifications
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for organizations.
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- For clean URLs, e.g., /initech
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    industry TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table to link users (profiles) to organizations.
-- This allows multiple users to be part of one organization.
CREATE TABLE organization_members (
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    member_role TEXT NOT NULL CHECK (member_role IN ('admin', 'member', 'biller')),
    PRIMARY KEY (organization_id, user_id)
);


-- =================================================================
-- Section 2: Bounty Program & Reporting Entities
-- =================================================================

-- Table for bug bounty programs created by organizations.
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL, -- For clean URLs, e.g., /initech/web-app-pentest
    title TEXT NOT NULL,
    description TEXT,
    policy TEXT NOT NULL,
    scope TEXT NOT NULL, -- In-scope assets description
    out_of_scope TEXT, -- Out-of-scope assets description
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
    min_bounty INT,
    max_bounty INT,
    tags TEXT[],
    total_paid_out NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table defining the rewards for different severity levels per program.
CREATE TABLE bounty_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    amount INT NOT NULL,
    UNIQUE (program_id, severity)
);

-- Table for vulnerability reports submitted by hackers.
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Keep report if hacker deletes account
    title TEXT NOT NULL,
    vulnerability_type TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'triaging', 'accepted', 'resolved', 'duplicate', 'invalid')),
    description TEXT NOT NULL,
    steps_to_reproduce TEXT NOT NULL,
    impact TEXT NOT NULL,
    proof_of_concept TEXT,
    suggested_fix TEXT,
    attachments JSONB, -- Array of objects with {url, filename, type}
    reward_amount NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Table for comments on a vulnerability report.
CREATE TABLE report_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for all activities on a report.
CREATE TABLE report_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., 'status_changed', 'comment_added', 'reward_assigned'
    details JSONB, -- e.g., { "from": "new", "to": "triaging" }
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =================================================================
-- Section 3: Gamification and Community Entities
-- =================================================================

-- Table to log every reputation change for a user.
CREATE TABLE reputation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    points INT NOT NULL,
    reason TEXT NOT NULL,
    reference_id UUID, -- e.g., ID of the report or achievement
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table defining all possible achievements/badges.
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    criteria JSONB NOT NULL -- e.g., { "type": "report_count", "value": 10 }
);

-- Junction table to track which users have earned which achievements.
CREATE TABLE user_achievements (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);

-- Table for messages in the Safe Harbor global chat.
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
);


-- =================================================================
-- Section 4: Platform Content and Utility Entities
-- =================================================================

-- Table for the dynamic Learning Academy content.
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- For articles
    video_url TEXT, -- For videos
    resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video')),
    category TEXT NOT NULL,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for user notifications.
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT, -- Link to the relevant page (e.g., a report)
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for AI-powered features (future enhancement).
-- Stores vector embeddings for similarity searches on reports.
CREATE TABLE report_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID UNIQUE NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    embedding vector(768), -- Dimension depends on the model used
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =================================================================
-- Section 5: Indexes for Performance Optimization
-- =================================================================

-- Indexes on the `reports` table for common queries.
CREATE INDEX idx_reports_program_id ON reports(program_id);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Index on `report_comments` for faster comment loading.
CREATE INDEX idx_report_comments_report_id ON report_comments(report_id);

-- Index on `notifications` for efficiently fetching a user's unread notifications.
CREATE INDEX idx_notifications_user_id_is_read ON notifications(user_id, is_read);

-- Indexes for Full-Text Search (Future Enhancement).
CREATE INDEX idx_programs_search ON programs USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_reports_search ON reports USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_learning_resources_search ON learning_resources USING gin(to_tsvector('english', title || ' ' || description || ' ' || category));

