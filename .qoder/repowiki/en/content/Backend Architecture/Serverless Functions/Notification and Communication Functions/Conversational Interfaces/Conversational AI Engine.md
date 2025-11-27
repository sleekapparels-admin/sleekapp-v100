# Conversational AI Engine

<cite>
**Referenced Files in This Document**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts)
- [AIAssistantChat.tsx](file://src/components/AIAssistantChat.tsx)
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx)
- [useConversation.ts](file://src/hooks/useConversation.ts)
- [SmartReplyButtons.tsx](file://src/components/SmartReplyButtons.tsx)
- [AIQuoteGenerator.tsx](file://src/components/AIQuoteGenerator.tsx)
- [NaturalLanguageQuoteInput.tsx](file://src/components/quote/NaturalLanguageQuoteInput.tsx)
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql)
- [create_lead_capture_system.sql](file://supabase/migrations/20251123052149_create_lead_capture_system.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [State Machine-Driven Conversation Flow](#state-machine-driven-conversation-flow)
4. [AI Integration with Lovable AI's GPT-5-mini](#ai-integration-with-lovable-ais-gpt-5-mini)
5. [Data Persistence and Context Management](#data-persistence-and-context-management)
6. [Rate Limiting Implementation](#rate-limiting-implementation)
7. [Quick Reply Generation System](#quick-reply-generation-system)
8. [Error Handling and Fallback Mechanisms](#error-handling-and-fallback-mechanisms)
9. [Lead Scoring Algorithm](#lead-scoring-algorithm)
10. [Integration Patterns](#integration-patterns)
11. [Performance Considerations](#performance-considerations)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [Conclusion](#conclusion)

## Introduction

The Conversational AI Engine is a sophisticated state machine-driven system that powers Sleek Apparels' AI chat interface. Built on Supabase Functions and React components, it guides users through a conversational journey from initial greeting to quote generation, leveraging Lovable AI's GPT-5-mini model for natural language processing and context preservation through advanced database schemas.

The system implements a five-stage conversation flow: GREETING → NAME_COLLECTION → PRODUCT_IDENTIFICATION → QUANTITY_COLLECTION → CUSTOMIZATION_COLLECTION → EMAIL_COLLECTION → FINAL_CHOICES. Each stage is carefully designed to collect essential data points while maintaining conversational continuity and providing context-aware responses.

## System Architecture

The Conversational AI Engine follows a serverless architecture with clear separation of concerns between frontend presentation, backend processing, and data persistence layers.

```mermaid
graph TB
subgraph "Frontend Layer"
UI[SmartAIAssistant Component]
Chat[AIAssistantChat Component]
Hooks[useConversation Hook]
Buttons[SmartReplyButtons Component]
end
subgraph "Backend Layer"
Func[conversational-assistant Function]
RateLimit[Rate Limiting Logic]
Validation[Input Validation]
Context[Context Management]
end
subgraph "Data Layer"
DB[(Supabase Database)]
ConvCtx[conversation_context]
ConvMsg[conversation_messages]
RateLim[conversation_rate_limits]
Industry[industry_knowledge]
Quotes[ai_quotes]
Leads[quote_requests]
end
subgraph "AI Services"
Lovable[Lovable AI GPT-5-mini]
Gemini[Gemini 2.5 Flash]
end
UI --> Hooks
Hooks --> Func
Func --> RateLimit
Func --> Validation
Func --> Context
Func --> Lovable
Lovable --> Gemini
Func --> DB
DB --> ConvCtx
DB --> ConvMsg
DB --> RateLim
DB --> Industry
DB --> Quotes
DB --> Leads
Chat --> UI
Buttons --> UI
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L22-L388)
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx#L35-L466)
- [useConversation.ts](file://src/hooks/useConversation.ts#L32-L177)

**Section sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L1-L50)
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx#L1-L50)

## State Machine-Driven Conversation Flow

The conversation flow is governed by a strict state machine that ensures logical progression through six distinct stages, each with specific data collection goals and response patterns.

```mermaid
stateDiagram-v2
[*] --> GREETING
GREETING --> NAME_COLLECTED : User provides name
NAME_COLLECTED --> INTENT_UNDERSTOOD : User describes intent
INTENT_UNDERSTOOD --> PRODUCT_IDENTIFIED : User specifies product type
PRODUCT_IDENTIFIED --> QUANTITY_COLLECTED : User provides quantity
QUANTITY_COLLECTED --> CUSTOMIZATION_COLLECTED : User selects customization
CUSTOMIZATION_COLLECTED --> EMAIL_COLLECTED : User provides email
EMAIL_COLLECTED --> FINAL_CHOICES : Offer quote/talk options
FINAL_CHOICES --> GENERATE_QUOTE : User chooses quote generation
FINAL_CHOICES --> TALK_TO_TEAM : User requests human assistance
FINAL_CHOICES --> MORE_QUESTIONS : User seeks additional information
GENERATE_QUOTE --> [*]
TALK_TO_TEAM --> [*]
MORE_QUESTIONS --> [*]
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L156-L228)
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L391-L405)

### Stage Definitions and Data Collection

Each conversation stage focuses on collecting specific data points while maintaining conversational flow:

| Stage | Primary Goal | Data Collected | Response Pattern |
|-------|-------------|----------------|------------------|
| GREETING | Establish rapport | User's name | Warm, welcoming response |
| NAME_COLLECTED | Understand intent | User's intent description | Clarifying questions |
| INTENT_UNDERSTOOD | Identify product type | Product category preference | Specific product suggestions |
| PRODUCT_IDENTIFIED | Determine quantity | Order quantity range | Realistic quantity ranges |
| QUANTITY_COLLECTED | Define customization | Customization level | Customization options |
| CUSTOMIZATION_COLLECTED | Obtain contact info | Email address | Natural email collection |
| EMAIL_COLLECTED | Final decision point | Final choices | Option selection |

**Section sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L156-L228)
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L391-L405)

## AI Integration with Lovable AI's GPT-5-mini

The system integrates with Lovable AI's GPT-5-mini model through a carefully crafted system prompt that enforces strict adherence to the state machine flow.

### System Prompt Architecture

The system prompt combines multiple contextual elements to guide the AI response:

```mermaid
flowchart TD
SysPrompt[System Prompt Template] --> Context[Conversation Context]
SysPrompt --> State[Current State Definition]
SysPrompt --> Rules[Response Rules]
SysPrompt --> Examples[Example Responses]
SysPrompt --> Knowledge[Industry Knowledge]
SysPrompt --> Validation[Validation Rules]
Context --> UserData[Extracted User Data]
Context --> LeadScore[Lead Score Calculation]
Context --> OrderHistory[Order History]
State --> CurrentStage[Current Conversation Stage]
State --> NextQuestion[Next Question Guidance]
Rules --> WordLimit[Word Limits]
Rules --> Tone[Tone Guidelines]
Rules --> Format[Response Format]
Examples --> GoodExamples[Correct Response Examples]
Examples --> BadExamples[Incorrect Response Examples]
Knowledge --> IndustryData[Industry Information]
Knowledge --> ProductData[Product Specifications]
Validation --> StateValidation[State Matching]
Validation --> ContentValidation[Content Validation]
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L154-L252)

### AI Response Validation

The system implements robust validation to ensure AI responses align with the expected state machine flow:

```mermaid
sequenceDiagram
participant AI as GPT-5-mini
participant Validator as Response Validator
participant Fallback as Fallback System
participant User as User Interface
AI->>Validator : Generate response
Validator->>Validator : Check state compliance
alt Response matches expected state
Validator->>User : Deliver validated response
else Response deviates from state
Validator->>Fallback : Trigger fallback mechanism
Fallback->>User : Provide corrective response
end
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L483-L504)
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L506-L518)

**Section sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L254-L278)
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L483-L518)

## Data Persistence and Context Management

The system maintains conversation context through a sophisticated database schema that preserves user interactions, extracted data, and conversation state across sessions.

### Database Schema Architecture

```mermaid
erDiagram
conversation_context {
uuid id PK
text session_id
text intent
text stage
jsonb extracted_data
integer lead_score
timestamp created_at
timestamp updated_at
}
conversation_messages {
uuid id PK
uuid conversation_id FK
text role
text content
jsonb metadata
timestamp created_at
}
conversation_rate_limits {
uuid id PK
text identifier
integer request_count
timestamp window_start
timestamp created_at
timestamp updated_at
}
industry_knowledge {
uuid id PK
text category
text subcategory
text title
text content
jsonb metadata
integer version
timestamp created_at
timestamp updated_at
}
ai_quotes {
uuid id PK
text customer_email
text product_type
integer quantity
text status
numeric total_price
timestamp created_at
}
quote_requests {
uuid id PK
text email
text name
text product_type
integer quantity
text customization_details
text status
integer lead_score
timestamp created_at
}
conversation_context ||--o{ conversation_messages : contains
```

**Diagram sources**
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql#L260-L297)
- [create_lead_capture_system.sql](file://supabase/migrations/20251123052149_create_lead_capture_system.sql#L5-L50)

### Context Preservation Mechanism

The system implements dual-layer context preservation:

1. **Real-time Context**: Maintained in Supabase tables during active conversations
2. **Local Storage Backup**: Preserved in browser localStorage for offline capability

```mermaid
sequenceDiagram
participant User as User
participant Frontend as Frontend Component
participant Supabase as Supabase Database
participant LocalStorage as Browser Storage
User->>Frontend : Send message
Frontend->>Supabase : Store message
Supabase->>Supabase : Update conversation context
Frontend->>LocalStorage : Backup conversation state
Note over Frontend,LocalStorage : Session persistence
User->>Frontend : Refresh page
Frontend->>LocalStorage : Restore conversation
Frontend->>Supabase : Sync with server
Supabase->>Frontend : Return conversation state
```

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L40-L62)
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx#L47-L67)

**Section sources**
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql#L260-L297)
- [useConversation.ts](file://src/hooks/useConversation.ts#L40-L62)

## Rate Limiting Implementation

The system implements a sophisticated rate limiting mechanism to prevent abuse while allowing legitimate users to engage in multiple conversations.

### Rate Limiting Algorithm

```mermaid
flowchart TD
Request[Incoming Request] --> Extract[Extract Identifier]
Extract --> CheckExisting{Existing Rate Limit?}
CheckExisting --> |Yes| CompareTime{Within 1 Hour Window?}
CheckExisting --> |No| CreateNew[Create New Rate Limit Entry]
CompareTime --> |Yes| CheckCount{Count < 10?}
CompareTime --> |No| CreateNew
CheckCount --> |Yes| IncrementCount[Increment Request Count]
CheckCount --> |No| BlockRequest[Block Request - 429 Too Many Requests]
IncrementCount --> UpdateDB[Update Database]
CreateNew --> InsertDB[Insert New Record]
UpdateDB --> AllowRequest[Allow Request]
InsertDB --> AllowRequest
BlockRequest --> ReturnError[Return Rate Limit Error]
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L55-L92)

### Rate Limiting Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Time Window | 1 hour | Prevents abuse within reasonable timeframe |
| Maximum Requests | 10 per window | Allows multiple meaningful conversations |
| Identifier Source | IP Address | Provides fair usage distribution |
| Grace Period | 3600 seconds | Standard retry-after header |

**Section sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L55-L92)

## Quick Reply Generation System

The system provides intelligent quick reply buttons that adapt to the current conversation context, offering users convenient response options while maintaining conversational flow.

### Context-Aware Quick Reply Generation

```mermaid
flowchart TD
AIResponse[AI Generated Response] --> Analyze[Analyze Response Content]
Analyze --> ExtractStage[Determine Current Stage]
ExtractStage --> NameStage{Name Collection Stage?}
ExtractStage --> ProductStage{Product Inquiry Stage?}
ExtractStage --> QuantityStage{Quantity Inquiry Stage?}
ExtractStage --> CustomizationStage{Customization Stage?}
ExtractStage --> EmailStage{Email Collection Stage?}
ExtractStage --> BudgetStage{Budget Inquiry Stage?}
ExtractStage --> DecisionStage{Decision Point Stage?}
NameStage --> |Yes| NoQuickReplies[No Quick Replies]
ProductStage --> |Yes| ProductOptions[Product Type Options]
QuantityStage --> |Yes| QuantityOptions[Quantity Range Options]
CustomizationStage --> |Yes| CustomizationOptions[Customization Options]
EmailStage --> |Yes| NoQuickReplies
BudgetStage --> |Yes| BudgetOptions[Budget Range Options]
DecisionStage --> |Yes| DecisionOptions[Action Options]
ProductOptions --> RenderButtons[Render Quick Reply Buttons]
QuantityOptions --> RenderButtons
CustomizationOptions --> RenderButtons
BudgetOptions --> RenderButtons
DecisionOptions --> RenderButtons
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L407-L480)
- [SmartReplyButtons.tsx](file://src/components/SmartReplyButtons.tsx#L13-L69)

### Quick Reply Categories

The system generates contextually appropriate quick reply categories:

| Category | Purpose | Examples |
|----------|---------|----------|
| Product Selection | Help users choose product types | "👕 T-shirts", "🧥 Hoodies", "👔 Polo shirts" |
| Quantity Ranges | Guide quantity selection | "🧪 50-100 (Testing)", "🚀 100-500 (Launch)" |
| Customization Levels | Define customization options | "🏷️ Logo Only", "🎨 Custom Design", "🧵 Embroidery" |
| Budget Ranges | Establish budget expectations | "💵 $5-10 per piece", "💰 $10-20 per piece" |
| Action Choices | Present final decisions | "🎯 Generate Quote", "📧 Talk to Team" |

**Section sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L407-L480)
- [SmartReplyButtons.tsx](file://src/components/SmartReplyButtons.tsx#L13-L69)

## Error Handling and Fallback Mechanisms

The system implements comprehensive error handling with multiple fallback layers to ensure reliable operation even when AI services experience temporary failures.

### Multi-Level Error Handling Architecture

```mermaid
flowchart TD
Request[User Request] --> AIRequest[AI Service Request]
AIRequest --> AISuccess{AI Response Successful?}
AISuccess --> |Yes| ValidateResponse[Validate Response]
AISuccess --> |No| AIFallback[AI Service Fallback]
ValidateResponse --> ValidResponse{Response Valid?}
ValidResponse --> |Yes| ProcessResponse[Process Response]
ValidResponse --> |No| ValidationFallback[Validation Fallback]
AIFallback --> NetworkRetry{Network Error?}
NetworkRetry --> |Yes| RetryLogic[Retry Logic]
NetworkRetry --> |No| ServiceFallback[Service Unavailable Fallback]
RetryLogic --> MaxRetries{Max Retries Reached?}
MaxRetries --> |No| AIRequest
MaxRetries --> |Yes| ServiceFallback
ValidationFallback --> DefaultFallback[Default Fallback Response]
ServiceFallback --> DefaultFallback
DefaultFallback --> ErrorResponse[Error Response]
ProcessResponse --> SuccessResponse[Successful Response]
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L375-L387)
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx#L129-L150)

### Error Recovery Strategies

The system employs several error recovery strategies:

1. **AI Response Validation**: Ensures responses align with expected state machine flow
2. **Fallback Questions**: Provides appropriate default questions when AI fails
3. **Retry Logic**: Implements exponential backoff for transient failures
4. **Graceful Degradation**: Continues operation with reduced functionality when services fail

**Section sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L375-L387)
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx#L129-L150)

## Lead Scoring Algorithm

The system implements a sophisticated lead scoring algorithm that evaluates user engagement and intent based on collected data points, helping sales teams prioritize high-quality leads.

### Lead Scoring Formula

```mermaid
flowchart TD
UserData[User Data Collection] --> NameCheck{Name Provided?}
UserData --> EmailCheck{Email Provided?}
UserData --> ProductCheck{Product Type Selected?}
UserData --> QuantityCheck{Quantity Specified?}
UserData --> CustomizationCheck{Customization Level?}
UserData --> BudgetCheck{Budget Range?}
NameCheck --> |Yes| NameScore[+15 Points]
NameCheck --> |No| ZeroScore[0 Points]
EmailCheck --> |Yes| EmailScore[+30 Points]
EmailCheck --> |No| ZeroScore
ProductCheck --> |Yes| ProductScore[+20 Points]
ProductCheck --> |No| ZeroScore
QuantityCheck --> |Yes| QuantityScore[+15 Points]
QuantityCheck --> |No| ZeroScore
QuantityCheck --> LargeOrder{Quantity ≥ 500?}
LargeOrder --> |Yes| LargeOrderBonus[+10 Bonus Points]
LargeOrder --> |No| ZeroBonus[0 Bonus Points]
CustomizationCheck --> |Yes| CustomizationScore[+10 Points]
CustomizationCheck --> |No| ZeroScore
BudgetCheck --> |Yes| BudgetScore[+5 Points]
BudgetCheck --> |No| ZeroScore
NameScore --> TotalScore[Calculate Total Score]
EmailScore --> TotalScore
ProductScore --> TotalScore
QuantityScore --> TotalScore
LargeOrderBonus --> TotalScore
CustomizationScore --> TotalScore
BudgetScore --> TotalScore
TotalScore --> MaxScore{Score > 100?}
MaxScore --> |Yes| FinalScore[100]
MaxScore --> |No| FinalScore[Actual Score]
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L605-L620)

### Lead Score Interpretation

| Score Range | Lead Quality | Sales Priority |
|-------------|-------------|----------------|
| 0-39 | Cold | Low Priority |
| 40-69 | Warm | Medium Priority |
| 70-100 | Hot | High Priority |

### Data Extraction and Scoring

The system extracts key data points from user interactions to calculate lead scores:

```mermaid
sequenceDiagram
participant User as User Input
participant Extractor as Data Extractor
participant Scorer as Lead Scorer
participant Database as Supabase
User->>Extractor : Provide conversation data
Extractor->>Extractor : Parse user messages
Extractor->>Extractor : Identify data patterns
Extractor->>Scorer : Extracted data points
Scorer->>Scorer : Apply scoring formula
Scorer->>Database : Store lead score
Database->>User : Updated conversation context
```

**Diagram sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L522-L620)

**Section sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L605-L620)

## Integration Patterns

The Conversational AI Engine integrates seamlessly with various parts of the Sleek Apparels ecosystem through standardized APIs and data exchange patterns.

### Frontend Integration

The system provides multiple frontend integration points:

1. **SmartAIAssistant Component**: Primary chat interface with advanced features
2. **AIAssistantChat Component**: Simplified chat interface for basic interactions
3. **useConversation Hook**: Reusable conversation management logic
4. **SmartReplyButtons Component**: Dynamic quick reply generation

### Backend Integration

The system integrates with Supabase Functions and database services:

```mermaid
sequenceDiagram
participant Frontend as Frontend Component
participant Function as Conversational Assistant
participant Database as Supabase Database
participant AI as Lovable AI Service
Frontend->>Function : Invoke with conversation data
Function->>Database : Fetch industry knowledge
Function->>Database : Check rate limits
Function->>AI : Send system prompt + messages
AI->>Function : Return AI response
Function->>Database : Update conversation context
Function->>Database : Save conversation message
Function->>Frontend : Return processed response
```

**Diagram sources**
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx#L70-L122)
- [useConversation.ts](file://src/hooks/useConversation.ts#L64-L122)

**Section sources**
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx#L35-L122)
- [useConversation.ts](file://src/hooks/useConversation.ts#L32-L122)

## Performance Considerations

The system is optimized for performance through several key strategies:

### Caching and Optimization

1. **Industry Knowledge Caching**: Static knowledge base loaded once per request
2. **Rate Limiting Optimization**: Efficient database queries for rate limit checks
3. **Context Preservation**: Minimal database writes during active conversations
4. **AI Response Caching**: Intelligent caching of common response patterns

### Scalability Features

1. **Serverless Architecture**: Automatic scaling with demand
2. **Database Indexing**: Optimized queries for conversation lookups
3. **Connection Pooling**: Efficient database connection management
4. **CDN Integration**: Static asset delivery optimization

### Monitoring and Metrics

The system tracks key performance indicators:

- **Response Latency**: Average response time per conversation
- **Rate Limit Violations**: Frequency of rate limit triggers
- **AI Service Availability**: Success/failure rates of AI requests
- **User Engagement**: Conversation completion rates and lead quality

## Troubleshooting Guide

Common issues and their solutions:

### AI Service Failures

**Issue**: AI responses are inconsistent or fail frequently
**Solution**: 
1. Check Lovable AI service status
2. Verify API key configuration
3. Review system prompt for clarity
4. Monitor rate limit compliance

### Conversation Context Loss

**Issue**: User conversations reset unexpectedly
**Solution**:
1. Verify localStorage availability
2. Check database connection status
3. Review conversation ID generation
4. Ensure proper session management

### Rate Limit Exceeded

**Issue**: Users receive 429 errors frequently
**Solution**:
1. Increase rate limit thresholds if needed
2. Implement user-friendly error messaging
3. Add rate limit monitoring
4. Consider user segmentation for different limits

### Quick Reply Issues

**Issue**: Quick replies don't appear or are incorrect
**Solution**:
1. Verify response content analysis
2. Check stage detection logic
3. Review quick reply generation conditions
4. Test with different conversation flows

**Section sources**
- [index.ts](file://supabase/functions/conversational-assistant/index.ts#L375-L387)
- [SmartAIAssistant.tsx](file://src/components/SmartAIAssistant.tsx#L129-L150)

## Conclusion

The Conversational AI Engine represents a sophisticated approach to building intelligent chat interfaces that balance user experience with business objectives. Through its state machine-driven architecture, robust error handling, and comprehensive data persistence, it creates seamless conversational experiences that drive lead generation and quote conversions.

The system's integration with Lovable AI's GPT-5-mini model, combined with custom validation and fallback mechanisms, ensures reliable operation even under challenging conditions. The lead scoring algorithm provides valuable insights for sales teams, while the rate limiting implementation protects system resources from abuse.

Future enhancements could include expanded product knowledge integration, multilingual support, and advanced sentiment analysis capabilities. The modular architecture ensures that such improvements can be implemented without disrupting the core conversation flow.