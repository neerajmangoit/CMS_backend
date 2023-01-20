import { response } from 'express';
import SearchName from '../models/nameSearchModel';
import AdminConfig from '../models/adminConfigModel';
import client from "twilio";
import { Op } from "sequelize";

const accountSid = "AC74b51440371d71e84ec407a68bb009a2";
const authToken = "5f899dbd5fefaeaed0fc4a70ddc39457";
const clie = new client(accountSid, authToken);

async function storeMail(req, res) {

    var data = req.body.messagebody;

    var messagebody = data.toString();

    if (messagebody) {
        var splitData = messagebody.split(/\r?\n/);
        var obj = {};
        var name = [];
        splitData.forEach(element => {
            if (element.length > 1) {
                name.push(element);
                var secondSplit = element.split(':');
                if (secondSplit.length > 1) {
                    obj[secondSplit[0].trim()] = secondSplit[1];
                }
            }
        });

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

                res.status(200).send(storeData);
            } catch (error) {
                res.status(400).json({
                    success: false,
                    message: "An error occurred",
                    error: error.message,
                });
            }
        }
    } else {
        res.status(400).send("Please send the Proper mail body");
    }
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

async function getAllMail(req, res) {
    try {
        var storeData = await SearchName.findAll();
        res.status(200).send(storeData);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "An error occurred",
            error: error.message,
        });
    }
}

async function getConfig(req, res) {
    try {
        var config = await AdminConfig.findOne({
            where: {
                status: '1'
            }
        });
        res.status(200).send(config);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "An error occurred",
            error: error.message,
        });
    }
};

async function setConfig(req, res) {
    try {

        var config = await AdminConfig.update(
            {
                status: '0'
            },
            {
                where: {
                    status: '1'
                }
            });
        var config = await AdminConfig.update(
            {
                status: '1'
            },
            {
                where: {
                    slug: req.body.slug
                }
            });

        res.status(200).send(config);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "An error occurred",
            error: error.message,
        });
    }
};

async function deleteConfig(req, res) {
    try {
        var config = await AdminConfig.destroy({
            where: {
                slug: req.body.slug
            }
        });
        res.status(200).send("The config was successfully deleted");
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "An error occurred",
            error: error.message,
        });
    }
};

async function createconfig(req, res) {
    try {
        var config = await AdminConfig.create({
            name: req.body.name,
            slug: req.body.slug,
            img_path: req.body.img_path,
            status: '1',
            message: req.body.message
        });
        res.status(200).send(config);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "An error occurred",
            error: error.message,
        });
    }
};

export default {
    storeMail, getAllMail, getConfig, setConfig, deleteConfig, createconfig
}

