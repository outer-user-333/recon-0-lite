-- =================================================================
-- Final Database Schema for the Recon-0 Platform
-- Version: 2.0 (Reflects the feature-complete application state)
-- Description: This script contains the complete, updated schema
-- based on the features that were actually built. This is the
-- definitive blueprint for the final production database.
-- =================================================================

-- Enable the UUID extension if it's not already enabled.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- Section 1: Core Tables (Primarily managed by Supabase)
-- =================================================================

-- Stores public profile information for all users.
-- This is the central table for user data and is heavily used.
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('hacker', 'organization')),
    bio TEXT,
    reputation_points INT DEFAULT 0,
    -- NOTE: avatar_url is planned for future file uploads
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Stores all public user data, extending the private auth.users table. This is the source of truth for user roles and reputation.';


-- Stores real-time messages for the "Safe Harbor" chat feature.
-- This table is directly connected to Supabase Realtime.
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Keep message if user is deleted
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.chat_messages IS 'Stores all messages for the serverless real-time chat. Directly integrated with Supabase Realtime.';


-- =================================================================
-- Section 2: Mocked Data Tables (Blueprint for Final Backend)
--
-- These tables represent the data structures currently being
-- served by the mock API. The final Java backend should implement
-- these tables.
-- =================================================================

-- Stores information about organizations.
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    -- NOTE: In the real backend, an org would be linked to a profile
    -- owner_id UUID NOT NULL REFERENCES profiles(id),
    website_url TEXT,
    logo_url TEXT
);
COMMENT ON TABLE public.organizations IS 'Represents an organization that can create bug bounty programs.';


-- Defines a bug bounty program.
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    policy TEXT,
    scope TEXT,
    out_of_scope TEXT,
    min_bounty INT,
    max_bounty INT,
    tags TEXT[] -- An array of strings, e.g., {'web', 'api', 'critical'}
);
COMMENT ON TABLE public.programs IS 'Defines a bug bounty program created by an organization.';


-- Stores vulnerability reports submitted by hackers.
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Triaging', 'Accepted', 'Resolved', 'Duplicate', 'Invalid')),
    description TEXT,
    steps_to_reproduce TEXT,
    impact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.reports IS 'Stores all vulnerability reports submitted by hackers.';

-- Stores links to attachments for a specific report.
CREATE TABLE report_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT, -- The original name of the file
    file_type TEXT, -- e.g., 'image/png', 'video/mp4'
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.report_attachments IS 'Stores URLs to files (e.g., screenshots, videos) attached to a vulnerability report.';

-- Stores formal messages/replies sent from an organization to a hacker regarding a report.
CREATE TABLE report_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- The org user who sent it
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.report_messages IS 'Stores formal replies from organizations to hackers about a specific report.';

-- Stores links to attachments for a specific report message.
CREATE TABLE message_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES report_messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.message_attachments IS 'Stores URLs to files attached to a report message.';


-- Defines all possible achievements in the gamification system.
CREATE TABLE achievements (
    id TEXT PRIMARY KEY, -- Using TEXT to match mock data (e.g., 'ach-1')
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL -- Stores the Font Awesome icon class, e.g., 'fa-flag'
);
COMMENT ON TABLE public.achievements IS 'Defines all possible achievements a hacker can earn.';


-- A junction table to track which users have earned which achievements.
CREATE TABLE user_achievements (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);
COMMENT ON TABLE public.user_achievements IS 'Tracks which achievements have been unlocked by each user.';


-- Stores notifications for users.
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.notifications IS 'Stores notifications for platform events.';


-- =================================================================
-- Section 3: Essential Functions & Security Policies
-- =================================================================

-- This trigger function automatically creates a public profile
-- for every new user who signs up via Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role',
    -- Generate a unique username from the email if not provided
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4))
  );
  RETURN new;
END;
$$;

-- Attaches the function to the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Row Level Security (RLS) policies for the real-time chat table.
-- ** IMPORTANT: RLS MUST be enabled on the chat_messages table for these to work. **

-- 1. Allow authenticated users to read all messages.
CREATE POLICY "Allow authenticated read access"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (true);

-- 2. Allow users to insert messages only as themselves.
CREATE POLICY "Allow users to insert their own messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);


