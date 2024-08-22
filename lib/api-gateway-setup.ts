import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import { LambdaSetup } from './lambda-setup';

export class ApiGatewaySetup {
  public readonly apiDomain: apigateway.DomainName;

  constructor(scope: Construct, lambdaSetup: LambdaSetup, certificate: acm.ICertificate) {
    // Create the GraphQL API
    const graphqlApi = new apigateway.RestApi(scope, 'GraphqlApi', {
      restApiName: 'GraphQL Service',
      description: 'This service serves as the GraphQL API endpoint.',
      deployOptions: {
        stageName: 'prod',
      },
    });

    // Integrate the Lambda function with API Gateway
    const graphqlIntegration = new apigateway.LambdaIntegration(lambdaSetup.graphqlLambda);

    // Add POST method for handling GraphQL queries and mutations
    graphqlApi.root.addMethod('POST', graphqlIntegration);

    // Add GET method to support GraphQL Playground in the browser
    graphqlApi.root.addMethod('GET', graphqlIntegration);  // This enables the GET method for the Playground

    // Setup Custom Domain Name for API Gateway
    this.apiDomain = new apigateway.DomainName(scope, 'ApiDomainName', {
      domainName: 'api.chatbots.aaraa.ai',
      certificate,
      endpointType: apigateway.EndpointType.EDGE,
    });

    // Map the custom domain to the API Gateway stage
    this.apiDomain.addBasePathMapping(graphqlApi, {
      basePath: 'api',
      stage: graphqlApi.deploymentStage,
    });
  }
}
