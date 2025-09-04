# Recon0: Next-Generation Bug Bounty Platform

## Comprehensive Platform Documentation

## Executive Summary

**Recon0** is a next-generation bug bounty platform that revolutionizes how organizations connect with ethical hackers to identify and resolve security vulnerabilities. Unlike traditional platforms, Recon0 focuses on community building, education, and creating a protective ecosystem for beginners while maintaining security and workflow management.

### Key Differentiators

**{{L1}}** **Safe Harbor Community**: Space for ethical hackers to Chat

**{{L1}}** **Integrated Learning Academy**: Built-in educational resources

**{{L1}}** **Gamification Engine**: Comprehensive reputation system with achievements and leaderboards

### Target Users

1. **Organizations**: Companies seeking to identify vulnerabilities through crowdsourced security testing
2. **Ethical Hackers**: Security researchers ranging from beginners to experts

**{{L4}}** 3. **Platform Administrators**: Internal team managing the platform operations

---

## Mission

- **Standardize vulnerability disclosure** processes with templates
- **Foster responsible disclosure** through community guidelines and safe communication channels

---

---

## User Roles & Access Control

### Role Hierarchy

```
PLATFORM_ADMIN (Highest Privilege)
    ├── PLATFORM_MODERATOR
    ├── ORGANIZATION_ADMIN
    │
    └── ETHICAL_HACKER
        ├── EXPERT_HACKER (500+ reputation)
        ├── INTERMEDIATE_HACKER (100-499 reputation)
        └── BEGINNER_HACKER (0-99 reputation)
```

### Detailed Role Definitions

#### 1. ETHICAL_HACKER

**Purpose**: Security researchers who find and report vulnerabilities

**{{L1}}**
**Permissions**:

- View public bounty programs
- Submit vulnerability reports
- Participate in Safe Harbor chat
- Access learning resources
- View own submissions and rewards
- Update profile and preferences

#### 2. ORGANIZATION_ADMIN

**Purpose**: Manages bounty programs for their organization

**{{L1}}**
**Permissions**:

- Create and manage bounty programs
- Set bounty amounts and rules
- Review and triage reports
- Communicate with hackers
- Access analytics dashboard
- Process payouts

#### 5. PLATFORM_ADMIN

**Purpose**: Full platform management and operations

**{{L4}}**
**Permissions**:

- All moderator permissions
- User management (all roles)
- Platform configuration
- Access all analytics
- Financial operations
- System maintenance
- Feature flags management
- Moderate Safe Harbor chat
- Suspend/ban users for violations

---

## Core Features & Modules

### Module 1: Authentication & User Management

#### Features

1. **Multi-factor Authentication**

   - Email/Password with email verification

2. **Profile Management**

   - Public hacker profiles with achievements

3. **Onboarding Flow**
   - Role selection (Hacker/Organization)

### Module 2: Bounty Program Management

#### For Organizations

**{{ This is standardized template for organization to create thier bounty program, our bountry creation form  layout should be design according to belowe fields }}**

1. **Program Creation Wizard**

   ```
   Step 1: Basic Information
   - Program Name
   - Description
   - Logo/Banner
   - Program Type (Public/Private)

   Step 2: Scope Definition
   - In-scope assets (domains, apps, APIs)
   - Out-of-scope items
   - Testing restrictions
   - Accepted vulnerability types

   Step 3: Rewards Structure
   - Severity-based rewards (Critical/High/Medium/Low)
   - Bonus programs
   - Response SLAs
   - Payment methods

   Step 4: Legal & Compliance
   - Terms of Service
   - Safe Harbor provisions
   - Disclosure policy
   - NDA requirements (if any)

   Step 5: Review & Publish
   - Preview program listing
   - Set launch date
   - Invite specific hackers (optional)
   ```

**{{ L4 }}** 2. **Program Analytics Dashboard**

- Submission trends
- Severity distribution
- Response time metrics
- Top contributors
- Cost analysis
- Risk heat map

#### For Hackers

1. **Program Discovery**

   **{{L1}}**- Advanced filtering system

   **{{L3}}** - AI-powered recommendations

   **{{L2}}** - New program notifications

### Module 3: Vulnerability Submission & Management

#### Submission Process

**{{ This is standardized template for hackers to write thier report, our report creation form should have belowe files  }}**

1. **Report Creation**

   ```yaml
   Required Fields:
     - Title: Clear, descriptive title
     - Asset: Affected component/URL
     - Vulnerability Type: From standardized list
     - Severity: CVSS calculator integration
     - Description: Detailed explanation
     - Steps to Reproduce: Numbered list
     - Impact: Business impact analysis
     - Proof of Concept: Code/screenshots
   ```

### Module 4: Safe Harbor Chat System

#### Architecture

#### Features

1. **Global Chat Room**

   **{{L1}}** - Real-time messaging

   **{{L3}}** - User presence indicators

   **{{L1}}** - File/image sharing (with scanning)

### Module 5: Learning Academy

#### Content Structure

**{{ This is kind a syllabus , we took these topics and you find videos on youtube and generate text data like notes , we are hardcoding this learning section, like notes / articles / video links , no need to use API , Database , we keep it simple hardcoded data with simple decent UI }}**

1. **Learning Paths**

   ```
   Beginner Path:
   ├── Web Security Fundamentals
   │   ├── HTTP Basics
   │   ├── Common Vulnerabilities
   │   └── Basic Tools
   ├── Recon Techniques
   │   ├── Subdomain Enumeration
   │   ├── Port Scanning
   │   └── Information Gathering
   └── First Bug Hunting
       ├── examples / demo reports
       ├── common mistakes

   Advanced Paths:
   ├── API Security
   ├── Mobile Application Testing
   ├── Cloud Security
   └── IoT/Hardware Hacking
   ```

2. **Resource Types**
   - Video tutorials (embedded YouTube/Vimeo)
   - Written guides / aricles / blogs like

### Module 6: Gamification & Reputation

#### Reputation System

**{{ L3 }}**

1. **Point Allocation**

   ```
   Actions                          Points
   ─────────────────────────────────────────
   Valid submission                 +10
   Critical severity accepted       +50
   High severity accepted          +30
   Medium severity accepted        +15
   Low severity accepted           +5
   First to find (bonus)          +25
   Quality report (bonus)         +10
   Helpful academy contribution   +5
   Invalid submission             -5
   Spam/Abuse                     -20
   ```

2. **Leaderboards**
   **{{ L1 }}** - Global rankings

**{{ L3 }}** 4. **Levels & Tiers**

```
Level 1: Scout (0-49 RP)
Level 2: Hunter (50-99 RP)
Level 3: Tracker (100-249 RP)
Level 4: Specialist (250-499 RP)
Level 5: Expert (500-999 RP)
Level 6: Master (1000-2499 RP)
Level 7: Grandmaster (2500-4999 RP)
Level 8: Legend (5000+ RP)
```

---

**{{ we will build these Ai features at very last , i have some idea about how to implment , that time i will tell then we will make plan to build Ai features seperately, so no need to make now  }}**

## AI Powered features

**{{ L5 }}** 1. Interactive Q&A Bot

**{{ L4 }}** 2. Report Quality Enhancement

**{{ L4 }}** 3. Auto-Improve Report Suggestions

**{{ L4 }}** 4. Executive Summary Generator

---

**{{ From here our DB schema is starting , in this i will use my 'L1', 'L2', 'L3' commands for priority and One new command ,'Not sure' belowe this fields are those with i am not sure to keep or not , so you decide accordig to our project , feature , input / output  }}**

## Database Schema Design

### Core Tables

```sql
-- **{{L1}}**
-- Users table (managed by Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    role VARCHAR(50) NOT NULL,
    reputation_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    last_active TIMESTAMP,

    -- **{{NOT SURE}}**
    preferences JSONB DEFAULT '{}',
    skills TEXT[],
);


-- **{{L1}}**
-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,

    description TEXT,
    website VARCHAR(500),
    logo_url VARCHAR(500),
    industry VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- **{{NOT SURE}}**
     slug VARCHAR(100) UNIQUE NOT NULL,
     size VARCHAR(50),
    settings JSONB DEFAULT '{}'
);

    -- **{{L1}}**
-- Bounty programs
CREATE TABLE bounty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, V
    description TEXT,
    policy_text TEXT NOT NULL,
    scope_text TEXT NOT NULL,
    out_of_scope_text TEXT,
    visibility VARCHAR(50) DEFAULT 'public', -- 'public', 'private', 'invite_only'
    difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    status VARCHAR(50) DEFAULT 'active', -- 'draft', 'active', 'paused', 'closed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags TEXT[],
    min_bounty DECIMAL(10, 2),
    max_bounty DECIMAL(10, 2),
    response_sla_hours INTEGER DEFAULT 48,
    resolution_sla_days INTEGER DEFAULT 30

    -- **{{NOT SURE}}**
    slug VARCHAR(100) UNIQUE NOT NULL,
    total_paid_out DECIMAL(10, 2) DEFAULT 0,
);


-- **{{NOT SURE}}**
-- Program assets (in-scope targets)
CREATE TABLE program_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES bounty_programs(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- 'domain', 'mobile_app', 'api', 'source_code', 'hardware'
    identifier VARCHAR(500) NOT NULL, -- domain name, app id, etc.
    description TEXT,
    importance VARCHAR(50) DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
    max_severity VARCHAR(50), -- maximum accepted severity for this asset
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **{{NOT SURE}}**
-- Bounty rewards structure
CREATE TABLE bounty_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES bounty_programs(id) ON DELETE CASCADE,
    severity VARCHAR(50) NOT NULL, -- 'critical', 'high', 'medium', 'low'
    min_amount DECIMAL(10, 2) NOT NULL,
    max_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    UNIQUE(program_id, severity)
);


-- **{{L1}}**
-- Vulnerability reports
CREATE TABLE vulnerability_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES bounty_programs(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES profiles(id),
    title VARCHAR(500) NOT NULL,
    vulnerability_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'triaging', 'need_more_info', 'accepted', 'duplicate', 'invalid', 'resolved'
    description TEXT NOT NULL,
    proof_of_concept TEXT,
    suggested_fix TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT FALSE,
    reward_amount DECIMAL(10, 2),
    reward_status VARCHAR(50), -- 'pending', 'approved', 'paid', 'disputed'


    -- **{{NOT SURE}}**
    cvss_score DECIMAL(3, 1),
    cvss_vector VARCHAR(100),
    steps_to_reproduce TEXT NOT NULL,
    impact TEXT NOT NULL,
    triaged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    attachments JSONB DEFAULT '[]'
);


-- **{{L1}}**
-- Report comments (for communication)
CREATE TABLE report_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES vulnerability_reports(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- **{{NOT SURE}}**
    attachment_urls TEXT[]
);


-- **{{NOT SURE}}**
-- Report activity log
CREATE TABLE report_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES vulnerability_reports(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL, -- 'status_changed', 'severity_changed', 'comment_added', etc.
    old_value TEXT,
    new_value TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- **{{L3}}**
-- Learning resources
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL, -- 'video', 'article', 'lab', 'tool'
    url VARCHAR(500),
    content TEXT, -- for hosted content
    category VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(50) NOT NULL,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   

    -- **{{NOT SURE}}**
    estimated_time_minutes INTEGER,
    author_id UUID REFERENCES profiles(id),
);


-- **{{L2}}**
-- Achievements/Badges
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    category VARCHAR(50),
    points INTEGER DEFAULT 0,
    criteria JSONB NOT NULL, -- JSON defining the criteria for earning
    is_active BOOLEAN DEFAULT TRUE
);


-- **{{L2}}**
-- User achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);


-- **{{L1}}**
-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    room VARCHAR(100) DEFAULT 'global',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


    -- **{{ These delete message and edit message we can implement later also }}**
        -- **{{L2}}**
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by UUID REFERENCES profiles(id),
    deleted_at TIMESTAMP,


        -- **{{L3}}**
    edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,

);


    -- **{{L3}}**
-- User reputation history
CREATE TABLE reputation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    reference_type VARCHAR(50), -- 'report', 'achievement', 'penalty', etc.
    reference_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- **{{L5}}**
-- **{{ This is for admin dashboard  }}**
-- Platform statistics (for analytics)
CREATE TABLE platform_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    total_users INTEGER DEFAULT 0,
    new_reports INTEGER DEFAULT 0,
    resolved_reports INTEGER DEFAULT 0,
    total_bounties_paid DECIMAL(12, 2) DEFAULT 0,
    new_programs INTEGER DEFAULT 0,
    chat_messages_sent INTEGER DEFAULT 0,
    learning_resources_viewed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- **{{L1}}**
-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'report_update', 'new_comment', 'payout', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- **{{ NOT SURE }}**
-- Indexes for performance
CREATE INDEX idx_reports_program_status ON vulnerability_reports(program_id, status);
CREATE INDEX idx_reports_reporter ON vulnerability_reports(reporter_id);
CREATE INDEX idx_reports_created ON vulnerability_reports(created_at DESC);
CREATE INDEX idx_comments_report ON report_comments(report_id);
CREATE INDEX idx_payouts_recipient ON payouts(recipient_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;


-- **{{ NOT SURE }}**
-- Full-text search indexes
CREATE INDEX idx_reports_search ON vulnerability_reports USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_programs_search ON bounty_programs USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX idx_resources_search ON learning_resources USING gin(to_tsvector('english', title || ' ' || description));

-- **{{ NOT SURE }}**
CREATE TABLE report_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES vulnerability_reports(id) ON DELETE CASCADE,
    embedding vector(768), -- Assuming 768-dimensional embeddings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- **{{ NOT SURE }}**
CREATE INDEX idx_report_embeddings ON report_embeddings USING ivfflat (embedding vector_cosine_ops);
```

---
---

**{{ IMP : from here our API Design documentation is starting, see this document is not that much trimmed is it made for production level version of our project design by Rishabh ,  but as you know we decrase its features , complexity  , even we total change complex nextjs frontend to our simple react bootstarp frontend , but i want you to use below API endpoint for the feature are still making , beacuse below API Design Doc standardized API endpoint and cover all features , also that is very well designed so ,why not take its benefit , also this share common ground for backend developer also (sujal), you can skip API endoint of those features are not building , choose propely according to consider , our features list, Database schema , input , output , also i try to trim some on my own }}**

**{{ also here i indicate priority with my instuctions 'L1', 'L2', ..., 'NOT SURE'  }}**

## API Design & Documentation

### RESTful API Structure

#### Base URL

```
Development: http://localhost:8081/api/v1
```


#### Authentication
All API requests require JWT authentication except public endpoints:


**{{L5 : This JWT authentication feature we will implement at th end, so in below API body you find related to JWt field then ignore , we will do it later , also if you find un-related to feature or different or extar skip featured fields then remove them / skip , i did not trime every APi's body fields so you choose according to our input / output / database schema  }}**




### Core API Endpoints

#### Authentication Endpoints

```yaml
# **{{ L1 }}**
POST /auth/register
  Description: Register new user
  Body:
    email: string
    password: string
    username: string
    role: 'hacker' | 'organization'
  Response:
    user: User object
    token: JWT token

# **{{ L1 }}**
POST /auth/login
  Description: User login
  Body:
    email: string
    password: string
  Response:
    user: User object
    token: JWT token
    refreshToken: string

# **{{ NOT SURE }}**
POST /auth/refresh
  Description: Refresh access token
  Body:
    refreshToken: string
  Response:
    token: JWT token


# **{{ L1 }}**
POST /auth/logout
  Description: Logout user
  Headers: Authorization required
  Response: 204 No Content


# **{{ L1 }}**
POST /auth/verify-email
  Description: Verify email address
  Body:
    token: string
  Response:
    message: string
`
```

#### User/Profile Endpoints

```yaml

# **{{ L1 }}**
GET /users/me
  Description: Get current user profile
  Headers: Authorization required
  Response: User object


# **{{ L1 }}**
PATCH /users/me
  Description: Update current user profile
  Headers: Authorization required
  Body: Partial User object
  Response: Updated User object


# **{{ L1 }}**
GET /users/:id
  Description: Get user public profile
  Response: Public User object


# **{{ L1 }}**
GET /users/:id/achievements
  Description: Get user achievements
  Response: Array of Achievement objects


# **{{ L1 }}**
GET /users/:id/reports
  Description: Get user's public reports
  Query params:
    page: number
    limit: number
    status: string
  Response: Paginated Report array
```

#### Bounty Program Endpoints

```yaml

# **{{ L1 }}**
GET /programs
  Description: List all public programs
  Query params:
    page: number
    limit: number
    difficulty: string
    minBounty: number
    maxBounty: number
    tags: string[]
    sort: string
  Response: Paginated Program array


# **{{ L1 }}**
GET /programs/:id
  Description: Get program details
  Response: Program object with assets and rewards


# **{{ L1 }}**
POST /programs
  Description: Create new program (Organization only)
  Headers: Authorization required
  Body: Program creation object
  Response: Created Program object


# **{{ NOT SURE or L4 }}**
PATCH /programs/:id
  Description: Update program (Organization only)
  Headers: Authorization required
  Body: Partial Program object
  Response: Updated Program object


# **{{ L1 }}**
DELETE /programs/:id
  Description: Delete program (Organization only)
  Headers: Authorization required
  Response: 204 No Content


# **{{ L1 }}**
GET /programs/:id/reports
  Description: Get program reports (Organization only)
  Headers: Authorization required
  Query params:
    page: number
    limit: number
    status: string
    severity: string
  Response: Paginated Report array

# **{{ NOT SURE }}**
GET /programs/:id/stats
  Description: Get program statistics
  Headers: Authorization required
  Response: Statistics object
```

#### Report Submission Endpoints

```yaml

# **{{ L1 }}**
POST /reports
  Description: Submit vulnerability report
  Headers: Authorization required
  Body:
    programId: UUID
    title: string
    vulnerabilityType: string
    severity: string
    description: string
    stepsToReproduce: string
    impact: string
    proofOfConcept: string (optional)
    suggestedFix: string (optional)
  Response: Created Report object


# **{{ L1 }}**
GET /reports/:id
  Description: Get report details
  Headers: Authorization required
  Response: Report object


# **{{ L1 }}**
PATCH /reports/:id
  Description: Update report (Reporter or Organization)
  Headers: Authorization required
  Body: Partial Report object
  Response: Updated Report object


# **{{ L4 }}**
POST /reports/:id/comments
  Description: Add comment to report
  Headers: Authorization required
  Body:
    content: string
    isInternal: boolean (Organization only)
  Response: Created Comment object


# **{{ L4 }}**
GET /reports/:id/comments
  Description: Get report comments
  Headers: Authorization required
  Response: Array of Comment objects


# **{{ L1 }}**
POST /reports/:id/status
  Description: Change report status (Organization only)
  Headers: Authorization required
  Body:
    status: string
    reason: string (optional)
  Response: Updated Report object
```

#### Chat Endpoints

```yaml

# **{{ L3 }}**
WebSocket /ws/chat
  Description: Real-time chat connection
  Headers: Authorization required

  Client -> Server Messages:
    {
      type: 'message',
      content: string,

      # **{{ NOT SURE }}**
      replyTo?: UUID        # **{{ We want to build simple Global chat room }}**
    }


  Server -> Client Messages:
    {
      type: 'message',
      id: UUID,
      sender: User,
      content: string,
      timestamp: ISO8601,

            # **{{ NOT SURE }}**
      replyTo?: Message
    }

    {
      type: 'userJoined' | 'userLeft',
      user: User
    }

# **{{ L3 }}**
GET /chat/history
  Description: Get chat history
  Headers: Authorization required
  Query params:
    before: ISO8601 timestamp
    limit: number (max 100)
  Response: Array of Message objects
```

#### Learning Resources Endpoints
**{{ No Need of API's These section will be hardcoded into frontend }}**



**{{ L5 }}**
**{{ These API's are for Admin section / Dashboard }}**
#### Analytics Endpoints

```yaml
GET /analytics/platform
  Description: Platform-wide statistics (Admin only)
  Headers: Authorization required
  Response: Platform statistics object

GET /analytics/user/:id
  Description: User statistics
  Headers: Authorization required
  Response: User statistics object

GET /analytics/program/:id
  Description: Program statistics (Organization only)
  Headers: Authorization required
  Query params:
    startDate: ISO8601
    endDate: ISO8601
  Response: Program statistics object
```

**{{ NOT SURE }}**
#### Pagination Response

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

---

## Security & Compliance

### Security Measures

#### 2. Authentication & Authorization

**{{ L4 : this is later at the end we implement JWT  }}**
- **JWT Security**: Short-lived access tokens (15 min), refresh tokens (7 days)

**{{ L1 }}**
- **Password Policy**: Minimum 12 characters, complexity requirements
- **Role-Based Access**: permissions per endpoint


---
**{{ If you want to take reference and help then you can use it, i try to give some my priority instrcutions , for others consider according to you  }}**
## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Goal**: Core infrastructure and basic functionality

#### Week 1-2: Setup & Authentication

**{{L1}}**
- [ ] Project initialization 
- [ ] Database schema implementation
- [ ] Supabase integration

**{{L5}}**
- [ ] JWT authentication system

**{{L1}}**
- [ ] Basic user registration/login
- [ ] Email verification flow

#### Week 3-4: User Management

**{{L1}}**
- [ ] Profile creation and management
- [ ] Role-based access control
- [ ] Organization setup flow
- [ ] Basic dashboard layouts
- [ ] File upload system (avatars, logos)

### Phase 2: Core Features (Weeks 5-8)

**Goal**: Minimum viable product for bug bounty platform

#### Week 5-6: Bounty Programs

**{{L1}}**
- [ ] Program creation wizard
- [ ] Program listing and search
- [ ] Scope and policy management

**{{L3}}**
- [ ] Reward structure setup

**{{L1}}**
- [ ] Program discovery page

#### Week 7-8: Report Submission

**{{L1}}**
- [ ] Report submission form
- [ ] File attachment handling
- [ ] Basic triage workflow

**{{L3}}**
- [ ] Comment system

**{{L1}}**
- [ ] Status management

### Phase 3: Advanced Features (Weeks 9-12)

**Goal**: Differentiation features and AI integration

#### Week 9-10: Gamification & Reputation
**{{L2}}**
- [ ] Reputation point system
- [ ] Leaderboards
- [ ] Achievement system

**{{NOT SURE}}**
- [ ] User badges
- [ ] Profile showcases

#### Week 11-12: AI Features
**{{L6}}**
- [ ] Basic chatbot integration

### Phase 4: Community Features (Weeks 13-16)

**Goal**: Build community and learning ecosystem

#### Week 13-14: Safe Harbor Chat
**{{L3}}**
- [ ] WebSocket implementation
- [ ] Real-time messaging


#### Week 15-16: Learning Academy

**{{L1}}**
- [ ] Content categorization & Creating UI & &Hardcoding data into UI 


### Phase 5: Polish & Launch (Weeks 17-20)

**Goal**: Production-ready platform

---

