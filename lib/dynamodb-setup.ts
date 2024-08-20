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
      tableName: 'Chatbots',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.documentTable = new dynamodb.Table(scope, 'DocumentTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'chatbotId', type: dynamodb.AttributeType.STRING },
      tableName: 'Documents',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.userTable = new dynamodb.Table(scope, 'UserTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'Users',
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
      tableName: 'Projects',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.apiKeyTable = new dynamodb.Table(scope, 'ApiKeyTable', {
      partitionKey: { name: 'chatbotId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'apiKeyId', type: dynamodb.AttributeType.STRING },
      tableName: 'ApiKeys',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
