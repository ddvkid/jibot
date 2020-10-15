import { getTicketDetails } from "./jira";
import { getAccountInfo } from "./account";

export const lookup = async (body, type, value) => {
  switch (type.toLowerCase()) {
    case 'jira':
      return await handleJira(value);
    case 'account':
      return await handleAccount(value);
  }
};

const handleJira = async (ticketNumber) => {
  if (!new RegExp('([a-zA-Z]{2,4}-\\d+)', 'g').test(ticketNumber)) {
    return {
      text: 'Invalid ticket number!',
    };
  }
  console.log(ticketNumber);
  const ticketDetails = await getTicketDetails(ticketNumber);
  console.log(ticketDetails.data);
  const fields = ticketDetails.data.fields;
  return {
    "cards": [
      {
        "header": {
          "title": fields.summary,
          "subtitle": ticketDetails.data.key,
          "imageUrl": "https://wac-cdn.atlassian.com/dam/jcr:b544631f-b225-441b-9e05-57b7fd0d495b/Jira%20Software@2x-icon-blue.png"
        },
        "sections": [
          {
            "widgets": [
              {
                "keyValue": {
                  "topLabel": "Ticket Number",
                  "content": ticketNumber
                }
              },
              {
                "keyValue": {
                  "topLabel": "Status",
                  "content": fields.status.name
                }
              },
              {
                "keyValue": {
                  "topLabel": "Type",
                  "content": fields.issuetype.name
                }
              },
              {
                "keyValue": {
                  "topLabel": "Priority",
                  "content": fields.priority.name
                }
              },
            ]
          },
          {
            "header": "Description",
            "widgets": [
              {
                "textParagraph": {
                  "text": fields.description
                }
              }
            ]
          },
          {
            "widgets": [
              {
                "buttons": [
                  {
                    "textButton": {
                      "text": "OPEN TICKET",
                      "onClick": {
                        "openLink": {
                          "url": ticketDetails.data.self
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
};

const handleAccount = async (accountId) => {
  const accountInfo = await getAccountInfo(accountId);
  return {
    text: JSON.stringify(accountInfo),
  };
};