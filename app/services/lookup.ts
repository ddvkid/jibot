import { getTicketDetails } from "./jira";
import { getProxyData } from "./proxy";

export const lookup = async (body, type, value, isSub?) => {
  switch (type.toLowerCase()) {
    case 'jira':
      return await handleJira(value, isSub);
    default:
      return await handleType(type.toLowerCase(), value);
  }
};

const handleJira = async (ticketNumber, isSub?) => {
  if (!new RegExp('([a-zA-Z]{2,4}-\\d+)', 'g').test(ticketNumber)) {
    return {
      text: 'Invalid ticket number!',
    };
  }
  console.log(ticketNumber);
  const ticketDetails = await getTicketDetails(ticketNumber);
  console.log(ticketDetails.data);
  const fields = ticketDetails.data.fields;
  const title = isSub ? `Subscribe ticket ${ticketDetails.data.key} successfully!` : fields.summary;
  return {
    "cards": [
      {
        "header": {
          "title": title,
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
                          "url": `https://rokton.atlassian.net/browse/${ticketDetails.data.key}'`
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

const handleType = async (type, id) => {
  const data = await getProxyData(type, id);
  return createMessage(type, data);
}

const countriesById = {
  9: 'Australia',
  30: 'Canada',
  47: 'Denmark',
  58: 'Finland',
  60: 'France',
  44: 'Germany',
  81: 'India',
  79: 'Ireland',
  88: 'Japan',
  129: 'Netherlands',
  132: 'New Zealand',
  130: 'Norway',
  152: 'Singapore',
  56: 'Spain',
  151: 'Sweden',
  62: 'United Kingdom',
  177: 'United States',
};

const createMessage = (type, data) => {
  switch (type) {
    case 'account':
      return { 
        "cards": [
          {
            "header": {
              "title": data.name,
              "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Microsoft_Account.svg/1200px-Microsoft_Account.svg.png"
            },
            "sections": [
              {
                "widgets": [
                  {
                    "keyValue": {
                      "topLabel": "Account Country",
                      "content": countriesById[data.countryId]
                    }
                  },
                  {
                    "keyValue": {
                      "topLabel": "Account Timezone",
                      "content": data.timezone.name,
                      "contentMultiline": "true",
                    }
                  }
                ]
              },
              {
                "header": "<b><font color=\"black\">Company details</font></b>",
                "widgets": [
                  {
                    "keyValue": {
                      "topLabel": "Brand Name",
                      "content": data.brand
                    }
                  },
                  {
                    "keyValue": {
                      "topLabel": "Website Domain",
                      "content": data.websiteUrl
                    }
                  },
                  {
                    "keyValue": {
                      "topLabel": "Vertical",
                      "content": "Affiliates, Loyalty & Samples"
                    }
                  },
                  {
                    "keyValue": {
                      "topLabel": "Sub-vertical",
                      "content": "Comparison Sites"
                    }
                  }
                ]
              },
              {
                "header": "<b><font color=\"black\">Account Management</font></b>",
                "widgets": [
                  {
                    "keyValue": {
                      "topLabel": "Full Name",
                      "content": "James Bond"
                    }
                  },
                  {
                    "keyValue": {
                      "topLabel": "Email Address",
                      "content": "james.bond@rokt.com"
                    }
                  },
                  {
                    "keyValue": {
                      "topLabel": "Phone Number",
                      "content": "-"
                    }
                  }
                ]
              },
              {
                "header": "<b><font color=\"black\">Nurture Sender Domain</font></b>",
                "widgets": [
                  {
                    "keyValue": {
                      "topLabel": "Domain Name",
                      "content": "-"
                    }
                  }
                ]
              }
            ]
          }
        ]
      };
    case 'campaign':
      return { text: 'campaign' };
  }
}