import { Handler } from 'aws-lambda';
import { handleAddToSpace, handleCardClick, handleMessage } from './services/message';
import { DynamoDB } from 'aws-sdk';
import request from 'request';

export const bot: Handler = async (event: any) => {
  let response;
  if (event.httpMethod === 'GET' || !event.body) {
    response = {
      statusCode: 200,
      body: 'Hello! This function is meant to be used in a Hangouts Chat Room.'
    };
  } else {
    const payload = JSON.parse(event.body);
    let value;
    switch (payload.type) {
      case 'ADDED_TO_SPACE':
        value = handleAddToSpace(payload);
        break;
      case 'MESSAGE':
        value = await handleMessage(payload);
        break;
      case 'CARD_CLICKED':
        value = handleCardClick(payload);
        break;
    }
    response = {
      statusCode: 200,
      body: JSON.stringify(value),
    };
  }
  console.log(response);

  return response;
};

export const lookup: Handler = (event: any) => {
  const dynamoDb = new DynamoDB();
  const params = {
    TableName: 'activities',
  };
  dynamoDb.scan(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      return {
        statusCode: 500,
        body: JSON.stringify(err.stack),
      };
    } else {
      console.log(data);
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }
  });
};
