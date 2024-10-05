import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";

export class LambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new Function(this, "TaiGerPortalTranscriptAnalyzerLambdaFunction", {
            runtime: Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset("handlers"), // Pointing to the lambda code directory
            handler: "lambda_function.lambda_handler"
        });
    }
}
