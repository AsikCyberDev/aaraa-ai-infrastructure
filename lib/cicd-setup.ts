import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';
import { S3Setup } from './s3-setup';


export class CICDPipelineSetup {
  constructor(scope: Construct, s3Setup: S3Setup) {
    const sourceOutput = new codepipeline.Artifact();
    const websiteBuildOutput = new codepipeline.Artifact();

    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'AsikCyberDev',
      repo: 'aaraa-ai-website',
      oauthToken: cdk.SecretValue.secretsManager('my-github-token'),
      output: sourceOutput,
      branch: 'main',
    });

    const websiteBuildProject = new codebuild.PipelineProject(scope, 'WebsiteBuildProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['npm install'],
          },
          build: {
            commands: ['npm run build'],
          },
        },
        artifacts: {
          'base-directory': 'build',
          files: '**/*',
        },
      }),
    });

    const buildAction = new codepipelineActions.CodeBuildAction({
      actionName: 'Website_Build',
      project: websiteBuildProject,
      input: sourceOutput,
      outputs: [websiteBuildOutput],
    });

    const deployAction = new codepipelineActions.S3DeployAction({
      actionName: 'S3_Deploy',
      bucket: s3Setup.websiteBucket,
      input: websiteBuildOutput,
    });

    new codepipeline.Pipeline(scope, 'WebsitePipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
        {
          stageName: 'Deploy',
          actions: [deployAction],
        },
      ],
    });
  }
}
