# Improv Panic Button - User Flow Documentation

## Overview
This document outlines the user journey through the Improv Panic Button application, detailing how different features connect to provide a seamless experience for Dungeon Masters during live play.

## User Personas & Their Flows

### Primary Personas
1. **Dan the Over-Planner** - Needs respect for his 15-session epic
2. **Riley the Rookie** - Needs one-click game juice
3. **Alex the Streamer** - Needs zero dead air

## Core User Journey (Happy Path)

### 1. Onboard & Upload
**Entry Point**: New user registration/login
- **Authentication**: User signs up/logs in via Clerk.dev
- **File Upload Interface**: Drag-and-drop functionality for:
  - Home-brew Word docs (.docx)
  - Markdown notes (.md)
  - Text files (.txt)
  - PDFs (including D&D Beyond encounter exports)
- **File Processing**: System parses uploaded documents using file-ingestion micro-service
- **Connected Features**:
  - File-type agnostic architecture (F-1)
  - Token budgeting system preparation

### 2. Digest Confirmation
**Transition**: After successful file upload and processing
- **AI Analysis**: System generates concise NPC & plot outline from uploaded materials
- **Review Interface**: DM can edit/approve the generated campaign digest
- **Validation**: User confirms the digest accuracy before proceeding
- **Connected Features**:
  - Embeddings stored in Pinecone for retrieval
  - Lore consistency validation
  - Token budget allocation

### 3. Session Prep
**Transition**: When DM is ready to prepare for a specific session
- **Scene Selection**: DM flags tonight's scenes from the campaign digest
- **Active Context Creation**: Selected scenes become the "Active Context" (≤ 8k tokens by default)
- **Context Options**: 
  - Default context (free/standard)
  - Deep Context toggle (premium feature, F-6)
- **Connected Features**:
  - Token budgeter manages context size
  - Session timer preparation (F-12)

### 4. Live Panic - Detailed Canned Prompt Flows
**Transition**: During active gameplay when DM needs assistance
- **Session Start**: First panic call starts the 5-hour trial timer
- **Panic Interface**: Radial menu with five canned prompts
- **Alternative Input**: Free-text fallback chat for custom requests

#### Detailed Canned Prompt Specifications

##### 1. NPC Generation
**Purpose**: Create story-relevant NPCs that enhance rather than derail the narrative
**Best-Case Scenario**: Players ask "what is your name?" about a random filler patron in a bar/shop
**Interaction Flow**:
- **Canned Prompt Component**: "Generate an NPC for [location/context]"
- **DM Input Required**: Brief context (e.g., "tavern patron", "shopkeeper", "guard")
- **AI Output**: 
  - Name and basic description
  - Brief backstory that fits the setting
  - Connection to future quest or plot element
  - Personality quirks for roleplay
**Product Differentiation**: Not just random generation—creates NPCs that can become meaningful quest-givers or recurring characters, enhancing story depth

##### 2. Filler Encounter
**Purpose**: Buy time while maintaining story relevance and advancing the larger narrative
**Best-Case Scenario**: Players deviate from prepared content (e.g., investigating forest instead of corrupt gang in town)
**Interaction Flow**:
- **Canned Prompt Component**: "Generate a filler encounter that connects to [main threat]"
- **DM Input Required**: Current location, main campaign threat/theme
- **AI Output**:
  - Encounter description tied to main story
  - Tactical setup appropriate for party level
  - Connection to the larger threat players should be dealing with
  - Potential story hooks that can redirect back to prepared content
**Product Differentiation**: Encounters aren't random—they're story-relevant time-buyers that reinforce the main narrative

##### 3. Redirect Plot
**Purpose**: Craft redirection arcs that bring players back to prepared content with added context
**Best-Case Scenario**: Used after a filler encounter during combat time to plan story redirection
**Interaction Flow**:
- **Canned Prompt Component**: "Create a plot redirection from [current situation] to [prepared content]"
- **DM Input Required**: 
  - Current player situation/location
  - Prepared content they should return to
  - Desired tone/approach for redirection
- **AI Output**:
  - Half-session arc outline
  - Key NPCs or events to facilitate transition
  - Added stakes/insight that enhances the original prepared content
  - Potential branching paths based on player choices
**Product Differentiation**: Most intensive option—creates seamless story bridges that make deviations feel like planned narrative enrichment

##### 4. Flavor Detail
**Purpose**: Enhance environmental storytelling and draw attention to important elements
**Best-Case Scenario**: Players aren't noticing key items/locations, or DM needs richer area descriptions
**Interaction Flow**:
- **Canned Prompt Component**: "Describe [location/object] in the style of [campaign aesthetic]"
- **DM Input Required**: 
  - Specific location/object/landmark
  - Campaign aesthetic/tone
  - Importance level (subtle hint vs obvious emphasis)
- **AI Output**:
  - Evocative description that fits campaign tone
  - Subtle or obvious emphasis on important elements
  - Sensory details that enhance immersion
  - Optional: Historical context or local significance
**Product Differentiation**: Context-aware descriptions that maintain campaign consistency while highlighting story-relevant elements

##### 5. Foreshadow Hook
**Purpose**: Introduce story elements that will re-emerge later with greater impact
**Best-Case Scenario**: Early introduction of future Big Bad or important plot element in seemingly minor way
**Interaction Flow**:
- **Canned Prompt Component**: "Create a foreshadowing moment for [future element]"
- **DM Input Required**: 
  - Future story element to foreshadow
  - Current context/situation
  - Desired subtlety level
- **AI Output**:
  - Minor interaction or event that introduces the element
  - Contextual reasons why it seems unimportant now
  - Potential future callbacks or reveals
  - Character motivations that make sense in current context
**Product Differentiation**: Creates layered storytelling where current improvisations enhance future prepared content

### 5. Log & Save
**Transition**: After receiving panic response
- **Session Notes**: Outputs are automatically stamped into session notes
- **Continuity Tracking**: Maintains consistency across future sessions
- **Export Options**: Future roadmap includes Obsidian export (Q2)
- **Connected Features**:
  - Data storage (encrypted at rest)
  - Lore caching to minimize token spend

## Feature Connection Map

### Authentication & Billing Flow
- **Entry Point**: User registration/login
- **Free Trial**: Single 5-hour contiguous block starting at first panic call
- **Subscription**: Monthly recurring via Stripe after trial
- **Premium Features**: Deep Context toggle, enhanced token limits

### File Processing Pipeline
- **Upload** → **Parse** → **Embed** → **Store** → **Retrieve**
- **Supported Formats**: DOCX, MD, TXT, PDF
- **Processing**: Unstructured.io micro-service
- **Storage**: Pinecone embeddings + encrypted data storage

### Session Management
- **Prep Phase**: Context selection and active context creation
- **Live Phase**: Panic button interactions with real-time responses
- **Post-Session**: Automatic logging and continuity maintenance

### Response Generation System
- **Input**: Active context + user prompt
- **Processing**: GPT-4o-mini with 128k context window
- **Output**: Lore-consistent content within SRD licensing limits
- **Feedback Loop**: Responses feed back into session notes for continuity

## Technical User Flow Dependencies

### Frontend Components (Next.js)
- Authentication pages
- File upload interface
- Campaign digest review/edit interface
- Session prep interface
- **Radial command component** (core panic interface with 5 canned prompts)
- **Prompt input overlays** (for each canned prompt type)
- Session notes/logging interface

### Backend API Endpoints
- User authentication (Clerk.dev integration)
- File upload/processing
- Campaign digest CRUD operations
- Session management
- **Panic response generation** (with prompt-specific logic)
- Billing/subscription management (Stripe integration)

### Data Flow
1. **User Content** → **File Ingestion** → **Campaign Digest**
2. **Campaign Digest** → **Session Prep** → **Active Context**
3. **Active Context** + **Canned Prompt** + **DM Input** → **LLM Processing** → **Contextual Response**
4. **Response** → **Session Notes** → **Continuity Database**

## Edge Cases & Alternative Paths

### Trial Expiration
- **Trigger**: 5-hour trial timer expires
- **Action**: Prompt for subscription or end session
- **Fallback**: Session notes remain accessible

### File Upload Failures
- **Trigger**: Unsupported file type or processing error
- **Action**: Error message with supported format guidance
- **Fallback**: Manual text input option

### Response Generation Failures
- **Trigger**: API timeout or LLM unavailability
- **Action**: Fallback to cached similar responses or error handling
- **Fallback**: Free-text chat remains available

### Insufficient Context for Canned Prompts
- **Trigger**: DM provides minimal input for context-dependent prompts
- **Action**: Progressive prompt refinement (ask for more specific details)
- **Fallback**: Generate with available context and note limitations

## Success Metrics Alignment
- **Activation**: Journey designed to achieve ≥3 panic calls per user
- **Conversion**: Free trial structure encourages subscription after 5-hour experience
- **Retention**: Session continuity features support long-term engagement
- **Performance**: Response time targets built into each interaction point
- **Story Integration**: Canned prompts designed to enhance rather than replace DM creativity 