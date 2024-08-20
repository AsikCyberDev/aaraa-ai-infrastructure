import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { ApiGatewaySetup } from './api-gateway-setup';
import { CloudFrontSetup } from './cloudfront-setup';

export class Route53Setup {
  constructor(scope: Construct, cloudFrontSetup: CloudFrontSetup, apiGatewaySetup: ApiGatewaySetup, hostedZone: route53.IHostedZone) {
    // Route 53 A record to point to the CloudFront distribution
    new route53.ARecord(scope, 'WebsiteAliasRecord', {
      recordName: 'chatbots',
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(cloudFrontSetup.distribution)),
      zone: hostedZone,
    });

    // Route 53 A record to point to the API Gateway custom domain
    new route53.ARecord(scope, 'ApiAliasRecord', {
      recordName: 'api.chatbots',
      target: route53.RecordTarget.fromAlias(new route53Targets.ApiGatewayDomain(apiGatewaySetup.apiDomain)),
      zone: hostedZone,
    });
  }
}
