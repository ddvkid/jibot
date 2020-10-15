require('dotenv').config();
const axios = require('axios');
const AWS = require('aws-sdk');
const { google } = require('googleapis');

const chat = google.chat('v1');

// (async () => {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: '../g-key.json',
//     scopes: ['https://www.googleapis.com/auth/chat.bot']
//   })
//   const authClient = await auth.getClient();
//   google.options({auth: authClient});
//   const res = await chat.spaces.messages.create({
//     parent: "spaces/8yl_8QAAAAE",
//     requestBody: {
//       text: '我的头像牛逼吗'
//     }
//   });
//   console.log(res);
// })()
// const url = 'https://platform.stage.rokt.com/api/accounts/1/activity_users?daterangeTz=2020-10-07T00:00:00,2020-10-14T23:59:59';
const url = 'https://platform.stage.rokt.com/api/accounts/1';
axios.get(url, {headers: {'Authorization': `Bearer ${process.env.JWT}`}})
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.warn(error);
  });

// AWS.config.update({region: 'us-east-1'});
// const dynamoDb = new AWS.DynamoDB();
// const params = {
//   TableName: "jibot-subscription"
// }
// dynamoDb.scan(params, (err, data) => {
//   if (err) {
//     console.log(err, err.stack);
//     return {
//       statusCode: 500,
//       body: JSON.stringify(err.stack),
//     };
//   } else {
//     console.log(data);
//     return {
//       statusCode: 200,
//       body: JSON.stringify(data),
//     };
//   }
// });