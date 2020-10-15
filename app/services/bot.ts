

export const formatTicketCard = (ticketInfo: any): Message => {
  return {
    cards: [
      {
        header: {
          title: 'Refactor nr-summarised-multi-selector',
          subtitle: 'OPC-948',
          imageUrl: 'https://wac-cdn.atlassian.com/dam/jcr:b544631f-b225-441b-9e05-57b7fd0d495b/Jira%20Software@2x-icon-blue.png'
        },
        sections: [
          {
            widgets: [
              {
                keyValue: {
                  topLabel: 'Ticket Number',
                  content: 'OPC-948'
                }
              },
              {
                keyValue: {
                  topLabel: 'Status',
                  content: 'In progress'
                }
              },
              {
                keyValue: {
                  topLabel: 'Type',
                  content: 'story'
                }
              },
              {
                keyValue: {
                  topLabel: 'Priority',
                  content: 'Minor'
                }
              },
              {
                keyValue: {
                  topLabel: 'Sprint',
                  content: '[OP Core] Sprint 171'
                }
              }
            ]
          },
          {
            header: 'Description',
            widgets: [
              {
                textParagraph: {
                  text: 'There are multiple issues with nr-summarised-multi-selector.This component is used in many placed across One Platform.'
                }
              }
            ]
          },
          {
            header: 'Acceptance Criteria',
            widgets: [
              {
                textParagraph: {
                  text: 'Component ‘refreshes’ correctly. No longer causes duplicate actions when initialised. (e.g., performance API not called twice initially). Component UI/text aligned centred. No other functional changes to the component.'
                }
              }
            ]
          },
          {
            widgets: [
              {
                buttons: [
                  {
                    textButton: {
                      text: 'OPEN TICKET',
                      onClick: {
                        openLink: {
                          url: 'https://rokton.atlassian.net/browse/OPC-948'
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
    ],
  };
};


export const formatAccountCard = (accountInfo: any): Message => {
  return {
    cards: [],
  };
};


export interface Message {
  cards: Card[];
}

export interface Card {
  header: Header;
  sections: Section[];
}

export interface Header {
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface Section {
  header?: string;
  widgets: Widget[];
}

export interface Widget {
  keyValue?: {
    topLabel: string;
    content: string;
  };
  textParagraph?: {
    text: string;
  };
  buttons?: Button[];
}

export interface Button {
  textButton?: {
    text: string;
    onClick?: {
      openLink: {
        url: string;
      };
    };
  };
}

export const message = {
  'cards': [
    {
      'header': {
        'title': 'Refactor nr-summarised-multi-selector',
        'subtitle': 'OPC-948',
        'imageUrl': 'https://wac-cdn.atlassian.com/dam/jcr:b544631f-b225-441b-9e05-57b7fd0d495b/Jira%20Software@2x-icon-blue.png'
      },
      'sections': [
        {
          'widgets': [
            {
              'keyValue': {
                'topLabel': 'Ticket Number',
                'content': 'OPC-948'
              }
            },
            {
              'keyValue': {
                'topLabel': 'Status',
                'content': 'In progress'
              }
            },
            {
              'keyValue': {
                'topLabel': 'Type',
                'content': 'story'
              }
            },
            {
              'keyValue': {
                'topLabel': 'Priority',
                'content': 'Minor'
              }
            },
            {
              'keyValue': {
                'topLabel': 'Sprint',
                'content': '[OP Core] Sprint 171'
              }
            }
          ]
        },
        {
          'header': 'Description',
          'widgets': [
            {
              'textParagraph': {
                'text': 'There are multiple issues with nr-summarised-multi-selector.This component is used in many placed across One Platform.'
              }
            }
          ]
        },
        {
          'header': 'Acceptance Criteria',
          'widgets': [
            {
              'textParagraph': {
                'text': 'Component ‘refreshes’ correctly. No longer causes duplicate actions when initialised. (e.g., performance API not called twice initially). Component UI/text aligned centred. No other functional changes to the component.'
              }
            }
          ]
        },
        {
          'widgets': [
            {
              'buttons': [
                {
                  'textButton': {
                    'text': 'OPEN TICKET',
                    'onClick': {
                      'openLink': {
                        'url': 'https://rokton.atlassian.net/browse/OPC-948'
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
