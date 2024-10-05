#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "../lib/pipeline-stack";
import { Region } from "../constants";
import { AWS_ACCOUNT } from "../configuration";

const app = new cdk.App();
new PipelineStack(app, "PipelineStack", { env: { region: Region.IAD, account: AWS_ACCOUNT } });
