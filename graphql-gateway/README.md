Here’s a comprehensive list of GraphQL queries and mutations for your system, covering all user, project, chatbot, document, and API key management operations. Each operation includes a sample query or mutation along with example variables.

### 1. **Sign Up**
Registers a new user in the system.

```graphql
mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    id
    name
    email
    mobile
    address
    sex
    token
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "+1234567890",
    "address": "123 Main St, Springfield",
    "sex": "Male",
    "password": "StrongPassword123"
  }
}
```

### 2. **Sign In**
Authenticates a user and returns a token.

```graphql
mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    token
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "john.doe@example.com",
    "password": "StrongPassword123"
  }
}
```

### 3. **Create Project**
Creates a new project under a specific user.

```graphql
mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    description
    userId
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Project A",
    "description": "This is project A",
    "userId": "user-123"
  }
}
```

### 4. **Create Chatbot**
Creates a new chatbot under a specific project.

```graphql
mutation CreateChatbot($input: CreateChatbotInput!) {
  createChatbot(input: $input) {
    id
    name
    description
    status
    type
    projectId
    language
    integrations
    customIntegration
    theme
    primaryColor {
      cleared
      metaColor {
        isValid
        r
        g
        b
        a
      }
    }
    fontSelection
    chatIcon {
      uid
      lastModified
      name
      size
      type
      thumbUrl
    }
    welcomeMessage
    fallbackMessage
    inputPlaceholder
    responseTime
    enableTypingIndicator
    trainingData {
      uid
      lastModified
      name
      size
      type
    }
    knowledgeBase
    enableLearning
    confidenceThreshold
    maxConversationLength
    enableHumanHandoff
    handoffThreshold
    enableAnalytics
    sessionTimeout
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Chatbot A",
    "description": "This is chatbot A",
    "status": "ACTIVE",
    "type": "SUPPORT",
    "projectId": "project-123",
    "language": "en",
    "integrations": ["Website"],
    "customIntegration": "Custom Integration",
    "theme": "dark",
    "primaryColor": {
      "cleared": false,
      "metaColor": {
        "isValid": true,
        "r": 145,
        "g": 49,
        "b": 49,
        "a": 1
      }
    },
    "fontSelection": "Arial",
    "chatIcon": [
      {
        "uid": "rc-upload-1234567890-1",
        "lastModified": 1723323618734,
        "name": "test.png",
        "size": 90306,
        "type": "image/png",
        "thumbUrl": "test.png"
      }
    ],
    "welcomeMessage": "Welcome to our support chatbot!",
    "fallbackMessage": "Sorry, I didn't understand that. Can you please rephrase?",
    "inputPlaceholder": "Type your message here...",
    "responseTime": 1,
    "enableTypingIndicator": true,
    "trainingData": [
      {
        "uid": "rc-upload-1234567890-3",
        "lastModified": 1722288719072,
        "name": "training-data.csv",
        "size": 35094,
        "type": "text/csv"
      }
    ],
    "knowledgeBase": "Some knowledge base",
    "enableLearning": true,
    "confidenceThreshold": 0.75,
    "maxConversationLength": 10,
    "enableHumanHandoff": true,
    "handoffThreshold": 0.5,
    "enableAnalytics": true,
    "sessionTimeout": 5
  }
}
```

### 5. **Create Document**
Creates a new document under a specific chatbot.

```graphql
mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(input: $input) {
    id
    name
    size
    uploadDate
    chatbotId
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Document 1",
    "size": "15MB",
    "chatbotId": "chatbot-123"
  }
}
```

### 6. **List Projects for a User**
Lists all projects under a specific user.

```graphql
query ListProjects($userId: ID!) {
  projects(userId: $userId) {
    id
    name
    description
  }
}
```

**Variables:**
```json
{
  "userId": "user-123"
}
```

### 7. **List Chatbots in a Project**
Lists all chatbots under a specific project.

```graphql
query ListChatbots($projectId: ID!) {
  chatbots(projectId: $projectId) {
    id
    name
    description
  }
}
```

**Variables:**
```json
{
  "projectId": "project-123"
}
```

### 8. **List Documents in a Chatbot**
Lists all documents under a specific chatbot.

```graphql
query ListDocuments($chatbotId: ID!) {
  documents(chatbotId: $chatbotId) {
    id
    name
    size
  }
}
```

**Variables:**
```json
{
  "chatbotId": "chatbot-123"
}
```

### 9. **Delete Project**
Deletes a project by ID.

```graphql
mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}
```

**Variables:**
```json
{
  "id": "project-123"
}
```

### 10. **Delete Chatbot**
Deletes a chatbot by ID.

```graphql
mutation DeleteChatbot($id: ID!) {
  deleteChatbot(id: $id)
}
```

**Variables:**
```json
{
  "id": "chatbot-123"
}
```

### 11. **Delete Document**
Deletes a document by ID.

```graphql
mutation DeleteDocument($id: ID!) {
  deleteDocument(id: $id)
}
```

**Variables:**
```json
{
  "id": "document-123"
}
```

### 12. **List Projects of a User**
Lists all projects of a specific user.

```graphql
query ListUserProjects($userId: ID!) {
  user(id: $userId) {
    id
    name
    projects {
      id
      name
      description
    }
  }
}
```

**Variables:**
```json
{
  "userId": "user-123"
}
```

### 13. **Generate API Key**
Generates a new API key for a chatbot.

```graphql
mutation GenerateApiKey($input: CreateApiKeyInput!) {
  generateApiKey(input: $input) {
    apiKeyId
    key
    created
    chatbotId
  }
}
```

**Variables:**
```json
{
  "input": {
    "chatbotId": "chatbot-123"
  }
}
```

### 14. **Revoke API Key**
Revokes an API key for a chatbot.

```graphql
mutation RevokeApiKey($chatbotId: ID!, $apiKeyId: ID!) {
  revokeApiKey(chatbotId: $chatbotId, apiKeyId: $apiKeyId)
}
```

**Variables:**
```json
{
  "chatbotId": "chatbot-123",
  "apiKeyId": "apikey-123"
}
```

### 15. **List API Keys**
Lists all API keys for a chatbot.

```graphql
query ListApiKeys($chatbotId: ID!) {
  apiKeys(chatbotId: $chatbotId) {
    apiKeyId
    key
    created
    lastUsed
  }
}
```

**Variables:**
```json
{
  "chatbotId": "chatbot-123"
}
```

### Summary
- **Sign Up**: Registers a new user.
- **Sign In**: Authenticates a user and generates a token.
- **Create Project**: Creates a new project for a user.
- **Create Chatbot**: Adds a chatbot to a project.
- **Create Document**: Uploads a document to a chatbot.
- **List Projects**: Retrieves a user's projects.
- **List Chatbots in a Project**: Retrieves chatbots within a project.
- **List Documents in a Chatbot**: Retrieves documents within a chatbot.
- **Delete Project**: Removes a project.
- **Delete Chatbot

**: Removes a chatbot.
- **Delete Document**: Removes a document.
- **Generate API Key**: Generates a new API key for a chatbot.
- **Revoke API Key**: Revokes an existing API key.
- **List API Keys**: Retrieves API keys for a specific chatbot.

This list provides a comprehensive set of operations you can perform on the Aaraa.AI Chatbot Platform via your GraphQL API. You can test these queries and mutations using any GraphQL client or playground.