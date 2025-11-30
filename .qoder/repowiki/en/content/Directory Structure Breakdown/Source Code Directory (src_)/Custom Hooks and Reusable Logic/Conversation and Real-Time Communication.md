# Conversation and Real-Time Communication

<cite>
**Referenced Files in This Document**
- [useConversation.ts](file://src/hooks/useConversation.ts)
- [useRealtimeMessages.ts](file://src/hooks/useRealtimeMessages.ts)
- [AIAssistantChat.tsx](file://src/components/AIAssistantChat.tsx)
- [OrderMessaging.tsx](file://src/components/supplier/OrderMessaging.tsx)
- [AIQuoteGenerator.tsx](file://src/components/AIQuoteGenerator.tsx)
- [conversational-assistant/index.ts](file://supabase/functions/conversational-assistant/index.ts)
- [submit-quote/index.ts](file://supabase/functions/submit-quote/index.ts)
- [client.ts](file://src/integrations/supabase/client.ts)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts)
- [CommunicationCenter.tsx](file://src/components/shared/CommunicationCenter.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [WebSocket Integration with Supabase Realtime](#websocket-integration-with-supabase-realtime)
5. [Message State Management](#message-state-management)
6. [AI Conversation System](#ai-conversation-system)
7. [Real-Time Messaging](#real-time-messaging)
8. [Conversational Quote Building](#conversational-quote-building)
9. [Error Recovery and Offline Handling](#error-recovery-and-offline-handling)
10. [Security Considerations](#security-considerations)
11. [Integration Patterns](#integration-patterns)
12. [Performance Optimization](#performance-optimization)
13. [Troubleshooting Guide](#troubleshooting-guide)

## Introduction

The Sleek Apparels conversation and real-time communication system forms the backbone of buyer-supplier interactions, enabling seamless AI-powered quote generation, instant messaging, and collaborative order management. Built on Supabase's Realtime capabilities and enhanced with custom Edge Functions, this system provides instant message delivery, persistent conversation history, and sophisticated AI-driven assistance.

The system encompasses multiple communication channels:
- **AI Assistant Chat**: Intelligent conversational interface for quote building
- **Order Messaging**: Direct supplier-buyer communication during production
- **Real-Time Notifications**: Instant updates across the platform
- **Quote Generation**: AI-powered pricing with historical context

## System Architecture

The conversation system follows a layered architecture that separates concerns between frontend state management, backend processing, and real-time communication:

```mermaid
graph TB
subgraph "Frontend Layer"
FC[useConversation Hook]
FRM[useRealtimeMessages Hook]
AAC[AIAssistantChat Component]
OM[OrderMessaging Component]
CC[CommunicationCenter Component]
end
subgraph "Edge Functions Layer"
CA[conversational-assistant]
SQ[submit-quote]
AQ[ai-quote-generator]
end
subgraph "Supabase Infrastructure"
SC[Supabase Client]
RT[Realtime Channels]
DB[(PostgreSQL Database)]
SF[Storage Functions]
end
subgraph "External AI Services"
LA[Lovable AI Gateway]
GEM[Gemini Flash API]
end
FC --> SC
FRM --> RT
AAC --> SC
OM --> SC
CC --> SC
SC --> DB
SC --> SF
CA --> LA
LA --> GEM
CA --> DB
SQ --> DB
AQ --> DB
```

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L32-L177)
- [useRealtimeMessages.ts](file://src/hooks/useRealtimeMessages.ts#L17-L61)
- [conversational-assistant/index.ts](file://supabase/functions/conversational-assistant/index.ts#L22-L388)

## Core Components

### Message Data Structures

The system defines several key message interfaces that ensure type safety and consistent data handling:

```mermaid
classDiagram
class Message {
+string role
+string content
+number timestamp
+QuickReply[] quickReplies
+any extractedData
+number leadScore
+QuoteData quote
}
class QuoteData {
+string productType
+number quantity
+string customization
+number unitPrice
+number totalPrice
+string leadTime
+number moq
+string[] insights
}
class QuickReply {
+string text
+string value
+string action
}
class AIQuoteResponse {
+boolean success
+QuoteData quote
+TimelineStage[] timeline
+string aiInsights
}
Message --> QuoteData
Message --> QuickReply
AIQuoteResponse --> QuoteData
```

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L5-L30)
- [AIQuoteGenerator.tsx](file://src/components/AIQuoteGenerator.tsx#L29-L64)

**Section sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L5-L30)
- [AIQuoteGenerator.tsx](file://src/components/AIQuoteGenerator.tsx#L29-L64)

### Hook-Based State Management

The system employs custom React hooks for centralized state management and side effects:

```mermaid
sequenceDiagram
participant C as Component
participant UC as useConversation
participant UR as useRealtimeMessages
participant S as Supabase
participant EF as Edge Functions
C->>UC : sendMessage(content)
UC->>S : Save to conversation_messages
UC->>EF : Invoke conversational-assistant
EF-->>UC : AI response + metadata
UC->>C : Update state with new message
C->>UR : Subscribe to messages
UR->>S : Setup realtime channel
S-->>UR : New message event
UR->>C : Trigger callback
```

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L64-L150)
- [useRealtimeMessages.ts](file://src/hooks/useRealtimeMessages.ts#L17-L61)

**Section sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L32-L177)
- [useRealtimeMessages.ts](file://src/hooks/useRealtimeMessages.ts#L17-L61)

## WebSocket Integration with Supabase Realtime

### Realtime Channel Management

Supabase's Realtime functionality enables instant message delivery through WebSocket connections. The system creates dedicated channels for different communication scenarios:

```mermaid
flowchart TD
Start([Component Mount]) --> CheckUserID{User ID Available?}
CheckUserID --> |No| Return[Return Early]
CheckUserID --> |Yes| CreateChannel[Create Supabase Channel]
CreateChannel --> SetupInsert[Setup INSERT Listener]
SetupInsert --> SetupUpdate[Setup UPDATE Listener]
SetupUpdate --> Subscribe[Subscribe to Channel]
Subscribe --> WaitEvent[Wait for Events]
WaitEvent --> ProcessInsert[Process INSERT Event]
ProcessInsert --> ProcessUpdate[Process UPDATE Event]
ProcessUpdate --> WaitEvent
WaitEvent --> Unmount{Component Unmount?}
Unmount --> |No| WaitEvent
Unmount --> |Yes| Cleanup[Unsubscribe Channel]
Cleanup --> End([Cleanup Complete])
```

**Diagram sources**
- [useRealtimeMessages.ts](file://src/hooks/useRealtimeMessages.ts#L20-L58)

### Channel Configuration Patterns

The system implements different channel configurations based on the communication context:

| Channel Type | Purpose | Filter Criteria | Event Types |
|--------------|---------|-----------------|-------------|
| `realtime-messages` | General messaging | `recipient_id=eq.{userId}` | INSERT, UPDATE |
| `messages-sent` | Outgoing messages | `sender_id=eq.{userId}` | ALL |
| `messages-received` | Incoming messages | `recipient_id=eq.{userId}` | ALL |
| `order_messages_{orderId}` | Order-specific chat | `order_id=eq.{orderId}` | INSERT |
| `order_messages:{orderId}` | Order message updates | `order_id=eq.{orderId}` | INSERT |

**Section sources**
- [useRealtimeMessages.ts](file://src/hooks/useRealtimeMessages.ts#L23-L58)
- [CommunicationCenter.tsx](file://src/components/shared/CommunicationCenter.tsx#L51-L75)

## Message State Management

### Conversation Persistence

The system maintains conversation state across browser sessions using localStorage with automatic synchronization:

```mermaid
stateDiagram-v2
[*] --> Loading
Loading --> Restoring : Load from localStorage
Restoring --> Active : Restore successful
Restoring --> Fresh : Restore failed
Fresh --> Active : Initialize empty
Active --> Sending : User sends message
Sending --> Saving : Save to Supabase
Saving --> Active : Save successful
Saving --> Error : Save failed
Error --> Active : Retry successful
Error --> Failed : Max retries exceeded
Active --> Persisting : Auto-save
Persisting --> Active : Save successful
Failed --> [*]
```

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L40-L62)

### Message Lifecycle Management

Each message follows a comprehensive lifecycle that ensures reliability and consistency:

```mermaid
flowchart LR
UserInput[User Input] --> Validate[Validate Message]
Validate --> LocalSave[Local State Update]
LocalSave --> DBSave[Database Persistence]
DBSave --> AIService[AI Service Call]
AIService --> Response[AI Response]
Response --> StateUpdate[State Update]
StateUpdate --> RealtimeNotify[Realtime Notification]
RealtimeNotify --> Complete[Complete]
```

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L64-L150)

**Section sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L40-L62)
- [useConversation.ts](file://src/hooks/useConversation.ts#L64-L150)

## AI Conversation System

### Conversational Assistant Architecture

The AI conversation system implements a sophisticated state machine that guides users through the quote generation process:

```mermaid
stateDiagram-v2
[*] --> GREETING
GREETING --> NAME_COLLECTED : User provides name
NAME_COLLECTED --> INTENT_UNDERSTOOD : User describes intent
INTENT_UNDERSTOOD --> PRODUCT_IDENTIFIED : User selects product
PRODUCT_IDENTIFIED --> QUANTITY_COLLECTED : User specifies quantity
QUANTITY_COLLECTED --> CUSTOMIZATION_COLLECTED : User chooses customization
CUSTOMIZATION_COLLECTED --> EMAIL_COLLECTED : User provides email
EMAIL_COLLECTED --> READY_FOR_QUOTE : All data collected
READY_FOR_QUOTE --> GENERATING_QUOTE : User requests quote
READY_FOR_QUOTE --> CONTACT_TEAM : User prefers human assistance
GENERATING_QUOTE --> [*]
CONTACT_TEAM --> [*]
```

**Diagram sources**
- [conversational-assistant/index.ts](file://supabase/functions/conversational-assistant/index.ts#L168-L176)

### AI Response Generation

The conversational assistant leverages Lovable AI with Gemini Flash to provide context-aware responses:

```mermaid
sequenceDiagram
participant U as User
participant HC as useConversation
participant EF as Edge Function
participant AI as Lovable AI
participant DB as Supabase DB
U->>HC : sendMessage(userMessage)
HC->>EF : POST /conversational-assistant
EF->>DB : Fetch industry knowledge
EF->>AI : Generate response with context
AI-->>EF : AI response + metadata
EF->>DB : Save conversation context
EF-->>HC : Structured response
HC->>HC : Update local state
HC-->>U : Display AI response
```

**Diagram sources**
- [conversational-assistant/index.ts](file://supabase/functions/conversational-assistant/index.ts#L254-L278)
- [useConversation.ts](file://src/hooks/useConversation.ts#L64-L150)

### Quick Reply Generation

The system automatically generates contextual quick replies based on the current conversation state:

| State | Quick Replies | Purpose |
|-------|---------------|---------|
| GREETING | User's name | Collect identity |
| NAME_COLLECTED | Product categories | Guide product selection |
| PRODUCT_IDENTIFIED | Quantity ranges | Specify order size |
| QUANTITY_COLLECTED | Customization options | Define design requirements |
| CUSTOMIZATION_COLLECTED | Email collection | Contact information |
| EMAIL_COLLECTED | Final actions | Next steps |

**Section sources**
- [conversational-assistant/index.ts](file://supabase/functions/conversational-assistant/index.ts#L407-L481)
- [useConversation.ts](file://src/hooks/useConversation.ts#L102-L107)

## Real-Time Messaging

### Order-Specific Communication

The Order Messaging component enables direct communication between buyers and suppliers during production:

```mermaid
classDiagram
class OrderMessaging {
+string orderId
+boolean isAdmin
+Message[] messages
+string newMessage
+boolean loading
+boolean sending
+fetchMessages()
+handleSend()
+subscribeToMessages()
}
class Message {
+string id
+string sender_id
+string recipient_id
+string message
+string created_at
+string[] attachments
}
OrderMessaging --> Message : manages
```

**Diagram sources**
- [OrderMessaging.tsx](file://src/components/supplier/OrderMessaging.tsx#L11-L16)

### Realtime Subscription Management

The system implements robust subscription management with automatic cleanup:

```mermaid
flowchart TD
Mount[Component Mount] --> AuthCheck{Authenticated?}
AuthCheck --> |No| Skip[Skip Subscription]
AuthCheck --> |Yes| Setup[Setup Subscription]
Setup --> Channel[Create Channel]
Channel --> Listen[Listen for Events]
Listen --> Process[Process Messages]
Process --> Update[Update State]
Update --> Unmount{Component Unmount?}
Unmount --> |No| Listen
Unmount --> |Yes| Cleanup[Remove Channel]
Cleanup --> End[Subscription Ended]
```

**Diagram sources**
- [OrderMessaging.tsx](file://src/components/supplier/OrderMessaging.tsx#L22-L35)

**Section sources**
- [OrderMessaging.tsx](file://src/components/supplier/OrderMessaging.tsx#L16-L136)
- [useRealtimeMessages.ts](file://src/hooks/useRealtimeMessages.ts#L17-L61)

## Conversational Quote Building

### AI Quote Generation Pipeline

The AI Quote Generator combines user input with historical data and market intelligence to produce instant pricing:

```mermaid
flowchart TD
FormSubmit[Form Submission] --> Validate[Client-side Validation]
Validate --> Transform[Transform Request]
Transform --> Upload[Upload Files]
Upload --> CallAPI[Call AI Quote API]
CallAPI --> Retry{Retry Logic?}
Retry --> |Yes| Backoff[Exponential Backoff]
Backoff --> CallAPI
Retry --> |No| Success[Success Response]
Success --> Parse[Parsed Response]
Parse --> Display[Display Quote]
CallAPI --> Error{API Error?}
Error --> |Validation| ShowError[Show Validation Error]
Error --> |Network| ShowError
Error --> |Server| ShowError
Error --> |Timeout| ShowError
```

**Diagram sources**
- [AIQuoteGenerator.tsx](file://src/components/AIQuoteGenerator.tsx#L123-L234)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts#L49-L146)

### Quote Data Structure

The system maintains comprehensive quote data with detailed breakdowns:

```mermaid
erDiagram
AI_QUOTE {
uuid id PK
string customer_email
string product_type
int quantity
float total_price
int estimated_delivery_days
jsonb quote_data
string ai_suggestions
timestamp created_at
}
QUOTE_DATA {
jsonb breakdown
jsonb timeline
jsonb moq_range
}
TIMELINE_STAGE {
string stage
int days
date start_date
date end_date
}
AI_QUOTE ||--|| QUOTE_DATA : contains
QUOTE_DATA ||--o{ TIMELINE_STAGE : includes
```

**Diagram sources**
- [AIQuoteGenerator.tsx](file://src/components/AIQuoteGenerator.tsx#L29-L64)

**Section sources**
- [AIQuoteGenerator.tsx](file://src/components/AIQuoteGenerator.tsx#L66-L575)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts#L49-L274)

## Error Recovery and Offline Handling

### Comprehensive Error Handling

The system implements multiple layers of error handling and recovery mechanisms:

```mermaid
flowchart TD
Operation[API Operation] --> TryCatch[Try-Catch Block]
TryCatch --> NetworkError{Network Error?}
NetworkError --> |Yes| RetryLogic[Retry Logic]
NetworkError --> |No| ValidationError{Validation Error?}
RetryLogic --> MaxRetries{Max Retries?}
MaxRetries --> |No| BackoffDelay[Backoff Delay]
BackoffDelay --> RetryLogic
MaxRetries --> |Yes| FallbackMode[Fallback Mode]
ValidationError --> UserError[User-Facing Error]
FallbackMode --> UserError
UserError --> ToastNotification[Toast Notification]
ToastNotification --> UserAction[User Action]
```

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L121-L147)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts#L117-L146)

### Offline Message Queuing

The system maintains message queues for offline scenarios:

| Queue Type | Purpose | Persistence | Retry Strategy |
|------------|---------|-------------|----------------|
| Local Storage | Conversation history | Browser storage | Session-based |
| Supabase Queue | Database sync | Server-side | Automatic retry |
| Realtime Buffer | Live updates | Memory | Connection-based |
| File Upload Queue | Attachments | Memory | Manual retry |

**Section sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L121-L147)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts#L62-L146)

## Security Considerations

### Message Content Security

The system implements multiple security measures to protect sensitive communication:

```mermaid
flowchart LR
Input[User Input] --> Sanitize[DOM Purify]
Sanitize --> Validate[Zod Validation]
Validate --> Encrypt[Encryption]
Encrypt --> Store[Secure Storage]
Store --> AccessControl[Access Control]
AccessControl --> Audit[Audit Logging]
Audit --> Monitor[Security Monitoring]
```

**Diagram sources**
- [AIAssistantChat.tsx](file://src/components/AIAssistantChat.tsx#L158-L185)

### Authentication and Authorization

The system enforces strict access controls across different communication channels:

| Component | Authentication | Authorization | Access Level |
|-----------|----------------|---------------|--------------|
| AI Assistant | Optional | Public | Read/Write |
| Order Messaging | Required | Role-based | Buyer/Supplier/Admin |
| Quote Requests | Optional | Session-based | Read/Write |
| Admin Communication | Required | Admin-only | Full Access |

### Data Protection Measures

The system implements comprehensive data protection:

- **Content Sanitization**: Prevents XSS attacks in message display
- **Input Validation**: Zod-based schema validation for all inputs
- **Rate Limiting**: Prevents abuse across all endpoints
- **CORS Protection**: Secure cross-origin requests
- **Attachment Security**: Encrypted file storage and access control

**Section sources**
- [AIAssistantChat.tsx](file://src/components/AIAssistantChat.tsx#L158-L185)
- [conversational-assistant/index.ts](file://supabase/functions/conversational-assistant/index.ts#L44-L114)
- [submit-quote/index.ts](file://supabase/functions/submit-quote/index.ts#L44-L114)

## Integration Patterns

### Edge Function Integration

The system integrates seamlessly with Supabase Edge Functions for AI processing:

```mermaid
sequenceDiagram
participant F as Frontend
participant S as Supabase Client
participant EF as Edge Function
participant AI as External AI
participant DB as Database
F->>S : invoke('function-name', params)
S->>EF : HTTP Request
EF->>DB : Fetch context data
EF->>AI : Process with AI service
AI-->>EF : AI response
EF->>DB : Save results
EF-->>S : Structured response
S-->>F : Processed data
```

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L86-L96)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts#L72-L83)

### Supabase Client Configuration

The Supabase client is configured for optimal performance and security:

```mermaid
classDiagram
class SupabaseClient {
+createClient(url, key, options)
+auth : AuthClient
+from(table) : QueryBuilder
+storage : StorageClient
+realtime : RealtimeClient
}
class AuthConfig {
+storage : StorageAdapter
+persistSession : boolean
+autoRefreshToken : boolean
}
class RealtimeConfig {
+params : WebSocketParams
+headers : HttpHeaders
+timeout : number
}
SupabaseClient --> AuthConfig
SupabaseClient --> RealtimeConfig
```

**Diagram sources**
- [client.ts](file://src/integrations/supabase/client.ts#L14-L20)

**Section sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L86-L96)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts#L72-L83)
- [client.ts](file://src/integrations/supabase/client.ts#L14-L20)

## Performance Optimization

### Caching Strategies

The system implements intelligent caching to minimize API calls and improve responsiveness:

| Cache Type | Scope | TTL | Invalidation |
|------------|-------|-----|--------------|
| Conversation History | Session | Browser session | Manual clear |
| AI Responses | User session | 5 minutes | Message change |
| Industry Knowledge | Global | 1 hour | Database update |
| User Preferences | Profile | Permanent | User action |

### Realtime Performance

Realtime subscriptions are optimized for minimal bandwidth and latency:

- **Selective Listening**: Only listen for relevant events
- **Debounced Updates**: Prevent excessive state updates
- **Connection Pooling**: Reuse WebSocket connections
- **Graceful Degradation**: Fallback to polling when needed

### Memory Management

The system implements careful memory management for long-running conversations:

- **Message Trimming**: Limit conversation history length
- **Garbage Collection**: Clean up unused subscriptions
- **State Normalization**: Efficient state structure
- **Lazy Loading**: Load messages on demand

## Troubleshooting Guide

### Common Issues and Solutions

| Issue | Symptoms | Solution | Prevention |
|-------|----------|----------|------------|
| Connection Lost | Messages not updating | Check network, refresh page | Implement reconnection logic |
| Slow Response | Delayed AI replies | Verify Edge Function status | Monitor function performance |
| Authentication Failure | Cannot send messages | Check user session | Implement session validation |
| Rate Limiting | API errors | Wait for cooldown period | Implement client-side limits |

### Debugging Tools

The system provides comprehensive debugging capabilities:

- **Console Logging**: Detailed operation logs
- **Network Monitoring**: API call tracking
- **State Inspection**: Real-time state visualization
- **Error Boundaries**: Graceful error handling

### Performance Monitoring

Key performance metrics to monitor:

- **API Response Times**: Edge Function execution time
- **Realtime Latency**: WebSocket message delivery time
- **Memory Usage**: Component memory consumption
- **Error Rates**: System failure frequency

**Section sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L121-L147)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts#L117-L146)