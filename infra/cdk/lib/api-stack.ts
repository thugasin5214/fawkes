import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

interface ApiStackProps extends cdk.StackProps {
  environment: "dev" | "staging" | "prod";
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  public readonly todosTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { environment } = props;

    // ============================================
    // DynamoDB Table
    // ============================================
    this.todosTable = new dynamodb.Table(this, "TodosTable", {
      tableName: `todos-${environment}`,
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy:
        environment === "prod"
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
    });

    // ============================================
    // Lambda Functions
    // ============================================
    const runtime = lambda.Runtime.NODEJS_20_X;
    const code = lambda.Code.fromAsset("../services/backend/dist");
    const commonEnv = {
      TODOS_TABLE_NAME: this.todosTable.tableName,
      NODE_OPTIONS: "--enable-source-maps",
    };

    // Health check
    const healthHandler = new lambda.Function(this, "HealthHandler", {
      runtime,
      code,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: commonEnv,
      functionName: `health-${environment}`,
      handler: "health.handler",
    });

    // Todo handlers
    const todoListHandler = new lambda.Function(this, "TodoListHandler", {
      runtime,
      code,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: commonEnv,
      functionName: `todo-list-${environment}`,
      handler: "todo.listHandler",
    });

    const todoCreateHandler = new lambda.Function(this, "TodoCreateHandler", {
      runtime,
      code,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: commonEnv,
      functionName: `todo-create-${environment}`,
      handler: "todo.createHandler",
    });

    const todoGetHandler = new lambda.Function(this, "TodoGetHandler", {
      runtime,
      code,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: commonEnv,
      functionName: `todo-get-${environment}`,
      handler: "todo.getHandler",
    });

    const todoUpdateHandler = new lambda.Function(this, "TodoUpdateHandler", {
      runtime,
      code,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: commonEnv,
      functionName: `todo-update-${environment}`,
      handler: "todo.updateHandler",
    });

    const todoDeleteHandler = new lambda.Function(this, "TodoDeleteHandler", {
      runtime,
      code,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: commonEnv,
      functionName: `todo-delete-${environment}`,
      handler: "todo.deleteHandler",
    });

    // Grant DynamoDB permissions
    this.todosTable.grantReadWriteData(todoListHandler);
    this.todosTable.grantReadWriteData(todoCreateHandler);
    this.todosTable.grantReadWriteData(todoGetHandler);
    this.todosTable.grantReadWriteData(todoUpdateHandler);
    this.todosTable.grantReadWriteData(todoDeleteHandler);

    // ============================================
    // API Gateway
    // ============================================
    this.api = new apigateway.RestApi(this, "Api", {
      restApiName: `fawkes-api-${environment}`,
      description: "Fawkes API",
      deployOptions: {
        stageName: environment,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    // Health endpoint
    const health = this.api.root.addResource("health");
    health.addMethod("GET", new apigateway.LambdaIntegration(healthHandler));

    // Todos endpoints
    const todos = this.api.root.addResource("todos");
    todos.addMethod("GET", new apigateway.LambdaIntegration(todoListHandler));
    todos.addMethod(
      "POST",
      new apigateway.LambdaIntegration(todoCreateHandler),
    );

    const todoById = todos.addResource("{id}");
    todoById.addMethod("GET", new apigateway.LambdaIntegration(todoGetHandler));
    todoById.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(todoUpdateHandler),
    );
    todoById.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(todoDeleteHandler),
    );

    // ============================================
    // Outputs
    // ============================================
    new cdk.CfnOutput(this, "ApiUrl", {
      value: this.api.url,
      description: "API Gateway URL",
    });

    new cdk.CfnOutput(this, "TodosTableName", {
      value: this.todosTable.tableName,
      description: "DynamoDB Table Name",
    });
  }
}
