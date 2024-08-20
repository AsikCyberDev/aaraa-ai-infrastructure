import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';


export class S3Setup {
  public readonly websiteBucket: s3.Bucket;
  public readonly oai: cloudfront.OriginAccessIdentity;

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
  }
}
