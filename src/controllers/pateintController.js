import Pateints from "../models/pateintsModel";
import PateintVisit from "../models/pateintVisited";
import env from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import readXlsxFile, { readSheetNames } from "read-excel-file/node";
import * as fs from "fs";
import moment from "moment";
import request from "request";
import { Op } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
env.config();

export default class PateintController {
    constructor() {
        //
    }

    async addPateint(req, res) {
        let alreadyVisited = await Pateints.findAll({ where: { registration_no: req.body.registration_no } })
        if (alreadyVisited.length > 0) {
            let visitedpatient = {
                registration_no: req.body.registration_no,
                patient_id: alreadyVisited[0].id,
                visit_date: req.body.visit_date,
            };
            await PateintVisit.create(visitedpatient)
                .then((response) => {
                    res.status(200).json({
                        success: true,
                        message: "pateint added successfully",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).send({ message: err.message, success: false });
                });
        } else {
            await await Pateints.create(req.body)
                .then((response) => {

                    let visitedpatient = {
                        registration_no: req.body.registration_no,
                        patient_id: response.dataValues.id,
                        visit_date: req.body.visit_date,
                    };

                    PateintVisit.create(visitedpatient)
                        .then((response) => {
                            res.status(200).json({
                                success: true,
                                message: "pateint added successfully",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(400).send({ message: err.message, success: false });
                        });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).send({ message: err.message, success: false });
                });
        }
    }

    async pateintList(req, res) {
        try {

            console.log(req.query);

            if (req.query.filter == null || req.query.filter == '') {
                var pateintsCollection = await Pateints.findAll({
                    offset: (req.query.page - 1) * req.query.pageSize,
                    limit: parseInt(req.query.pageSize),
                });
            } else {
                console.log(req.query.filter);
                var pateintsCollection = await Pateints.findAndCountAll({
                    offset: (req.query.page - 1) * req.query.pageSize,
                    limit: parseInt(req.query.pageSize),
                    where: {
                        [Op.or]: [
                          { 'name': { [Op.like]: '%' + req.query.filter + '%' } },
                          { 'mobile': { [Op.eq]: '%' + req.query.filter + '%' } },
                          { 'registration_no': { [Op.like]: '%' + req.query.filter + '%' } },
                          { 'disease': { [Op.like]: '%' + req.query.filter + '%' } }
                        ]
                      }
                });
            }

            let response = {
                data: pateintsCollection,
                current_page: req.query.page
            };
            res.status(201).json(response);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "An error occurred",
                error: error.message,
            });
        }
    }

    async pateintById(req, res) {
        try {
            await Pateints.findAll({ where: { id: req.params.id } }).then((response) => {
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

    async pateintUpdate(req, res) {
        let id = req.params.id;
        await Pateints.update(req.body, { where: { id: id } })
            .then((response) => {
                res.status(200).json({
                    success: true,
                    message: "pateint Updates Successfully",
                });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    }

    async pateintDelete(req, res) {
        try {
            let id = req.params.id;
            await Pateints.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "appointment Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }

    async importPateint(req, res) {
        var sheetsLength;
        let alreadyVisited = [];
        readSheetNames(__dirname + "/../../uploads/" + req.file.filename).then(
            (sheetNames) => {
                sheetsLength = sheetNames.length;
                if (sheetsLength > 0) {
                    for (let z = 1; z <= sheetsLength; z++) {
                        readXlsxFile(req.file.path, { sheet: z }).then(
                            async (sheetrows) => {
                                sheetrows.shift();
                                if (sheetrows.length > 0) {
                                    for (let index = 0; index < sheetrows.length; index++) {
                                        const element = sheetrows[index];
                                        await Pateints.findAll({ where: { registration_no: element[0] } })
                                            .then(async (exists) => {
                                                if (exists.length > 0) {
                                                    let d1 = moment
                                                        .utc(exists[0].visit_date)
                                                        .format("YYYY/MM/DD");
                                                    let d2 = moment.utc(element[10]).format("YYYY/MM/DD");
                                                    console.log(
                                                        d1.toString().split("T")[0],
                                                        "!=",
                                                        d2.toString().split("T")[0]
                                                    );
                                                    if (
                                                        element[0] == exists[0].registration_no &&
                                                        d1.toString().split("T")[0] !=
                                                        d2.toString().split("T")[0]
                                                    ) {
                                                        let data = {
                                                            registration_no: element[0],
                                                            patient_id: exists[0].dataValues.patient_id,
                                                            visit_date: toString(element[10])
                                                        }
                                                        await PateintVisit.create(data)
                                                            .then((response) => {
                                                                if (sheetrows.length == index + 1) {
                                                                    res.status(200).json({
                                                                        success: true,
                                                                        message: "pateint added successfully",
                                                                    });
                                                                }
                                                            })
                                                            .catch((err) => {
                                                                if (sheetrows.length == index + 1) {
                                                                    res.status(400).send({
                                                                        message: err.message,
                                                                        success: false,
                                                                    });
                                                                }
                                                            });
                                                    } else {
                                                        if (sheetrows.length == index + 1) {
                                                            res.status(200).json({
                                                                success: true,
                                                                message: "pateint added successfully",
                                                            });
                                                        }
                                                    }
                                                } else {
                                                    await Pateints.create({
                                                        registration_no: element[0],
                                                        name: element[1],
                                                        mobile: element[2],
                                                        disease: element[3],
                                                        age: element[4],
                                                        gender: element[5],
                                                        address: element[6],
                                                        city: element[7],
                                                        state: element[8],
                                                        charge: element[9]
                                                    })
                                                        .then(async (response) => {
                                                            let data = {
                                                                registration_no: element[0],
                                                                patient_id: response.dataValues.id,
                                                                visit_date: toString(element[10])
                                                            }
                                                            await PateintVisit.create(data)
                                                                .then((response) => {
                                                                    if (sheetrows.length == index + 1) {
                                                                        res.status(200).json({
                                                                            success: true,
                                                                            message: "pateint added successfully",
                                                                        });
                                                                    }
                                                                })
                                                                .catch((err) => {
                                                                    if (sheetrows.length == index + 1) {
                                                                        res.status(400).send({
                                                                            message: err.message,
                                                                            success: false,
                                                                        });
                                                                    }
                                                                });
                                                        })
                                                        .catch((err) => {
                                                            if (sheetrows.length == index + 1) {
                                                                res.status(400).send({ message: err.message });
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                }
                            }
                        );
                    }
                }
            }
        );
    }

    async pateintDteailsById(req, res) {
        try { 
            let pateintData = await Pateints.findOne({ 
                includes: ['patient_visits'],
                where: { id: req.params.id }
            })
            
            res.status(200).json({
                success: true,
                data: pateintData,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "An error occurred",
                error: error.message,
            });
        }
    }

    async pateintLimitList(req, res) {
        try {
            if (req.params.limit) {
                await Pateints.findAll({ limit: req.params.limit }).then((response) => {
                    res.status(200).json({
                        success: true,
                        data: response,
                    });
                });
            } else {
                await Pateints.findAll({ limit: 4 }).then((response) => {
                    res.status(200).json({
                        success: true,
                        data: response,
                    });
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "An error occurred",
                error: error.message,
            });
        }
    }

    async sendMessageToPateint(req, res) {
        try {
            let num = req.body.numbers;
            for (let i = 0; i < num.length; i++) {
                const url = "https://api.ultramsg.com/instance23262/messages/chat?token=6omouavxl2u1vatn&to=" + req.body.numbers[i] + "&body=" + req.body.message + "&priority=10";

                request({ url, json: true }, (err, { body }) => {
                    if (err) {
                        res.status(400).json({
                            success: false,
                            message: "An error occurred",
                            error: err.message,
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            data: "message sent successfully",
                        });
                    }
                })
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "An error occurred",
                error: error.message,
            });
        }
    }
}
