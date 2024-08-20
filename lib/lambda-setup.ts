import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DynamoDBSetup } from './dynamodb-setup';

export class LambdaSetup {
  public readonly graphqlLambda: lambda.Function;

  constructor(scope: Construct, dynamoDBSetup: DynamoDBSetup) {
    this.graphqlLambda = new lambda.Function(scope, 'GraphqlLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('graphql-gateway'),
      handler: 'src/index.handler',
      environment: {
        CHATBOT_TABLE_NAME: dynamoDBSetup.chatbotTable.tableName,
        DOCUMENT_TABLE_NAME: dynamoDBSetup.documentTable.tableName,
        USER_TABLE_NAME: dynamoDBSetup.userTable.tableName,
        PROJECT_TABLE_NAME: dynamoDBSetup.projectTable.tableName,
        APIKEY_TABLE_NAME: dynamoDBSetup.apiKeyTable.tableName,
      },
    });

    dynamoDBSetup.chatbotTable.grantReadWriteData(this.graphqlLambda);
    dynamoDBSetup.documentTable.grantReadWriteData(this.graphqlLambda);
    dynamoDBSetup.userTable.grantReadWriteData(this.graphqlLambda);
    dynamoDBSetup.projectTable.grantReadWriteData(this.graphqlLambda);
    dynamoDBSetup.apiKeyTable.grantReadWriteData(this.graphqlLambda);
  }
}
