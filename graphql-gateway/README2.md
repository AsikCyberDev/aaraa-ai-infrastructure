# Complete GraphQL Queries and Mutations for Postman Testing

# GraphQL Queries and Mutations for Postman Testing

## Setting up Postman

1. Set the request type to POST
2. Set the URL to your GraphQL endpoint (e.g., `https://your-api-endpoint.com/graphql`)
3. In the Headers tab, add:
   - Key: `Content-Type`
   - Value: `application/json`
4. In the Body tab, select "raw" and choose JSON (application/json) from the dropdown

## Queries

### Get All Chatbots

```graphql
query GetAllChatbots {
  chatbots {
    id
    name
    description
    status
    type
    projectId
  }
}
```

### Get Specific Chatbot

```graphql
query GetChatbot($id: ID!) {
  chatbot(id: $id) {
    id
    name
    description
    status
    type
    projectId
  }
}
```

Variables:
```json
{
  "id": "chatbot-123"
}
```

### Get Documents by Project

```graphql
query GetDocumentsByProject($projectId: ID!) {
  documentsByProject(projectId: $projectId) {
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

Variables:
```json
{
  "projectId": "project-123"
}
```

### Get User Information

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    company
    role
  }
}
```

Variables:
```json
{
  "id": "user-123"
}
```

## Mutations

### Create Chatbot

```graphql
mutation CreateChatbot($input: CreateChatbotInput!) {
  createChatbot(input: $input) {
    id
    name
    description
    status
    type
    projectId
  }
}
```

Variables:
```json
{
  "input": {
    "name": "Customer Support Bot",
    "description": "24/7 customer support chatbot",
    "status": "ACTIVE",
    "type": "SUPPORT",
    "projectId": "project-123",
    "language": "en",
    "integrations": ["SLACK", "WEBSITE"],
    "customIntegration": "API",
    "theme": "light",
    "primaryColor": {
      "cleared": false,
      "metaColor": {
        "isValid": true,
        "r": 0,
        "g": 123,
        "b": 255,
        "a": 1,
        "_h": 210,
        "_s": 100,
        "_v": 100
      }
    },
    "fontSelection": "Arial",
    "welcomeMessage": "Hello! How can I assist you today?",
    "fallbackMessage": "I'm sorry, I didn't understand that. Could you please rephrase?",
    "inputPlaceholder": "Type your message here...",
    "responseTime": 3,
    "enableTypingIndicator": true,
    "enableLearning": true,
    "confidenceThreshold": 0.7,
    "maxConversationLength": 50,
    "enableHumanHandoff": true,
    "handoffThreshold": 0.3,
    "enableAnalytics": true,
    "sessionTimeout": 1800
  }
}
```

### Create Document

```graphql
mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(input: $input) {
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

Variables:
```json
{
  "input": {
    "name": "Product Manual.pdf",
    "size": "1048576",
    "chatbotId": "chatbot-123",
    "projectId": "project-123"
  }
}
```

### Sign Up User

```graphql
mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    id
    name
    email
    token
  }
}
```

Variables:
```json
{
  "input": {
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "address": "123 Main St, City, Country",
    "sex": "MALE",
    "password": "securePassword123"
  }
}
```

### Sign In User

```graphql
mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    id
    name
    email
    token
  }
}
```

Variables:
```json
{
  "input": {
    "email": "john@example.com",
    "password": "securePassword123"
  }
}
```

### Generate API Key

```graphql
mutation GenerateApiKey($input: CreateApiKeyInput!) {
  generateApiKey(input: $input) {
    apiKeyId
    key
    chatbotId
    created
  }
}
```

Variables:
```json
{
  "input": {
    "chatbotId": "chatbot-123"
  }
}
```

## Testing in Postman

1. Create a new request in Postman
2. Set up the request as described in the "Setting up Postman" section
3. In the Body tab, use this structure:

```json
{
  "query": "Your GraphQL query or mutation here",
  "variables": {
    "Your": "variables",
    "go": "here"
  }
}
```

4. Replace "Your GraphQL query or mutation here" with the query or mutation you want to test
5. Replace the variables object with the corresponding variables for your operation
6. Send the request and check the response

Remember to replace placeholder IDs (like "chatbot-123", "project-123", etc.) with actual IDs from your system when testing.

## Setting up Postman

[Previous setup instructions remain the same]

## Queries

### Get All Chatbots

[Previous example remains the same]

### Get Specific Chatbot

[Previous example remains the same]

### Get Documents by Project

[Previous example remains the same]

### Get Documents by Chatbot

```graphql
query GetDocumentsByChatbot($chatbotId: ID!) {
  documentsByChatbot(chatbotId: $chatbotId) {
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

Variables:
```json
{
  "chatbotId": "chatbot-123"
}
```

### Get Specific Document

```graphql
query GetDocument($id: ID!, $projectId: ID!) {
  document(id: $id, projectId: $projectId) {
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

Variables:
```json
{
  "id": "doc-123",
  "projectId": "project-123"
}
```

### Get User Information

[Previous example remains the same]

### Get Projects by User

```graphql
query GetProjectsByUser($userId: ID!) {
  projects(userId: $userId) {
    id
    name
    description
    userId
  }
}
```

Variables:
```json
{
  "userId": "user-123"
}
```

### Get Specific Project

```graphql
query GetProject($id: ID!) {
  project(id: $id) {
    id
    name
    description
    userId
  }
}
```

Variables:
```json
{
  "id": "project-123"
}
```

## Mutations

### Create Chatbot

[Previous example remains the same]

### Update Chatbot

```graphql
mutation UpdateChatbot($id: ID!, $input: CreateChatbotInput!) {
  updateChatbot(id: $id, input: $input) {
    id
    name
    description
    status
    type
    projectId
  }
}
```

Variables:
```json
{
  "id": "chatbot-123",
  "input": {
    "name": "Updated Support Bot",
    "description": "Updated 24/7 customer support chatbot",
    "status": "INACTIVE",
    "type": "SUPPORT",
    "projectId": "project-123"
  }
}
```

### Delete Chatbot

```graphql
mutation DeleteChatbot($id: ID!) {
  deleteChatbot(id: $id)
}
```

Variables:
```json
{
  "id": "chatbot-123"
}
```

### Create Document

[Previous example remains the same]

### Update Document

```graphql
mutation UpdateDocument($id: ID!, $projectId: ID!, $name: String!) {
  updateDocument(id: $id, projectId: $projectId, name: $name) {
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

Variables:
```json
{
  "id": "doc-123",
  "projectId": "project-123",
  "name": "Updated Product Manual.pdf"
}
```

### Delete Document

```graphql
mutation DeleteDocument($id: ID!, $projectId: ID!) {
  deleteDocument(id: $id, projectId: $projectId)
}
```

Variables:
```json
{
  "id": "doc-123",
  "projectId": "project-123"
}
```

### Sign Up User

[Previous example remains the same]

### Sign In User

[Previous example remains the same]

### Create User

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    company
    role
  }
}
```

Variables:
```json
{
  "input": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "company": "Acme Inc",
    "role": "Manager"
  }
}
```

### Update User

```graphql
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    email
    company
    role
  }
}
```

Variables:
```json
{
  "id": "user-123",
  "input": {
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "company": "New Corp",
    "role": "Director"
  }
}
```

### Delete User

```graphql
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
```

Variables:
```json
{
  "id": "user-123"
}
```

### Generate API Key

[Previous example remains the same]

### Revoke API Key

```graphql
mutation RevokeApiKey($chatbotId: ID!, $apiKeyId: ID!) {
  revokeApiKey(chatbotId: $chatbotId, apiKeyId: $apiKeyId)
}
```

Variables:
```json
{
  "chatbotId": "chatbot-123",
  "apiKeyId": "apikey-123"
}
```

### Create Project

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

Variables:
```json
{
  "input": {
    "name": "E-commerce Chatbot",
    "description": "Chatbot for our online store",
    "userId": "user-123"
  }
}
```

### Update Project

```graphql
mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    name
    description
    userId
  }
}
```

Variables:
```json
{
  "id": "project-123",
  "input": {
    "name": "Updated E-commerce Chatbot",
    "description": "Updated chatbot for our online store"
  }
}
```

### Delete Project

```graphql
mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}
```

Variables:
```json
{
  "id": "project-123"
}
```

## Testing in Postman
