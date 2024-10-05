import { Construct } from "constructs";
import { LambdaStack } from "./lambda-stack";
import { Stage, StageProps } from "aws-cdk-lib";

export class PipelineAppStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const lambdaStack = new LambdaStack(this, "LambdaStack");
    }
}
