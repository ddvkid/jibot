import { subscribe, unsubscribe } from './subscription';
import { lookup } from "./lookup";
import { getFoods } from "./food";

export const handleMessage = async (body) => {
  console.log(body);
  const args = body.message.text.split(' ');
  if (body.space?.type !== 'DM') args.shift();
  const [ action, type, value ] = args;
  switch (action && action.toLowerCase().trim()) {
    case 'subscribe':
      return await subscribe(body, type, value);
    case 'lookup':
      return await lookup(body, type, value);
    case 'lunch':
      const { data: { results } } = await getFoods() as any;
      const food = results[Math.floor(Math.random() * results.length)];
      const { geometry } = food;
      const central = `${geometry.location?.lat},${geometry.location?.lng}`;
      food.imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${central}&zoom=20&size=400x400&key=AIzaSyBWcOtEHyGy6SAmd7MzWfVQ1KayOecj9cA`;
      console.log('image is ', food.imageUrl);
      console.log('food is ', food);
      const result = {
        "cards": [
          {
            "header": {
              "title": food.name,
              "subtitle": `Rating:${food.rating}`,
              "imageUrl": "https://i.dailymail.co.uk/i/pix/2014/10/23/1414051439470_Image_galleryImage_Homer_Simpson_eating_a_do.JPG"
            },
            "sections": [
              {
                "widgets": [
                  {
                    "keyValue": {
                      "topLabel": "Address",
                      "content": food.vicinity
                    }
                  },
                  {
                    "keyValue": {
                      "topLabel": "Opening Hour",
                      "content": "Open now"
                    }
                  },
                  {
                    "keyValue": {
                      "topLabel": "Type",
                      "content": "Restaurant"
                    }
                  }
                ]
              },
              {
                "header": "Location",
                "widgets": [
                  {
                    "image": {
                      "imageUrl": food.imageUrl
                    }
                  }
                ]
              },
            ]
          }
        ]
      };
      console.log('result is ', result);
      return result;
    case 'surprise?':
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
      };
    case 'help':
    case undefined:
      return {
        text: "*Commands:*\n  - lookup\n - subscribe\n - unsubscribe\n *Types:*\n - jira\n - account\n - campaign\n For example: lookup jira *ticket-num*"
      };
    default:
      return {
        text: "Sorry this feature is not available on a free account, join us now with only $99/day!!! \"https://andrews-jibot-images.s3.amazonaws.com/2059171460.jpg\""
      }
  }
};

export const handleCardClick = (body) => {
  return {
    text: 'handleCardClick ' + body.message.sender.displayName
  };
};
