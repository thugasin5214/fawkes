#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";

const app = new cdk.App();

// 获取环境参数
const environment = app.node.tryGetContext("env") || "dev";

// 验证环境值
if (!["dev", "staging", "prod"].includes(environment)) {
  throw new Error(
    `Invalid environment: ${environment}. Must be one of: dev, staging, prod`,
  );
}

// 创建Stack
new ApiStack(app, `ProductFactoryApi-${environment}`, {
  environment: environment as "dev" | "staging" | "prod",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "us-east-1",
  },
  tags: {
    Environment: environment,
    Project: "ProductFactory",
  },
});
