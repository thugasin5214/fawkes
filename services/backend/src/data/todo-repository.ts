import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import type { Todo } from "@repo/schemas";

// 初始化DynamoDB客户端
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
  }),
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TODOS_TABLE_NAME || "todos";

/**
 * Todo Repository
 * 处理DynamoDB数据访问
 *
 * Table Schema:
 * - PK: USER#<userId>
 * - SK: TODO#<todoId>
 */
export const TodoRepository = {
  /**
   * 创建Todo
   */
  async create(todo: Todo): Promise<void> {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: `USER#${todo.userId}`,
          SK: `TODO#${todo.id}`,
          ...todo,
        },
      }),
    );
  },

  /**
   * 根据ID查找Todo
   */
  async findById(userId: string, todoId: string): Promise<Todo | null> {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: `TODO#${todoId}`,
        },
      }),
    );

    if (!result.Item) {
      return null;
    }

    // 移除DynamoDB的PK/SK，返回干净的Todo对象
    const { PK: _pk, SK: _sk, ...todo } = result.Item;
    return todo as Todo;
  },

  /**
   * 查找用户的所有Todos
   */
  async findByUserId(userId: string): Promise<Todo[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${userId}`,
          ":sk": "TODO#",
        },
      }),
    );

    return (result.Items || []).map((item) => {
      const { PK: _pk, SK: _sk, ...todo } = item;
      return todo as Todo;
    });
  },

  /**
   * 更新Todo
   */
  async update(todo: Todo): Promise<void> {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          PK: `USER#${todo.userId}`,
          SK: `TODO#${todo.id}`,
          ...todo,
        },
      }),
    );
  },

  /**
   * 删除Todo
   */
  async delete(userId: string, todoId: string): Promise<void> {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: `TODO#${todoId}`,
        },
      }),
    );
  },
};
