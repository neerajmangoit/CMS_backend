import Pages from "../models/pagesModel";
export default class PagesController {
    constructor() {
        //
    }

    async addpage(req, res, next) {
        try {
            let page = {
                title: req.body.title,
                keywords: req.body.keywords,
                describes: req.body.describes,
                url: req.body.url,
                content: req.body.content
            }
            const appoint = await Pages.create(page);
            res.status(200).json({
                success: true,
                message: "Pages created Successfully",
            });
        } catch (err) {
            res.status(401).json({
                success: false,
                message: "Pages not successful created",
                error: err.message,
            });
        }
    }

    async pageList(req, res) {
        try {
            await Pages.findAll().then((response) => {
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

    async pageById(req, res) {
        try {
            await Pages.findAll({ where: { id: req.params.id } }).then((response) => {
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

    async pageBySlug(req, res) {
        try {
            await pagesModel.findBySlug(req.params.slug).then((response) => {
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

    async pageUpdate(req, res) {
        try {
            let id = req.params.id;
            const Update = await Pages.update(req.body, { where: { id: id } });
            res.status(200).json({
                success: true,
                message: "Page is Updated successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message, success: false });
        }
    }

    async pageDelete(req, res) {
        try {
            let id = req.params.id;
            await Pages.destroy({ where: { id: id } });
            res.status(200).json({
                success: true,
                message: "Page Delete Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
}
