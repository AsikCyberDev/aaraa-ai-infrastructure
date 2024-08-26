import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { ApiGatewaySetup } from './api-gateway-setup';
import { CICDPipelineSetup } from './cicd-setup';
import { CloudFrontSetup } from './cloudfront-setup';
import { DynamoDBSetup } from './dynamodb-setup';
import { LambdaSetup } from './lambda-setup';
import { Route53Setup } from './route53-setup';
import { S3Setup } from './s3-setup';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the hosted zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'aaraa.ai',
    });

    // Create a TLS/SSL certificate for the domain
    const certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: 'chatbots.aaraa.ai',
      subjectAlternativeNames: ['api.chatbots.aaraa.ai'],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const s3Setup = new S3Setup(this);
    const dynamoDBSetup = new DynamoDBSetup(this);

    // Create a role for the Lambda function
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // Grant the role permissions to access CloudWatch Logs
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

    const lambdaSetup = new LambdaSetup(this, dynamoDBSetup, s3Setup);

    // Add permissions for S3 pre-signed URL generation
    lambdaSetup.graphqlLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3:PutObjectAcl', 's3:GetObjectAcl'],
        resources: [s3Setup.documentBucket.arnForObjects('*')],
      })
    );

    const apiGatewaySetup = new ApiGatewaySetup(this, lambdaSetup, certificate);
    const cloudFrontSetup = new CloudFrontSetup(this, s3Setup, apiGatewaySetup, certificate);
    new Route53Setup(this, cloudFrontSetup, apiGatewaySetup, hostedZone);
    new CICDPipelineSetup(this, s3Setup);

    // Generate a unique identifier for this deployment
    const uniqueId = cdk.Names.uniqueId(this);

    // Output the names of important resources with unique names
    new cdk.CfnOutput(this, `DocumentBucketName${uniqueId}`, {
      value: s3Setup.documentBucket.bucketName,
      description: 'Name of the S3 bucket for document storage',
      exportName: `DocumentBucketName-${uniqueId}`,
    });

    new cdk.CfnOutput(this, `DocumentTableName${uniqueId}`, {
      value: dynamoDBSetup.documentTable.tableName,
      description: 'Name of the DynamoDB table for document storage',
      exportName: `DocumentTableName-${uniqueId}`,
    });
  }
}