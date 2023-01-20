import ContentLimits from "../models/contects-limitModel";
import Services from "../models/servicesModel";
import env from "dotenv";
env.config();

export default class ServiceController {
    constructor() {
        //
    }

    async addService(req, res) {
        try {
            let service = req.body;
            service['image'] = req.file.path;
            const create = await Services.create(service);
            res.status(200).json({
                success: true,
                message: "service uploaded successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }


    async serviceList(req, res) {
        try {
            await Services.findAll().then((response) => {
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

    async serviceById(req, res) {
        try {
            await Services.findAll({ where: { id: req.params.id } }).then((response) => {
                let serviceImage;
                if (response && response[0].image != null) {
                    if (response && response[0].image.split('uploads/')[0]) {
                        serviceImage = response[0].image
                    } else {
                        serviceImage = response[0].image ? process.env.IMAGEPATH + response[0].image : '';
                    }
                } else {
                    serviceImage = response[0].image;
                }

                let service = [{
                    title: response[0].title,
                    description: response[0].description,
                    slug: response[0].slug,
                    image: serviceImage,
                    id: response[0].id,
                }]
                res.status(200).json({
                    success: true,
                    data: service,
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

    async serviceLimitList(req, res) {
        try {
            let limit = await ContentLimits.findAll({ where: { section_name: 'diseases' } })
            if (limit && limit.length > 0) {
                await Services.findAll({ limit: limit[0].content_limit }).then((response) => {
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
                await Services.findAll({ limit: 4 }).then((response) => {
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


    async serviceUpdate(req, res) {
        try {
            let id = req.params.id;
            let service = req.body;
            if (req.file) {
                service['image'] = req.file.path;
            }
            const Update = await Services.update(service, { where: { id: id } });
            res.status(200).json({
                success: true,
                message: "service is Updated successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }

    async serviceDelete(req, res) {
        try {
            let id = req.params.id;
            await Services.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "Service Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }

    async serviceBySlug(req, res) {
        try {
            await Services.findAll({ where: { slug: req.params.slug } }).then((response) => {
                let serviceImage;
                if (response && response[0].image != null) {
                    if (response && response[0].image.split('uploads/')[0]) {
                        serviceImage = response[0].image
                    } else {
                        serviceImage = response[0].image ? process.env.IMAGEPATH + response[0].image : '';
                    }
                } else {
                    serviceImage = response[0].image;
                }

                let service = [{
                    title: response[0].title,
                    description: response[0].description,
                    image: serviceImage,
                    id: response[0].id,
                }]
                res.status(200).json({
                    success: true,
                    data: service,
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
}
