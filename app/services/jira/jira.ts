import axios from 'axios'
import { HttpBaseOptions } from './constants';

const getTicketDetails = (ticketId, authOptions) => {
    return new Promise((resolve, reject) => {
        axios.get(
            {
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

module.exports = {
    getProjectKeyMapping,
    getTicketDetails,
    parseJiraTickets,
    updateTicketLabel
};
