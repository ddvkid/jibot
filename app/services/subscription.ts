import AWS, { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";

export const subscribe = async (payload: any) => {
  console.log(payload);

  // // Create the DynamoDB service object
  // const ddb = new DynamoDB({ apiVersion: "2012-08-10" });

  // var params = {
  //   TableName: "jibot-subscription",
  //   Item: {
  //     id: { S: v4() },
  //     user: { S: payload.message.sender.displayName },
  //   },
  // };

  // // Call DynamoDB to add the item to the table
  // try {
  //   await ddb.putItem(params).promise();
  // } catch (e) {
  //   console.log(e);
  // }

  return { text: "subscribed!!" };
};