import Users from "../models/usersModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthValidation from "../validators/authValidation";
import env from "dotenv";
import twilio from "twilio";
env.config();
const accountSid = process.envTWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


let authValidation = new AuthValidation();
export default class UserController {
    constructor() {
        //
    }

    async userRegistration(req, res, next) {
        let date = new Date().toJSON();
        try {
            // const emailExist = await userModel.checkEmailExists(req.body.email);
            const emailExist = await Users.findAll({ where: { email: req.body.email } });
            if (emailExist && emailExist.length) {
                res.status(200).json({
                    message: "User already exists",
                    error: "User already exists",
                    success: false,
                });
            } else {
                bcrypt.hash(req.body.password, 10).then(async (hash) => {
                    const data = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: hash,
                    };
                    await Users.create(data)
                        .then((user) => {
                            if (user != "error") {
                                res.status(200).json({
                                    success: true,
                                    message: "User is registered successfully",
                                });
                            } else {
                                res.status(400).json({
                                    success: false,
                                    message: "something went wrong",
                                });
                            }
                        })
                        .catch((error) => {
                            res.status(400).json({
                                success: false,
                                message: "User not created",
                                error: error.message,
                            });
                        });
                    phoneVerification();
                });
            }
        } catch (err) {
            res.status(400).json({
                success: false,
                message: "User not successful created",
                error: err.message,
            });
        }
    }

    async userLogin(req, res, next) {
        const validate = await authValidation.signinValidation(req);
        if (validate && validate.length > 0) {
            res.status(200).json({ validate, success: false });
        } else {
            const { email, password } = req.body;
            try {
                const emailExist = await Users.findAll({ where: { email: req.body.email } });
                if (!emailExist) {
                    res.status(200).json({
                        message: "Login not successful",
                        error: "User not found",
                        success: false,
                    });
                } else {
                    bcrypt.compare(password, emailExist[0].dataValues.password).then(function (result) {
                        if (!result) {
                            return res.status(200).json({
                                message: "password is incorrect",
                                success: false,
                            });
                        }
                        if (result) {
                            const token = jwt.sign(
                                {
                                    email: emailExist[0].dataValues.email,
                                    id: emailExist[0].dataValues.id,
                                },
                                process.env.LOGINKEY,
                                {
                                    expiresIn: "1h",
                                }
                            );
                            let user = {
                                first_name: emailExist[0].dataValues.first_name,
                                email: emailExist[0].dataValues.email,
                                last_name: emailExist[0].dataValues.last_name,
                                contact_number: emailExist[0].dataValues.contact_number,
                                profile_pic: emailExist[0].dataValues.profile_pic,
                                id: emailExist[0].dataValues.id,
                            };
                            res.status(200).json({
                                success: true,
                                user,
                                token: token,
                            });
                        }
                    });
                }
            } catch (error) {
                res.status(400).json({
                    message: "An error occurred",
                    error: error.message,
                });
            }
        }
    }

    async get_User(req, res) {
        try {
            await Users.findAll().then((response) => {
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

    async get_User_By_id(req, res) {
        try {
            await Users.findAll({ where: { id: req.params.id } }).then((response) => {
                let user = {
                    first_name: response[0].first_name,
                    email: response[0].email,
                    last_name: response[0].last_name,
                    contact_number: response[0].contact_number,
                    profile_pic: "http://localhost:5000/" + response[0].profile_pic,
                    id: response[0].id,
                };
                res.status(200).json({
                    success: true,
                    data: user,
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

    async update_User(req, res) {
        let imagePath = "";
        if (req.file) {
            imagePath = req.file.path;
        }
        const data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
        };
        let id = req.params.id;

        await Users.update(data, { where: { id: id } })
            .then((response) => {
                res.status(200).json({
                    success: true,
                    message: "User Updates Successfully",
                });
            })
            .catch((err) => {
                res.status(400).send({
                    message: err.message,
                    success: false,
                });
            });
    }

    async delete_User(req, res) {
        try {
            let id = req.params.id;
            await Users.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "User Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }

    async userPasswordReset(req, res) {
        const { password, con_password } = req.body;
        const { id, token } = req.params;
        // const user = await User.findById(id);
        // const new_secret = user._id + process.env.LOGINKEY;
        // emailExist[0].dataValues.email
        const user = await await Users.findAll({ where: { id: id } });
        const new_secret = user[0].dataValues.id + process.env.LOGINKEY;
        try {
            jwt.verify(token, new_secret);
            if (password && con_password) {
                if (password !== con_password) {
                    res.send({
                        status: "failed",
                        message: "Password and Confirm password doesn't match",
                    });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newHashPAssword = await bcrypt.hash(password, salt);
                    // await User.findByIdAndUpdate(user._id, {
                    //   $set: { password: newHashPAssword },
                    // });
                    Users.update({ password: newHashPAssword }, { where: { id: user[0].dataValues.id } });
                    res.send({
                        status: "success",
                        message: "Password reset successfully",
                    });
                }
            } else {
                res.send({ status: "failed", message: "All fields are required" });
            }
        } catch (error) {
        }
    }

}
const phoneVerification = async (user, res) => {
    try {
        client.messages
            .create({
                body: 'testing email',
                messagingServiceSid: process.TWILIO_MESSAGE_SID,
                to: '+919111163767',
                from:'7856209513'
            })
            .then(message => console.log(message.sid))
            .done();
        return true
    } catch (e) {
        res.status(500).send(e.message);
    }
};
