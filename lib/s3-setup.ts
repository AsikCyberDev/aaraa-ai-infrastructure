import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class S3Setup {
  public readonly websiteBucket: s3.Bucket;
  public readonly oai: cloudfront.OriginAccessIdentity;
  public readonly documentBucket: s3.Bucket;

  constructor(scope: Construct) {
    // Website S3 Bucket and CloudFront OAI setup
    this.websiteBucket = new s3.Bucket(scope, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.oai = new cloudfront.OriginAccessIdentity(scope, 'OAI');

    this.websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [this.websiteBucket.arnForObjects('*')],
        principals: [new iam.CanonicalUserPrincipal(this.oai.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      })
    );

    // Document S3 Bucket setup for file uploads
    this.documentBucket = new s3.Bucket(scope, 'DocumentBucket', {
      versioned: true,  // Enable versioning (optional)
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Retain bucket on stack deletion
      autoDeleteObjects: false, // Do not automatically delete objects on stack deletion
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // Block all public access
      enforceSSL: true, // Enforce SSL connections
    });

    // Add a policy statement to allow the Lambda function to read/write/delete objects in the bucket
    this.documentBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        resources: [this.documentBucket.arnForObjects('*')],
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
      })
    );
  }
}
