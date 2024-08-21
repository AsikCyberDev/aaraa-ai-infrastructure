import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
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
    const lambdaSetup = new LambdaSetup(this, dynamoDBSetup, s3Setup);
    const apiGatewaySetup = new ApiGatewaySetup(this, lambdaSetup, certificate);
    const cloudFrontSetup = new CloudFrontSetup(this, s3Setup, apiGatewaySetup, certificate);
    new Route53Setup(this, cloudFrontSetup, apiGatewaySetup, hostedZone);
    new CICDPipelineSetup(this, s3Setup);
  }
}
