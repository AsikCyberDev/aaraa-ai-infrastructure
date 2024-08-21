Here's a comprehensive list of possible queries and mutations with examples in markdown format for reference, based on the provided GraphQL schema and resolvers:

```markdown
# GraphQL API Reference

## Queries

### Get All Chatbots

Retrieves a list of all chatbots.

```graphql
query {
  chatbots {
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
        _h
        _s
        _v
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

### Get a Specific Chatbot

Retrieves a specific chatbot by its ID.

```graphql
query {
  chatbot(id: "chatbot-123") {
    id
    name
    description
    status
    type
    projectId
    # ... other fields ...
  }
}
```

### Get Documents by Project

Retrieves all documents associated with a specific project.

```graphql
query {
  documentsByProject(projectId: "project-123") {
    id
    name
    size
    chatbotId
    projectId
    s3Url
    uploadDate
  }
}
```

### Get Documents by Chatbot

Retrieves all documents associated with a specific chatbot.

```graphql
query {
  documentsByChatbot(chatbotId: "chatbot-123") {
    id
    name
    size
    chatbotId
    projectId
    s3Url
    uploadDate
  }
}
```

### Get a Specific Document

Retrieves a specific document by its ID and project ID.

```graphql
query {
  document(id: "doc-123", projectId: "project-123") {
    id
    name
    size
    chatbotId
    projectId
    s3Url
    uploadDate
  }
}
```

### Get User Information

Retrieves information about a specific user.

```graphql
query {
  user(id: "user-123") {
    id
    name
    email
    company
    role
  }
}
```

### Get Projects by User

Retrieves all projects associated with a specific user.

```graphql
query {
  projects(userId: "user-123") {
    id
    name
    description
    userId
  }
}
```

### Get a Specific Project

Retrieves a specific project by its ID.

```graphql
query {
  project(id: "project-123") {
    id
    name
    description
    userId
  }
}
```

## Mutations

### Create a Chatbot

Creates a new chatbot.

```graphql
mutation {
  createChatbot(input: {
    name: "Customer Support Bot"
    description: "24/7 customer support chatbot"
    status: ACTIVE
    type: SUPPORT
    projectId: "project-123"
    language: "en"
    integrations: ["SLACK", "WEBSITE"]
    customIntegration: "API"
    theme: "light"
    primaryColor: {
      cleared: false
      metaColor: {
        isValid: true
        r: 0
        g: 123
        b: 255
        a: 1
        _h: 210
        _s: 100
        _v: 100
      }
    }
    fontSelection: "Arial"
    chatIcon: [{
      uid: "icon-123"
      lastModified: 1628097600000
      name: "bot-icon.png"
      size: 10240
      type: "image/png"
      thumbUrl: "https://example.com/thumb.png"
    }]
    welcomeMessage: "Hello! How can I assist you today?"
    fallbackMessage: "I'm sorry, I didn't understand that. Could you please rephrase?"
    inputPlaceholder: "Type your message here..."
    responseTime: 3
    enableTypingIndicator: true
    trainingData: [{
      uid: "training-123"
      lastModified: 1628097600000
      name: "customer-faqs.csv"
      size: 102400
      type: "text/csv"
    }]
    knowledgeBase: "https://example.com/kb"
    enableLearning: true
    confidenceThreshold: 0.7
    maxConversationLength: 50
    enableHumanHandoff: true
    handoffThreshold: 0.3
    enableAnalytics: true
    sessionTimeout: 1800
  }) {
    id
    name
    description
    status
    type
    projectId
    # ... other fields ...
  }
}
```

### Update a Chatbot

Updates an existing chatbot.

```graphql
mutation {
  updateChatbot(id: "chatbot-123", input: {
    name: "Updated Support Bot"
    description: "Updated 24/7 customer support chatbot"
    status: INACTIVE
    # ... other fields to update ...
  }) {
    id
    name
    description
    status
    # ... other fields ...
  }
}
```

### Delete a Chatbot

Deletes a chatbot.

```graphql
mutation {
  deleteChatbot(id: "chatbot-123")
}
```

### Create a Document

Creates a new document and generates a pre-signed URL for upload.

```graphql
mutation {
  createDocument(input: {
    name: "Product Manual.pdf"
    size: "1048576"
    chatbotId: "chatbot-123"
    projectId: "project-123"
  }) {
    id
    name
    size
    chatbotId
    projectId
    s3Url
    uploadDate
    uploadUrl
  }
}
```

### Update a Document

Updates an existing document's name.

```graphql
mutation {
  updateDocument(id: "doc-123", projectId: "project-123", name: "Updated Product Manual.pdf") {
    id
    name
    size
    chatbotId
    projectId
    s3Url
    uploadDate
  }
}
```

### Delete a Document

Deletes a document.

```graphql
mutation {
  deleteDocument(id: "doc-123", projectId: "project-123")
}
```

### Create a User (Sign Up)

Creates a new user account.

```graphql
mutation {
  signUp(input: {
    name: "John Doe"
    email: "john@example.com"
    mobile: "+1234567890"
    address: "123 Main St, City, Country"
    sex: "MALE"
    password: "securePassword123"
  }) {
    id
    name
    email
    token
  }
}
```

### User Sign In

Authenticates a user and returns a token.

```graphql
mutation {
  signIn(input: {
    email: "john@example.com"
    password: "securePassword123"
  }) {
    id
    name
    email
    token
  }
}
```

### Create a Project

Creates a new project.

```graphql
mutation {
  createProject(input: {
    name: "E-commerce Chatbot"
    description: "Chatbot for our online store"
    userId: "user-123"
  }) {
    id
    name
    description
    userId
  }
}
```

### Update a Project

Updates an existing project.

```graphql
mutation {
  updateProject(id: "project-123", input: {
    name: "Updated E-commerce Chatbot"
    description: "Updated chatbot for our online store"
  }) {
    id
    name
    description
    userId
  }
}
```

### Delete a Project

Deletes a project.

```graphql
mutation {
  deleteProject(id: "project-123")
}
```

### Generate API Key

Generates a new API key for a chatbot.

```graphql
mutation {
  generateApiKey(input: {
    chatbotId: "chatbot-123"
  }) {
    apiKeyId
    key
    chatbotId
    created
  }
}
```

### Revoke API Key

Revokes an existing API key.

```graphql
mutation {
  revokeApiKey(chatbotId: "chatbot-123", apiKeyId: "apikey-123")
}
```
```

This markdown document provides a comprehensive reference for all the queries and mutations available in your GraphQL API, including example usage for each operation. You can use this as a starting point for your API documentation, and expand on it with more detailed descriptions, parameter explanations, and response formats as needed.