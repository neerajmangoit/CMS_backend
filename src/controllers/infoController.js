import ContentLimits from "../models/contects-limitModel";
import Infos from "../models/infosModel";
import env from "dotenv";
env.config();

export default class InfoController {
    constructor() {
        //
    }

    async addInfo(req, res) {
        try {
            let info = req.body;
            info['image'] = req.file.path;
            const create = await Infos.create(info);
            res.status(200).json({
                success: true,
                message: "info uploaded successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }


    async infoList(req, res) {

        try {
            await Infos.findAll().then((response) => {
                response.forEach(element => {
                    if (element.image != null) {

                        if (element.image.split('uploads/')[0]) {
                            element.image = element.image
                        } else {
                            element.image = element.image ? `${process.env.IMAGEPATH}${element.image}` : '';
                        }
                    } else {
                        element.image = element.image;
                    }
                });
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

    async infoById(req, res) {
        try {
            await Infos.findAll({ where: { id: req.params.id } }).then((response) => {
                let infoImage;
                if (response && response[0].image != null) {
                    if (response && response[0].image.split('uploads/')[0]) {
                        infoImage = response[0].image
                    } else {
                        infoImage = response[0].image ? process.env.IMAGEPATH + response[0].image : '';
                    }
                } else {
                    infoImage = response[0].image;
                }

                let info = [{
                    title: response[0].title,
                    description: response[0].description,
                    image: infoImage,
                    id: response[0].id,
                }]
                res.status(200).json({
                    success: true,
                    data: info,
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



    async infoUpdate(req, res) {
        try {
            let id = req.params.id;
            let info = req.body;
            if (req.file) {
                info['image'] = req.file.path;
            }
            const Update = await Infos.update(info, { where: { id: id } });
            res.status(200).json({
                success: true,
                message: "info is Updated successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }

    async infoDelete(req, res) {
        try {
            let id = req.params.id;
            await Infos.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "info Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }

    async infoLimitList(req, res) {
        try {
            let limit = await ContentLimits.findAll({ where: { section_name: 'info' } });
            if (limit && limit.length > 0) {

                await Infos.findAll({ limit: limit[0].dataValues.content_limit }).then((response) => {
                    response.forEach(element => {
                        if (element.image != null) {

                            if (element.image.split('uploads/')[0]) {
                                element.image = element.image
                            } else {
                                element.image = element.image ? `${process.env.IMAGEPATH}${element.image}` : '';
                            }
                        } else {
                            element.image = element.image;
                        }
                    });
                    res.status(200).json({
                        success: true,
                        data: response,
                    });
                });
            } else {
                await Infos.findAll({ limit: 4 }).then((response) => {
                    response.forEach(element => {
                        if (element.image != null) {

                            if (element.image.split('uploads/')[0]) {
                                element.image = element.image
                            } else {
                                element.image = element.image ? `${process.env.IMAGEPATH}${element.image}` : '';
                            }
                        } else {
                            element.image = element.image;
                        }
                    });
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
}
