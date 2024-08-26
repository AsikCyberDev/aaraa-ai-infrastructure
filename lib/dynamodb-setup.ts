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
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Keep the existing GSI
    this.documentTable.addGlobalSecondaryIndex({
      indexName: 'ChatbotIndex',
      partitionKey: { name: 'chatbotId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Add the new GSI
    this.documentTable.addGlobalSecondaryIndex({
      indexName: 'ChatbotIndexV2',
      partitionKey: { name: 'chatbotId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'uploadDate', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

     // Add GSI for querying by projectId
    this.documentTable.addGlobalSecondaryIndex({
      indexName: 'ProjectIndex',
      partitionKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'uploadDate', type: dynamodb.AttributeType.STRING },
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

    // Output the document table name
    new cdk.CfnOutput(scope, 'DocumentTableName', {
      value: this.documentTable.tableName,
      description: 'Name of the DynamoDB table for document storage',
      exportName: 'DocumentTableName',
    });
  }
}