import { subscribe } from './subscription';
import { lookup } from "./lookup";

export const handleAddToSpace = (body) => {
  return {
    text: 'handleAddToSpace ' + body.message.sender.displayName
  }
}

export const handleMessage = async (body) => {
  const [ _, action, type, value ] = body.message.text.split(' ');
  if (action && action.toLowerCase() === 'subscribe') {
    return await subscribe(body, type, value);
  }
  if (action && action.toLowerCase() === 'lookup') {
    return await lookup(body, type, value);
  }
  return {
    "cards": [
      {
        "sections": [
          {
            "widgets": [
              {
                "image": { "imageUrl": "https://andrews-jibot-images.s3.amazonaws.com/2059171460.jpg" }
              },
            ]
          },
          {
            "widgets": [
              {
                "textParagraph":{
                  "text": JSON.stringify(body.message),
                }
                
              }
            ]
          },

        ]
      }
    ]
  }
};

export const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  };
}