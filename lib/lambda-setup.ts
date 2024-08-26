import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DynamoDBSetup } from './dynamodb-setup';
import { S3Setup } from './s3-setup';

export class LambdaSetup {
  public readonly graphqlLambda: lambda.Function;

  constructor(scope: Construct, dynamoDBSetup: DynamoDBSetup, s3Setup: S3Setup) {
    // Define the Lambda function
    this.graphqlLambda = new lambda.Function(scope, 'GraphqlLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: Duration.minutes(10),
      code: lambda.Code.fromAsset('graphql-gateway'),
      handler: 'src/index.handler',
      environment: {
        CHATBOT_TABLE_NAME: dynamoDBSetup.chatbotTable.tableName,
        DOCUMENT_TABLE_NAME: dynamoDBSetup.documentTable.tableName,
        USER_TABLE_NAME: dynamoDBSetup.userTable.tableName,
        PROJECT_TABLE_NAME: dynamoDBSetup.projectTable.tableName,
        APIKEY_TABLE_NAME: dynamoDBSetup.apiKeyTable.tableName,
        JWT_SECRET: 'your_secret_key',
        S3_BUCKET_NAME: s3Setup.documentBucket.bucketName,
      },
    });

    // Grant Lambda function permissions to interact with DynamoDB tables
    dynamoDBSetup.chatbotTable.grantReadWriteData(this.graphqlLambda);
    dynamoDBSetup.documentTable.grantReadWriteData(this.graphqlLambda);
    dynamoDBSetup.userTable.grantReadWriteData(this.graphqlLambda);
    dynamoDBSetup.projectTable.grantReadWriteData(this.graphqlLambda);
    dynamoDBSetup.apiKeyTable.grantReadWriteData(this.graphqlLambda);

    // Grant Lambda function permissions to interact with the S3 bucket
    s3Setup.documentBucket.grantReadWrite(this.graphqlLambda);

   // Add permissions for S3 pre-signed URL generation
    this.graphqlLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3:PutObject', 's3:GetObject'],
        resources: [s3Setup.documentBucket.arnForObjects('*')],
      })
    );

    // Grant Lambda function permission to use KMS for S3 encryption (if using SSE-KMS)
    if (s3Setup.documentBucket.encryptionKey) {
      s3Setup.documentBucket.encryptionKey.grantEncryptDecrypt(this.graphqlLambda);
    }
  }
}