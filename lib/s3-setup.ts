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

     this.documentBucket = new s3.Bucket(scope, 'DocumentBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.PUT],
          allowedOrigins: ['*'],  // In production, replace with your specific origins
          allowedHeaders: ['*'],
        },
      ],
    });

    this.documentBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        resources: [this.documentBucket.arnForObjects('*')],
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
      })
    );

    new cdk.CfnOutput(scope, 'DocumentBucketName', {
      value: this.documentBucket.bucketName,
      description: 'Name of the S3 bucket for document storage',
      exportName: 'DocumentBucketName',
    });
  }
}