const { google } = require('googleapis');
const chat = google.chat('v1');

export async function sendMessage(parent, text) {
    const auth = new google.auth.GoogleAuth({
        keyFile: './g-key.json',
        scopes: ['https://www.googleapis.com/auth/chat.bot']
    })
    const authClient = await auth.getClient();
    google.options({auth: authClient});
    await chat.spaces.messages.create({
        parent,
        requestBody: {
            text,
        }
    });
}
