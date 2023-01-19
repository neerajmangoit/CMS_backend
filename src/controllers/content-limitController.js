import ContentLimits from "../models/contects-limitModel";
import env from "dotenv";
env.config();

export default class ContentLimitController {
    constructor() {
        //
    }

    async addContentLimit(req, res) {
        await ContentLimits
            .create(req.body)
            .then((response) => {
                res.status(200).json({
                    success: true,
                    message: "contentlimit added successfully",
                });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message, success: false });
            });
    }

    async contentlimitList(req, res) {
        try {
            await ContentLimits.findAll().then((response) => {

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

    async contentlimitById(req, res) {
        try {
            await ContentLimits.findAll({ where: { id: req.params.id } }).then((response) => {
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



    async contentlimitUpdate(req, res) {
        let id = req.params.id;
        await ContentLimits
            .update(req.body, { where: { id: id } })
            .then((response) => {
                res.status(200).json({
                    success: true,
                    message: "contentlimit Updates Successfully",
                });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    }

    async contentlimitDelete(req, res) {
        try {
            let id = req.params.id;
            await ContentLimits.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "ContentLimits Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
}
