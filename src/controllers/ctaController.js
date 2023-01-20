import Ctas from "../models/ctasModel";
import env from "dotenv";
env.config();

export default class CtaController {
    constructor() {
        //
    }

    async addCta(req, res) {
        try {
            let cta = req.body;
            cta['image'] = req.file.path;
            const create = await Ctas.create(cta);
            res.status(200).json({
                success: true,
                message: "cta uploaded successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }


    async ctaList(req, res) {
        try {
            await Ctas.findAll().then((response) => {
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

    async ctaById(req, res) {
        try {
            await Ctas.findAll({ where: { id: req.params.id } }).then((response) => {
                let ctaImage;
                if (response && response[0].image != null) {
                    if (response && response[0].image.split('uploads/')[0]) {
                        ctaImage = response[0].image
                    } else {
                        ctaImage = response[0].image ? process.env.IMAGEPATH + response[0].image : '';
                    }
                } else {
                    ctaImage = response[0].image;
                }

                let cta = [{
                    title: response[0].title,
                    description: response[0].description,
                    image: ctaImage,
                    id: response[0].id,
                }]
                res.status(200).json({
                    success: true,
                    data: cta,
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



    async ctaUpdate(req, res) {
        try {
            let id = req.params.id;
            let cta = req.body;
            if (req.file) {
                cta['image'] = req.file.path;
            }
            const Update = await Ctas.update(cta, { where: { id: id } });
            res.status(200).json({
                success: true,
                message: "CTA is Updated successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }

    async ctaDelete(req, res) {
        try {
            let id = req.params.id;
            await Ctas.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "CTA Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
}
