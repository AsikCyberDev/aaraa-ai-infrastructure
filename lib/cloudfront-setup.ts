import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import { S3Setup } from './s3-setup';
import { ApiGatewaySetup } from './api-gateway-setup';
import { Construct } from 'constructs';
import { Aws } from 'aws-cdk-lib';  // Import Aws to access the region

export class CloudFrontSetup {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, s3Setup: S3Setup, apiGatewaySetup: ApiGatewaySetup, certificate: any) {
    this.distribution = new cloudfront.Distribution(scope, 'WebsiteDistribution', {
      defaultRootObject: 'index.html',
      domainNames: ['chatbots.aaraa.ai'],
      certificate,
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(s3Setup.websiteBucket, { originAccessIdentity: s3Setup.oai }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new cloudfrontOrigins.HttpOrigin(`${apiGatewaySetup.apiDomain.domainName}.execute-api.${Aws.REGION}.amazonaws.com`, {
            originPath: '/prod',
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
      },
    });
  }
}
