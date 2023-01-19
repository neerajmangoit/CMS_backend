import Appointments from "../models/appointmentsModel";
import env from "dotenv";
import sendEmail from "../core/mailer";
import client from "twilio";
env.config();

const accountSid = "AC74b51440371d71e84ec407a68bb009a2";
const authToken = "dd4ca0f458eb1a3be187e387e98234f1";
const clie = new client(accountSid, authToken)

export default class AppointmentController {
    constructor() {
    }

    async addappointment(req, res) {
        try {
            // const appoint = await Appointments.create(req.body);

            var numbers = ['whatsapp:+917049893593', 'whatsapp:+918871641773', 'whatsapp:+918770792589']

            numbers.forEach(element => {
                clie.messages
                    .create({
                        body: 'Hello',
                        from: 'whatsapp:+14155238886',
                        to: element
                    })
                    .then(message => console.log(message.sid))
                    .done();
            });

            clie.messages
                .create({
                    body: 'eweqweqwee',
                    messagingServiceSid: 'MG8671a329cbfaba7877e1c8931a5f867d',
                    to: '+917999377431'
                })
                .then(message => console.log(message.sid))
                .done();

            // let mailSent = sendEmail(mailOption);

            // if (mailSent != "error") {
            //     res.status(200).json({
            //         success: true,
            //         message: "Appointment is schedule successfully",
            //     });
            // } else {
            //     res.status(400).json({
            //         success: false,
            //         message: "something went wrong",
            //     });
            // }
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }

    async appointmentList(req, res) {
        try {
            await Appointments.findAll().then((response) => {
                res.status(200).json({
                    success: true,
                    data: response,
                });
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "An error occurred",
                error: error.message,
            });
        }
    }

    async appointmentById(req, res) {
        try {
            await Appointments.findAll({ where: { id: req.params.id } }).then((response) => {
                res.status(200).json({
                    success: true,
                    data: response,
                });
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "An error occurred",
                error: error.message,
            });
        }
    }

    async appointmentUpdate(req, res) {
        try {
            let id = req.params.id;
            const Update = await Appointments.update(req.body, { where: { id: id } });

            clie.messages
                .create({
                    from: 'whatsapp:+14155238886',
                    body: `
            Dear Doctor,
            An patient name = "${req.body.name}" want to take an appointment. They would like to meet at ${req.body.time} on ${req.body.date} .                     
            Thank you!
            `,
                    to: 'whatsapp:+911234567890'
                })
                .then(message => console.log(message.sid));

            var mailOption = {
                from: "raj.mangoit@gmail.com",
                to: "test1@mailinator.com",
                subject: "Appointment",
                html: `<p>
        Dear Doctor,
        An patient name = ${req.body.name} want to take an appointment. They would like to meet at ${req.body.time} on ${req.body.date} .                     
        </p>
        <p>Thank you</p>
        `,
            };

            let mailSent = sendEmail(mailOption);

            if (mailSent != "error") {
                res.status(200).json({
                    success: true,
                    message: "Appointment is Updated successfully",
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "something went wrong",
                });
            }
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }

    async appointmentDelete(req, res) {
        try {
            let id = req.params.id;
            await Appointments.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "appointment Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
}
