import { Handler } from 'aws-lambda';

export const hello: Handler = async (event: any) => {
  console.log(event)
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
        value = handleMessage(payload);
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
}

const handleAddToSpace = (body) => {
  return {
    text: 'handleAddToSpace ' + body.message.sender.displayName
  }
}

const handleMessage = (body) => {
  return {
    text: 'handleMessage ' + JSON.stringify(body.message.sender)
  }
}

const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  }
}