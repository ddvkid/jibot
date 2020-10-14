import { Handler } from 'aws-lambda';
import { handleAddToSpace, handleCardClick, handleMessage } from "./services/message";
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
}

export const lookup: Handler = (event: any) => {
  const dynamoDb = new DynamoDB();
  const params = {
    TableName: "activities"
  }
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

const baseOptions = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    ContentType: 'application/json'
  },
  json: true
};

const getTicketDetails = (ticketId, authOptions) => {
  return new Promise((resolve, reject) => {
    request(
      {
        ...baseOptions,
        ...authOptions,
        url: `https://rokton.atlassian.net/rest/api/3/issue/${ticketId}`
      },
      (error, response, body) => {
        if (error) {
          throw new Error('Error occurred sending network request.');
        }

        // Not found ticket falls back to release message
        if (response.statusCode === 404) {
          const data = {
            isFound: false,
            key: ticketId
          };

          return resolve(data);
        }

        if (response.statusCode !== 200) {
          throw new Error(`Error retrieving Jira ticket: ${JSON.stringify(body, null, 2)}`);
        }

        const {
          id,
          key,
          fields: {
            summary,
            issuetype: { name: issueType },
            project: { id: projectId, name: projectName, key: projectKey },
            reporter: { accountId: reportedById, name: reportedBy, displayName: reportedByName }
          }
        } = body;

        const data = {
          isFound: true,
          id,
          key,
          summary,
          issueType,
          projectId,
          projectName,
          projectKey,
          reportedBy,
          reportedByName,
          reportedByUrl: `https://rokton.atlassian.net/jira/people/${reportedById}`
        };
        resolve(data);
      }
    );
  });
};
