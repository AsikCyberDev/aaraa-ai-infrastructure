import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoDBSetup {
  public readonly chatbotTable: dynamodb.Table;
  public readonly documentTable: dynamodb.Table;
  public readonly userTable: dynamodb.Table;
  public readonly projectTable: dynamodb.Table;
  public readonly apiKeyTable: dynamodb.Table;

  constructor(scope: Construct) {
    this.chatbotTable = new dynamodb.Table(scope, 'ChatbotTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

       this.documentTable = new dynamodb.Table(scope, 'DocumentTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },  // Document ID
      sortKey: { name: 'projectId', type: dynamodb.AttributeType.STRING }, // Project ID
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Add a GSI to support querying by chatbotId
    this.documentTable.addGlobalSecondaryIndex({
      indexName: 'ChatbotIndex',
      partitionKey: { name: 'chatbotId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.userTable = new dynamodb.Table(scope, 'UserTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.userTable.addGlobalSecondaryIndex({
      indexName: 'SocialLoginIndex',
      partitionKey: { name: 'socialProvider', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'socialId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.userTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.userTable.addGlobalSecondaryIndex({
      indexName: 'SubscriptionStatusIndex',
      partitionKey: { name: 'subscriptionStatus', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.projectTable = new dynamodb.Table(scope, 'ProjectTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.apiKeyTable = new dynamodb.Table(scope, 'ApiKeyTable', {
      partitionKey: { name: 'chatbotId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'apiKeyId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
