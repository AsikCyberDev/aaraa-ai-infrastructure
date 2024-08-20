import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { LambdaSetup } from './lambda-setup';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class ApiGatewaySetup {
  public readonly apiDomain: apigateway.DomainName;

  constructor(scope: Construct, lambdaSetup: LambdaSetup, certificate: acm.ICertificate) {
    const graphqlApi = new apigateway.RestApi(scope, 'GraphqlApi', {
      restApiName: 'GraphQL Service',
      description: 'This service serves as the GraphQL API endpoint.',
      deployOptions: {
        stageName: 'prod',
      },
    });

    const graphqlIntegration = new apigateway.LambdaIntegration(lambdaSetup.graphqlLambda);

    graphqlApi.root.addMethod('POST', graphqlIntegration);

    // Custom Domain Name for API Gateway
    this.apiDomain = new apigateway.DomainName(scope, 'ApiDomainName', {
      domainName: 'api.chatbots.aaraa.ai',
      certificate,
      endpointType: apigateway.EndpointType.EDGE,
    });

    this.apiDomain.addBasePathMapping(graphqlApi, {
      basePath: 'api',
      stage: graphqlApi.deploymentStage,
    });
  }
}
