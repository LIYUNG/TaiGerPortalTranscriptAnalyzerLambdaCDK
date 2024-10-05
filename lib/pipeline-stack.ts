import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Stack, StackProps, SecretValue } from "aws-cdk-lib";
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import { Construct } from "constructs";
import {
    GITHUB_CDK_REPO,
    GITHUB_OWNER,
    GITHUB_PACKAGE_BRANCH,
    GITHUB_REPO,
    GITHUB_TOKEN
} from "../configuration/dependencies";
import { PipelineAppStage } from "./app-stage";
import { STAGES } from "../constants";

export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Define the source for the pipeline
        const source = CodePipelineSource.gitHub(
            `${GITHUB_OWNER}/${GITHUB_CDK_REPO}`,
            GITHUB_PACKAGE_BRANCH,
            {
                authentication: SecretValue.secretsManager(GITHUB_TOKEN),
                trigger: codepipeline_actions.GitHubTrigger.WEBHOOK
            }
        );

        const python_source = CodePipelineSource.gitHub(
            `${GITHUB_OWNER}/${GITHUB_REPO}`,
            GITHUB_PACKAGE_BRANCH,
            {
                authentication: SecretValue.secretsManager(GITHUB_TOKEN),
                trigger: codepipeline_actions.GitHubTrigger.WEBHOOK
            }
        );

        // Building Lambda
        const lambdaBuildStep = new CodeBuildStep("BuildLambda", {
            buildEnvironment: {
                buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
            },
            input: python_source,
            commands: ["variouscommands"],
            partialBuildSpec: codebuild.BuildSpec.fromObject({
                phases: {
                    install: {
                        "runtime-versions": {
                            python: "3.9"
                        },
                        commands: ["python --version"]
                    }
                }
            })
        });

        // Create the high-level CodePipeline
        const pipeline = new CodePipeline(this, "Pipeline", {
            pipelineName: "TaiGerPortalTranscriptAnalyzerPipeline",
            synth: new ShellStep("Synth", {
                input: source,
                additionalInputs: { lambda: lambdaBuildStep.addOutputDirectory("lambda") },
                commands: ["npm ci", "npm run build", "npx cdk synth", "ls -a ../handlers"]
            })
        });

        STAGES.forEach(({ stageName, env }) => {
            pipeline.addStage(
                new PipelineAppStage(this, `${stageName}-TaiGerPortalTranscriptAnalyzerLambda`, {
                    env
                })
            );
        });
    }
}
