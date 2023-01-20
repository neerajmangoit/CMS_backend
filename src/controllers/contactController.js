import Contacts from "../models/contactsModel";
import sendEmail from "../core/mailer";
import { mapLimit } from "async";

export default class ContactController {
    constructor() { }

    async contact_admin(req, res) {
        var mailOption = {
            from: "raj.mangoit@gmail.com",
            to: 'test1@mailinator.com',
            subject: req.body.subject,
            // text: options.message,
            html: `
            <p> ${req.body.message}</p>
            <p>Thank you</p>
            `,
        };
        let mailSent = await sendEmail(mailOption);
        if (mailSent != "error") {
            await Contacts.create(req.body).then((response) => {
                res.status(200).json({
                    success: true,
                    message: "Mail sent successfully",
                });
            });
        } else {
            res.status(400).json({
                success: false,
                message: "mail not sent"
            })
        }
    }
}
