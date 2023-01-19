import Logos from "../models/logosModel";
import env from "dotenv";
env.config();

export default class LogoController {
    constructor() {
        //
    }

    async addLogo(req, res) {
        try {
            let logo = req.body;
            logo['logo_image'] = req.file.path;
            const create = await Logos.create(logo);
            res.status(200).json({
                success: true,
                message: "Logo uploaded successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }


    async logoList(req, res) {
        try {
            await Logos.findAll().then((response) => {
                response.forEach(element => {
                    if (element.logo_image != null) {

                        if (element.logo_image.split('uploads/')[0]) {
                            element.logo_image = element.logo_image
                        } else {
                            element.logo_image = element.logo_image ? `${process.env.IMAGEPATH}${element.logo_image}` : '';
                        }
                    } else {
                        element.logo_image = element.logo_image;
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

    async logoById(req, res) {
        try {
            await Logos.findAll({ where: { id: req.params.id } }).then((response) => {
                let logoImage;
                if (response && response[0].image != null) {
                    if (response && response[0].image.split('uploads/')[0]) {
                        logoImage = response[0].image
                    } else {
                        logoImage = response[0].image ? process.env.IMAGEPATH + response[0].image : '';
                    }
                } else {
                    logoImage = response[0].image;
                }

                let logo = [{
                    title: response[0].title,
                    description: response[0].description,
                    image: logoImage,
                    id: response[0].id,
                }]
                res.status(200).json({
                    success: true,
                    data: logo,
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



    async logoUpdate(req, res) {
        try {
            let id = req.params.id;
            let logo = req.body;
            if (req.file) {
                logo['image'] = req.file.path;
            }
            const Update = await Logos.update(logo, { where: { id: id } });
            res.status(200).json({
                success: true,
                message: "Logo is Updated successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }

    async logoDelete(req, res) {
        try {
            let id = req.params.id;
            await Logos.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "Logo Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }


}
