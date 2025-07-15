# AI Playground Database Schema Documentation

## Overview

The AI Playground database schema is designed to track user interactions, creations, and analytics for the enhanced AI Learning Playground. The schema follows best practices for performance, security, and scalability.

## Tables

### 1. `ai_playground_sessions`
Tracks user sessions within the AI playground.

**Key Features:**
- Automatic duration calculation using generated columns
- Activity type tracking (prompt_building, ai_simulation, etc.)
- Device and browser information capture
- Performance metrics (avg response time, error count)

**Indexes:**
- `user_id` - For user-specific queries
- `session_start` - For time-based analytics
- `activity_type` - For filtering by activity
- `duration_seconds` - For performance analysis

**RLS Policies:**
- Users can only view, insert, and update their own sessions

### 2. `ai_playground_interactions`
Records individual user interactions with AI tools.

**Key Features:**
- Detailed interaction tracking with types and tools
- Performance metrics (response time, tokens used)
- User feedback and rating system
- Interaction sequencing within sessions
- Error tracking and success scoring

**Indexes:**
- Composite indexes for common query patterns
- Tool-specific filtering
- Time-based queries optimized

**RLS Policies:**
- Users can only access their own interaction data

### 3. `ai_playground_creations`
Stores user-generated content from the playground.

**Key Features:**
- Version control with parent-child relationships
- Quality scoring and complexity levels
- Engagement metrics (views, uses, forks)
- Flexible sharing options (private, public, shared)
- Template system for reusable creations
- Tag-based categorization

**Indexes:**
- GIN index for tag searches
- Quality score ranking
- Template and published content filtering

**RLS Policies:**
- Complex visibility rules based on sharing settings
- Users can fully manage their own creations

### 4. `ai_playground_achievements`
Gamification system for user engagement.

**Key Features:**
- 20+ achievement types covering all aspects of usage
- Progress tracking with percentage calculations
- Badge levels (bronze to diamond)
- Point system for rewards
- Social features (sharing, congratulations)

**Indexes:**
- User achievement lookups
- Progress tracking for incomplete achievements
- Category-based filtering

**RLS Policies:**
- Users see own achievements and shared public achievements

### 5. `ai_playground_toolkit_items`
Configuration for available AI tools and features.

**Key Features:**
- Tool categorization and capabilities
- Usage statistics and ratings
- Beta and premium feature flags
- Learning resources and documentation
- Version control and changelog

**Indexes:**
- Active tool filtering
- Category and tag searches
- Rating-based sorting

**RLS Policies:**
- Public read access for active tools
- Admin-only management

### 6. `synthetic_nonprofit_profiles`
Practice scenarios with synthetic nonprofit data.

**Key Features:**
- 15 nonprofit organization types
- Realistic challenges and scenarios
- Difficulty levels for progression
- Usage tracking and ratings
- Learning objective alignment

**Indexes:**
- Type, size, and tech maturity filtering
- Difficulty-based selection
- Featured profile highlighting

**RLS Policies:**
- Public read for active profiles
- Admin management capabilities

## Analytics Views

### 1. `ai_playground_user_engagement`
Comprehensive user engagement metrics including:
- Session counts and duration
- Interaction and creation totals
- Achievement progress
- Tool usage patterns

### 2. `ai_playground_tool_analytics`
Tool-specific usage analytics:
- Unique user counts
- Success rates and error tracking
- Performance metrics
- User ratings

### 3. `ai_playground_creation_analytics`
Content creation insights:
- Creation types and quality
- Engagement metrics
- Publishing and template stats
- Popular tags

### 4. `ai_playground_daily_metrics`
Daily activity tracking:
- Active users
- Session and interaction counts
- New content creation
- Achievement unlocks

### 5. `ai_playground_user_funnel`
User journey analytics:
- Signup to first session
- First prompt submission
- Content creation milestones
- Retention metrics

### 6. `ai_playground_performance_metrics`
System performance monitoring:
- Response time percentiles
- Error rates
- Token usage
- Slow request tracking

## Helper Functions

### 1. `get_user_recent_activity(user_id, days)`
Returns detailed activity summary for a user over specified days.

### 2. `calculate_user_skill_level(user_id)`
Calculates skill progression across different categories based on usage.

### 3. `get_recommended_tools(user_id, limit)`
Provides personalized tool recommendations based on user profile.

### 4. `track_tool_usage(...)`
Records tool usage and updates all related statistics atomically.

### 5. `check_and_award_achievements(user_id)`
Automatically checks and awards achievements based on user activity.

## Performance Optimizations

1. **Composite Indexes**: Created for common query patterns
2. **Partial Indexes**: Optimize filtered queries (e.g., active sessions, public content)
3. **Generated Columns**: Automatic calculations (duration, progress percentage)
4. **Materialized Views**: Consider for heavy analytics queries
5. **Table Partitioning**: Ready for future partitioning by date if needed

## Security Features

1. **Row Level Security (RLS)**: Enabled on all tables
2. **User Isolation**: Users can only access their own data
3. **Sharing Controls**: Granular visibility settings for creations
4. **Admin Policies**: Separate policies for administrative access
5. **Function Security**: SECURITY DEFINER for controlled access

## Migration Order

Run migrations in this order:
1. `20250705_ai_playground_sessions.sql`
2. `20250705_ai_playground_interactions.sql`
3. `20250705_ai_playground_creations.sql`
4. `20250705_ai_playground_achievements.sql`
5. `20250705_ai_playground_toolkit_items.sql`
6. `20250705_synthetic_nonprofit_profiles.sql`
7. `20250705_ai_playground_analytics_views.sql`
8. `20250705_ai_playground_indexes_and_functions.sql`

## Usage Examples

### Track a new tool interaction:
```sql
SELECT track_tool_usage(
    'session-uuid'::uuid,
    'user-uuid'::uuid,
    'prompt_builder',
    'prompt_submit',
    250, -- response time in ms
    true, -- success
    '{"prompt_length": 150}'::jsonb
);
```

### Get user's recent activity:
```sql
SELECT * FROM get_user_recent_activity('user-uuid'::uuid, 30);
```

### Check user's skill progression:
```sql
SELECT * FROM calculate_user_skill_level('user-uuid'::uuid);
```

### View daily metrics:
```sql
SELECT * FROM ai_playground_daily_metrics 
WHERE activity_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY activity_date DESC;
```

## Future Considerations

1. **Partitioning**: Consider partitioning large tables by date
2. **Archival**: Implement data archival for old sessions/interactions
3. **Caching**: Add Redis caching for frequently accessed data
4. **Real-time**: Consider streaming for live analytics
5. **ML Integration**: Add columns for ML model predictions and insights