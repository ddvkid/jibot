import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";

export const subscribe = async (type: string, payload: any, value: string) => {
  console.log(payload);

  // Create the DynamoDB service object
  const ddb = new DynamoDB({ apiVersion: "2012-08-10" });

  const params = {
    TableName: "jibot-subscription",
    Item: {
      id: { S: v4() },
      type: { S: type },
      thread: { S: payload.message.thread.name },
      value: { S: value}
    },
  };

  // Call DynamoDB to add the item to the table
  try {
    await ddb.putItem(params).promise();
  } catch (e) {
    console.log(e);
  }

  return { text: "subscribed!!" };
};
