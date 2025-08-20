# Phase 2: Core MVP (Minimal Viable Product)

**Duration**: 4-6 weeks  
**Goal**: Complete user journey from upload to panic button usage  
**Success Criteria**: Users can upload files, create campaigns, start sessions, and use all 5 panic prompts  

## Phase Overview

Phase 2 transforms the foundation established in Phase 1 into a fully functional MVP that delivers the core value proposition of the Improv Panic Button. This phase implements the complete user journey from file upload through campaign creation to live panic button usage during D&D sessions. Users will be able to experience the full product flow and begin converting from trial to paid subscriptions.

**Key Deliverables**:
- Complete file processing pipeline with embedding generation
- Campaign management system with digest creation
- Session management with 5-hour trial timer
- Radial panic interface with all 5 prompt types
- Payment integration with subscription management

## Feature Breakdown

### 1. File Processing Pipeline

**Purpose**: Transform uploaded files into searchable campaign content with AI embeddings

**Steps**:
1. **Implement multi-format file parsing**
   - Create DOCX parser using mammoth.js for Word documents
   - Implement PDF text extraction using pdf-parse
   - Add Markdown parser for .md files
   - Create plain text processor for .txt files
   - Add error handling for corrupted files

2. **Set up embedding generation and vector storage**
   - Configure OpenAI embeddings API integration
   - Implement text chunking strategy (1000 tokens max per chunk)
   - Set up Pinecone vector database connection
   - Create embedding batch processing system
   - Add embedding similarity search functionality

3. **Create campaign digest generation**
   - Build AI-powered content summarization
   - Extract key NPCs, locations, and plot points
   - Create campaign world overview
   - Generate character relationship maps
   - Add campaign tone and style analysis

4. **Implement content chunking and indexing**
   - Create intelligent text chunking based on content type
   - Add metadata tagging for different content types
   - Implement semantic search across campaign content
   - Create content deduplication system
   - Add content versioning for updates

5. **Add file processing status tracking**
   - Create processing queue with job status
   - Implement progress indicators for long operations
   - Add error reporting for processing failures
   - Create retry mechanism for failed processing
   - Add processing completion notifications

**Success Criteria**:
- All supported file types process correctly
- Embeddings are generated and stored in Pinecone
- Campaign digests provide accurate content summaries
- Content is searchable and retrievable
- Processing status is clearly communicated to users

**Dependencies**: Phase 1 File Upload Infrastructure, Phase 1 AI Integration
**Estimated Time**: 8-10 days

---

### 2. Campaign Management System

**Purpose**: Provide comprehensive campaign creation, editing, and management interface

**Steps**:
1. **Create campaign creation and editing interface**
   - Build campaign creation wizard with step-by-step guidance
   - Design campaign metadata form (title, description, system, etc.)
   - Add file association and management interface
   - Create campaign preview and overview pages
   - Implement campaign settings and configuration

2. **Implement campaign digest review/approval**
   - Create AI-generated digest review interface
   - Add ability to edit and refine digest content
   - Implement approval workflow for digest finalization
   - Create digest regeneration options
   - Add manual content addition and editing

3. **Add campaign metadata management**
   - Create campaign tagging and categorization system
   - Add campaign sharing and collaboration features
   - Implement campaign templates and presets
   - Create campaign statistics and analytics
   - Add campaign export and import functionality

4. **Create campaign backup and version control**
   - Implement automatic campaign backups
   - Create version history tracking
   - Add campaign restoration from backups
   - Implement change tracking and audit logs
   - Create campaign duplication and cloning

5. **Build campaign content organization**
   - Create hierarchical content organization
   - Add content tagging and filtering
   - Implement content search within campaigns
   - Create content relationship mapping
   - Add content priority and importance levels

**Success Criteria**:
- Campaigns can be created and edited without errors
- Digest review process is intuitive and functional
- Campaign metadata is properly managed and searchable
- Content organization supports easy navigation
- Backup and version control protect user data

**Dependencies**: Phase 1 Database Foundation, Feature 1 File Processing Pipeline
**Estimated Time**: 7-9 days

---

### 3. Session Management

**Purpose**: Manage active gaming sessions with timer, state tracking, and history

**Steps**:
1. **Build session creation and configuration**
   - Create session setup wizard with campaign selection
   - Add session configuration options (duration, context size, etc.)
   - Implement session template system
   - Create session planning and preparation interface
   - Add session participant management

2. **Implement 5-hour trial timer**
   - Create session timer with countdown display
   - Add trial time tracking and enforcement
   - Implement session pause/resume functionality
   - Create timer warning notifications
   - Add automatic session ending on trial expiration

3. **Create active session state management**
   - Implement real-time session state with Server-Sent Events
   - Add session context management (active scenes, NPCs, etc.)
   - Create session notes and logging system
   - Implement session data persistence
   - Add session sharing and collaboration features

4. **Add session history and logging**
   - Create comprehensive session history tracking
   - Implement panic call logging and history
   - Add session replay and review functionality
   - Create session analytics and insights
   - Add session export and reporting

5. **Implement session continuation and recovery**
   - Add session save and restore functionality
   - Create session recovery from unexpected disconnections
   - Implement session data synchronization
   - Add session archiving and cleanup
   - Create session data migration tools

**Success Criteria**:
- Sessions can be created and configured easily
- Trial timer accurately tracks usage and enforces limits
- Session state is maintained across page reloads
- Session history provides complete audit trail
- Session recovery works reliably

**Dependencies**: Phase 1 Authentication, Feature 2 Campaign Management
**Estimated Time**: 6-8 days

---

### 4. Radial Panic Interface

**Purpose**: Implement the core panic button with radial menu and all 5 prompt types

**Steps**:
1. **Create radial menu component with 5 segments**
   - Build animated radial menu with CSS transforms
   - Implement touch and mouse interaction handling
   - Add keyboard navigation support
   - Create responsive design for different screen sizes
   - Add visual feedback for hover and selection states

2. **Implement all 5 canned prompt types**
   - **NPC Generation**: Create context-aware NPC generator with personality, backstory, and quest connections
   - **Filler Encounter**: Build encounter generator linked to main campaign threats
   - **Redirect Plot**: Implement plot redirection system with half-session arc planning
   - **Flavor Detail**: Create environmental description generator with campaign consistency
   - **Foreshadow Hook**: Build foreshadowing system for future plot elements

3. **Add contextual input collection for each prompt**
   - Create dynamic form system for prompt-specific inputs
   - Implement progressive disclosure for complex prompts
   - Add context suggestion and auto-completion
   - Create input validation and sanitization
   - Add input history and reuse functionality

4. **Create response display and formatting**
   - Build response display with formatting and styling
   - Add response actions (copy, edit, regenerate, save)
   - Implement response quality feedback system
   - Create response sharing and export options
   - Add response formatting for different output types

5. **Implement response history and logging**
   - Create comprehensive response history tracking
   - Add response categorization and tagging
   - Implement response search and filtering
   - Create response analytics and usage patterns
   - Add response export and reporting

**Success Criteria**:
- Radial menu is intuitive and responsive
- All 5 prompt types generate high-quality, relevant content
- Context collection provides necessary information
- Response display is clear and actionable
- Response history enables continuity across sessions

**Dependencies**: Phase 1 AI Integration, Feature 3 Session Management
**Estimated Time**: 10-12 days

---

### 5. Payment Integration

**Purpose**: Implement subscription management and trial-to-paid conversion

**Steps**:
1. **Set up Paddle payment processing**
   - Configure Paddle account and API credentials
   - Set up product catalog and pricing tiers
   - Implement payment form and checkout flow
   - Add payment method management
   - Create subscription plan selection interface

2. **Create subscription management**
   - Build subscription status tracking and display
   - Implement subscription upgrade/downgrade flow
   - Add subscription renewal and cancellation
   - Create subscription history and invoice access
   - Add subscription pause and reactivation

3. **Implement trial-to-paid conversion flow**
   - Create conversion prompts and incentives
   - Add trial expiration handling and notifications
   - Implement seamless upgrade process
   - Create conversion tracking and analytics
   - Add conversion optimization features

4. **Add billing history and invoice management**
   - Create billing dashboard with transaction history
   - Implement invoice generation and download
   - Add payment failure handling and retry
   - Create billing notification system
   - Add tax handling and compliance

5. **Create payment webhook handling**
   - Implement webhook verification and processing
   - Add subscription status synchronization
   - Create payment event logging and monitoring
   - Add webhook retry and error handling
   - Implement webhook security and validation

**Success Criteria**:
- Payment processing works reliably across all flows
- Subscription management is intuitive and comprehensive
- Trial-to-paid conversion is seamless and effective
- Billing information is accurate and accessible
- Webhook handling ensures data consistency

**Dependencies**: Phase 1 Authentication, Feature 3 Session Management
**Estimated Time**: 6-8 days

## Phase 2 Integration Tasks

### End-to-End User Journey Testing
- Test complete flow from registration to panic button usage
- Verify file upload through campaign creation to session start
- Test all 5 panic prompt types with real campaign data
- Validate payment flow from trial to subscription

### Performance Optimization
- Optimize file processing pipeline for large files
- Implement response caching for frequently used prompts
- Add database query optimization for complex operations
- Create CDN optimization for static assets

### Security Hardening
- Implement comprehensive input validation
- Add rate limiting for AI API calls
- Create secure payment handling
- Add audit logging for sensitive operations

## Phase 2 Deliverables

1. **File Processing System**
   - Multi-format file parsing and processing
   - Embedding generation and vector storage
   - Campaign digest creation and management
   - Content chunking and indexing

2. **Campaign Management**
   - Complete campaign creation and editing interface
   - Campaign digest review and approval workflow
   - Campaign metadata and organization system
   - Campaign backup and version control

3. **Session Management**
   - Session creation and configuration system
   - 5-hour trial timer with enforcement
   - Active session state management
   - Session history and logging

4. **Radial Panic Interface**
   - Animated radial menu with 5 segments
   - All 5 canned prompt types implemented
   - Contextual input collection system
   - Response display and history management

5. **Payment Integration**
   - Paddle payment processing integration
   - Subscription management system
   - Trial-to-paid conversion flow
   - Billing history and invoice management

## Testing Strategy

### Unit Testing
- Test individual prompt generation functions
- Mock external API calls for consistent testing
- Validate file processing for each supported format
- Test payment processing with sandbox environment

### Integration Testing
- Test complete user journey from registration to panic button
- Verify file processing pipeline with real documents
- Test session management with concurrent users
- Validate payment flow with various scenarios

### User Acceptance Testing
- Conduct DM testing sessions with real campaigns
- Test panic button usage during actual D&D sessions
- Validate response quality and relevance
- Test payment conversion flow with real users

## Risk Mitigation

### Technical Risks
- **AI Response Quality**: Implement response quality scoring and fallback options
- **File Processing Failures**: Add robust error handling and retry mechanisms
- **Payment Processing Issues**: Implement comprehensive error handling and user feedback
- **Session State Management**: Add redundancy and recovery mechanisms

### Business Risks
- **Conversion Rate**: Implement A/B testing for conversion optimization
- **User Onboarding**: Create guided tutorials and help documentation
- **Response Time**: Implement caching and optimization strategies
- **Cost Management**: Monitor token usage and implement cost controls

## Success Metrics

- File processing success rate > 95%
- Average panic button response time < 3 seconds
- Trial-to-paid conversion rate > 25%
- User session completion rate > 80%
- AI response quality score > 4.0/5.0

## Next Phase Preparation

- Gather user feedback for enhancement priorities
- Identify performance bottlenecks for optimization
- Plan advanced features based on user requests
- Prepare production infrastructure for scaling

This phase delivers a complete, functional MVP that provides the core value proposition of the Improv Panic Button, enabling DMs to enhance their sessions with AI-powered improvisation assistance. 