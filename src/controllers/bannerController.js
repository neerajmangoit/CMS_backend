import Banners from "../models/bannersModel";
import env from "dotenv";
env.config();

export default class BannerController {
    constructor() {
        //
    }

    async addBanner(req, res) {
        try {
            let banner = req.body;
            banner['banner'] = req.file.path;
            const bannerCreate = await Banners.create(banner);
            res.status(200).json({
                success: true,
                message: "Banner uploaded successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }


    async bannerList(req, res) {
        try {
            await Banners.findAll().then((response) => {
                response.forEach(element => {
                    if (element.banner.split('uploads/')[0]) {
                        element.banner = element.banner
                    } else {
                        element.banner = element.banner ? `${process.env.IMAGEPATH}${element.banner}` : '';
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

    async bannerById(req, res) {
        try {
            await Banners.findAll({ where: { id: req.params.id } }).then((response) => {
                let bannerImage;
                if (response && response[0].banner.split('uploads/')[0]) {
                    bannerImage = response[0].banner
                } else {
                    bannerImage = response[0].banner ? process.env.IMAGEPATH + response[0].banner : '';
                }
                let banner = [{
                    title: response[0].title,
                    description: response[0].description,
                    short_description: response[0].short_description,
                    banner: bannerImage,
                    id: response[0].id,
                }]
                res.status(200).json({
                    success: true,
                    data: banner,
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


    async bannerUpdate(req, res) {
        try {
            let id = req.params.id;
            let banner = req.body;
            if (req.file) {
                banner['banner'] = req.file.path;
            }
            const Update = await Banners.update(banner, { where: { id: id } });
            res.status(200).json({
                success: true,
                message: "banner is Updated successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }

    async bannerDelete(req, res) {
        try {
            let id = req.params.id;
            await Banners.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "banner Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
}
