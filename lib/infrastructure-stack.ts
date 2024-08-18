import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for website
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false, // Ensure direct public access is not allowed
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create an Origin Access Identity (OAI) for CloudFront to access S3
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');

    // Attach a bucket policy to allow CloudFront to read from S3
    websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [websiteBucket.arnForObjects('*')],
        principals: [new iam.CanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      })
    );

    // DynamoDB Tables
    const chatbotTable = new dynamodb.Table(this, 'ChatbotTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'Chatbots',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const documentTable = new dynamodb.Table(this, 'DocumentTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'Documents',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda Function for GraphQL Server
    const graphqlLambda = new lambda.Function(this, 'GraphqlLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('graphql-gateway'),
      handler: 'src/index.handler',
      environment: {
        CHATBOT_TABLE_NAME: chatbotTable.tableName,
        DOCUMENT_TABLE_NAME: documentTable.tableName,
      },
    });

    // Grant Lambda permissions to access DynamoDB tables
    chatbotTable.grantReadWriteData(graphqlLambda);
    documentTable.grantReadWriteData(graphqlLambda);

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

    // API Gateway for GraphQL
    const graphqlApi = new apigateway.RestApi(this, 'GraphqlApi', {
      restApiName: 'GraphQL Service',
      description: 'This service serves as the GraphQL API endpoint.',
      deployOptions: {
        stageName: 'prod',
      },
    });

    const graphqlIntegration = new apigateway.LambdaIntegration(graphqlLambda);
    graphqlApi.root.addMethod('POST', graphqlIntegration);

    // Custom Domain Name for API Gateway
    const apiDomain = new apigateway.DomainName(this, 'ApiDomainName', {
      domainName: 'api.chatbots.aaraa.ai',
      certificate,
      endpointType: apigateway.EndpointType.EDGE,
    });

    apiDomain.addBasePathMapping(graphqlApi, {
      basePath: 'api',
      stage: graphqlApi.deploymentStage,
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultRootObject: 'index.html',
      domainNames: ['chatbots.aaraa.ai'],
      certificate,
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(websiteBucket, { originAccessIdentity: oai }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new cloudfrontOrigins.HttpOrigin(`${graphqlApi.restApiId}.execute-api.${this.region}.amazonaws.com`, {
            originPath: '/prod',
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL, // Allow all methods: GET, POST, etc.
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED, // Disable caching for API responses
        },
      },
    });

    // Route 53 A record to point to the CloudFront distribution
    new route53.ARecord(this, 'WebsiteAliasRecord', {
      recordName: 'chatbots',
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
      zone: hostedZone,
    });

    // Route 53 A record to point to the API Gateway custom domain
    new route53.ARecord(this, 'ApiAliasRecord', {
      recordName: 'api.chatbots',
      target: route53.RecordTarget.fromAlias(new route53Targets.ApiGatewayDomain(apiDomain)),
      zone: hostedZone,
    });

    // CI/CD Pipeline
    const sourceOutput = new codepipeline.Artifact();
    const infraBuildOutput = new codepipeline.Artifact();

    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'AsikCyberDev', // Replace with your GitHub username
      repo: 'aaraa-ai-infrastructure', // Replace with your infra repo name
      oauthToken: cdk.SecretValue.secretsManager('my-github-token'), // Store GitHub token in Secrets Manager
      output: sourceOutput,
      branch: 'main', // Replace with your branch name
    });

    // Add a new build project for synthesizing the CDK infrastructure stack
    const cdkBuildProject = new codebuild.PipelineProject(this, 'CdkBuildProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'npm install -g aws-cdk',
              'npm install',
            ],
          },
          build: {
            commands: [
              'npx cdk synth',
            ],
          },
        },
        artifacts: {
          'base-directory': 'cdk.out',
          files: '**/*',
        },
      }),
    });

    // Add the build action for the infrastructure stack
    const infraBuildAction = new codepipelineActions.CodeBuildAction({
      actionName: 'Infrastructure_CDK_Build',
      project: cdkBuildProject,
      input: sourceOutput,
      outputs: [infraBuildOutput],
    });

    // Add deploy action to create/update CloudFormation stack from the synthesized template
    const infraDeployAction = new codepipelineActions.CloudFormationCreateUpdateStackAction({
      actionName: 'Infrastructure_CFN_Deploy',
      templatePath: infraBuildOutput.atPath('InfrastructureStack.template.json'),
      stackName: 'InfrastructureStack',
      adminPermissions: true,
    });

    // Create the pipeline and add stages
    new codepipeline.Pipeline(this, 'InfrastructurePipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [infraBuildAction],
        },
        {
          stageName: 'Deploy',
          actions: [infraDeployAction],
        },
      ],
    });
  }
}
