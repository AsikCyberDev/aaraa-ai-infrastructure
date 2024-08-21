Here is a collection of all possible GraphQL queries, mutations, and examples based on the provided schema and resolvers. This should serve as a comprehensive reference.

### Queries

#### 1. **Get All Chatbots**
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

#### 2. **Get Chatbot by ID**
```graphql
query GetChatbotById($id: ID!) {
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

#### 3. **Get User by ID**
```graphql
query GetUserById($id: ID!) {
  user(id: $id) {
    id
    name
    email
    company
    role
  }
}
```

#### 4. **Get Documents by Project**
```graphql
query GetDocumentsByProject($projectId: ID!) {
  documentsByProject(projectId: $projectId) {
    id
    name
    size
    s3Url
    uploadDate
    chatbotId
  }
}
```

#### 5. **Get Documents by Chatbot**
```graphql
query GetDocumentsByChatbot($chatbotId: ID!) {
  documentsByChatbot(chatbotId: $chatbotId) {
    id
    name
    size
    s3Url
    uploadDate
    projectId
  }
}
```

#### 6. **Get Document by ID**
```graphql
query GetDocumentById($id: ID!, $projectId: ID!) {
  document(id: $id, projectId: $projectId) {
    id
    name
    size
    s3Url
    uploadDate
    chatbotId
  }
}
```

#### 7. **Get Projects by User ID**
```graphql
query GetProjectsByUserId($userId: ID!) {
  projects(userId: $userId) {
    id
    name
    description
    created
  }
}
```

#### 8. **Get Project by ID**
```graphql
query GetProjectById($id: ID!) {
  project(id: $id) {
    id
    name
    description
    created
  }
}
```

### Mutations

#### 1. **Create a Chatbot**
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
*Example Variables:*
```json
{
  "input": {
    "name": "Support Bot",
    "description": "A bot for support queries",
    "status": "ACTIVE",
    "type": "SUPPORT",
    "projectId": "project123"
  }
}
```

#### 2. **Update a Chatbot**
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
*Example Variables:*
```json
{
  "id": "chatbot123",
  "input": {
    "name": "Updated Support Bot",
    "description": "Updated description",
    "status": "ACTIVE",
    "type": "SUPPORT",
    "projectId": "project123"
  }
}
```

#### 3. **Delete a Chatbot**
```graphql
mutation DeleteChatbot($id: ID!) {
  deleteChatbot(id: $id)
}
```
*Example Variables:*
```json
{
  "id": "chatbot123"
}
```

#### 4. **Create a Document**
```graphql
mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(input: $input) {
    id
    name
    size
    s3Url
    uploadDate
    uploadUrl
    chatbotId
    projectId
  }
}
```
*Example Variables:*
```json
{
  "input": {
    "name": "example.pdf",
    "size": "1MB",
    "chatbotId": "chatbot123",
    "projectId": "project123"
  }
}
```

#### 5. **Update a Document**
```graphql
mutation UpdateDocument($id: ID!, $projectId: ID!, $name: String!) {
  updateDocument(id: $id, projectId: $projectId, name: $name) {
    id
    name
    s3Url
    uploadDate
  }
}
```
*Example Variables:*
```json
{
  "id": "document123",
  "projectId": "project123",
  "name": "updated_example.pdf"
}
```

#### 6. **Delete a Document**
```graphql
mutation DeleteDocument($id: ID!, $projectId: ID!) {
  deleteDocument(id: $id, projectId: $projectId)
}
```
*Example Variables:*
```json
{
  "id": "document123",
  "projectId": "project123"
}
```

#### 7. **Create a Project**
```graphql
mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    description
    created
  }
}
```
*Example Variables:*
```json
{
  "input": {
    "name": "Project Alpha",
    "description": "An important project",
    "userId": "user123"
  }
}
```

#### 8. **Update a Project**
```graphql
mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    id
    name
    description
    created
  }
}
```
*Example Variables:*
```json
{
  "id": "project123",
  "input": {
    "name": "Updated Project Alpha",
    "description": "Updated description"
  }
}
```

#### 9. **Delete a Project**
```graphql
mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}
```
*Example Variables:*
```json
{
  "id": "project123"
}
```

#### 10. **Sign Up a User**
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
*Example Variables:*
```json
{
  "input": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "1234567890",
    "address": "123 Main St",
    "sex": "M",
    "password": "strongpassword"
  }
}
```

#### 11. **Sign In a User**
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
*Example Variables:*
```json
{
  "input": {
    "email": "john.doe@example.com",
    "password": "strongpassword"
  }
}
```

#### 12. **Generate an API Key**
```graphql
mutation GenerateApiKey($input: CreateApiKeyInput!) {
  generateApiKey(input: $input) {
    apiKeyId
    key
    created
  }
}
```
*Example Variables:*
```json
{
  "input": {
    "chatbotId": "chatbot123"
  }
}
```

#### 13. **Revoke an API Key**
```graphql
mutation RevokeApiKey($chatbotId: ID!, $apiKeyId: ID!) {
  revokeApiKey(chatbotId: $chatbotId, apiKeyId: $apiKeyId)
}
```
*Example Variables:*
```json
{
  "chatbotId": "chatbot123",
  "apiKeyId": "apikey123"
}
```

### Enum Types
- **ChatbotStatus:** `ACTIVE`, `INACTIVE`
- **ChatbotType:** `SUPPORT`, `SALES`

This reference should cover all your GraphQL operations based on the provided schema and resolvers.