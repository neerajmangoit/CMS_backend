import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { PubSub } from '@google-cloud/pubsub';

import client from "twilio";
const accountSid = "AC74b51440371d71e84ec407a68bb009a2";
const authToken = "5f899dbd5fefaeaed0fc4a70ddc39457";
const clie = new client(accountSid, authToken);

import SearchName from '../models/nameSearchModel';
import AdminConfig from '../models/adminConfigModel';


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'src/core/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'src/core/credentials.json');

var pubSubClient = new PubSub();
var subscriptionNameOrId = 'projects/dauntless-brace-374905/subscriptions/get-email-notification';
const timeout = 9060;

/**
* Reads previously authorized credentials from the save file.
*
* @return {Promise<OAuth2Client|null>}
*/
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();

    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function listLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    const topicName = 'projects/dauntless-brace-374905/topics/get-email-notification'

    gmail.users.watch({
        userId: 'me',
        requestBody: {
            topicName: topicName,
            labelIds: ['INBOX', 'CHAT'],
            labelFilterAction: 'include'
        }
    }, (err, res) => {
        if (err) return console.log(`The API returned an error: ${err}`);
        console.log(`Push notification set up for topic: ${topicName}`);

        const lastNotification = res.data;
        // console.log(lastNotification);
    });

    // References an existing subscription
    const subscription = pubSubClient.subscription(subscriptionNameOrId);

    // Create an event handler to handle messages
    let messageCount = 0;

    const messageHandler = async message => {
        // console.log(`Received message ${message.id}:`);
        // console.log(`\tData: ${message.data}`);
        // console.log(`\tAttributes: ${message.attributes}`);
        messageCount += 1;
        message.ack();


        const messageList = gmail.users.messages.list({
            userId: 'me',
            maxResults: '1'
        }).then((thenData) => {
            const messageId = thenData.data.messages[0]['id'];

            gmail.users.messages.get({
                userId: 'me',
                id: messageId,
                format: 'full'
            }, async (err, res) => {
                if (err) return console.log("message", `The API returned an error: ${err}`);

                // print the body of the message
                const message = res.data;
                const parts = message.payload.parts;
                var bodydata;
                var check = message.payload.headers.filter((filter) => filter.name == 'From' && filter.value == 'Neeraj Goswami <neeraj.goswami@mangoitsolutions.in>');
                if (check.length != 0) {
                    parts.forEach((part) => {
                        if (part.mimeType === 'text/plain') {
                            bodydata = part.body.data;
                        }
                    });
                    const decodedBody = Buffer.from(bodydata, 'base64').toString();

                    if (decodedBody) {
                        var splitData = decodedBody.split(/\r?\n/);
                        var obj = {};
                        var name = [];
                        splitData.forEach(element => {
                            if (element.length > 1) {
                                name.push(element);
                                var secondSplit = element.split(':');
                                if (secondSplit.length > 1) {
                                    obj[secondSplit[0]] = secondSplit[1];
                                }
                            }
                        }
                        );
                        obj['Search Date & Time'] = obj['Search Date & Time'].substring(0, obj['Search Date & Time'].length - 2)
                        var nameSplit = name[1].substring(0, name[1].indexOf("inquired"));
                        obj['name'] = nameSplit;
                        console.log(obj);
                        if (obj) {
                            const date = new Date(obj['Search Date & Time'].trim());
                            const timestamp = date.getTime();
                            try {
                                var storeData = await SearchName.create({
                                    name: obj['name'].trim(),
                                    user_area: obj['User Area'].trim(),
                                    user_city: obj['User City'].trim(),
                                    user_state: obj['User State'].trim(),
                                    requirement: obj['User Requirement'].trim(),
                                    search_date: timestamp,
                                    phone: obj['User Phone'].trim(),
                                });
                                sendMessage(storeData);
                            } catch (error) {
                                res.send(400).json({
                                    success: false,
                                    message: "An error occurred",
                                    error: error.message,
                                });
                            }
                        }

                    }
                }
            });
        });
    };

    var subs = subscription.on('message', messageHandler);

    setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);

}

async function sendMessage(data) {
    try {
        var phoneNumber = data.phone;
        var config = await AdminConfig.findOne({
            where: {
                status: '1'
            }
        });

        clie.messages
            .create({
                body: config.dataValues.message.replace("<name>", data.name),
                mediaUrl: [config.img_path],
                from: 'whatsapp:+14155238886',
                to: `whatsapp:${phoneNumber}`.toString()
            })
            .then(message => console.log(message.sid))
            .done();

        clie.messages
            .create({
                body: 'eweqweqwee',
                messagingServiceSid: 'MG8671a329cbfaba7877e1c8931a5f867d',
                to: phoneNumber
            })
            .then(message => console.log(message.sid))
            .done();

    } catch (err) {
        res.status(400).send({ message: err.message, success: false });
    }
}

export default function mainFunction() {
    authorize().then(listLabels).catch(console.error);
};

// mainFunction();