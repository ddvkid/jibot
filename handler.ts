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
    let text;
    switch (payload.type) {
      case 'ADDED_TO_SPACE':
        text = handleAddToSpace(payload);
        break;
      case 'MESSAGE':
        text = handleMessage(payload);
        break;
      case 'CARD_CLICKED':
        text = handleCardClick(payload);
        break;
    }
    response = {
      statusCode: 200,
      body: JSON.stringify(
        {
          text: text
        }
      ),
    };
  }
  console.log(response);

  return response;
}

const handleAddToSpace = (body) => {
  return 'handleAddToSpace' + body.message.sender.displayName;
}

const handleMessage = (body) => {
  return 'handleMessage' + body.message.sender.displayName;
}

const handleCardClick = (body) => {
  return 'handleCardClick' + body.message.sender.displayName;
}