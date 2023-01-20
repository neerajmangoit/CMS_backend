import HolidayDates from "../models/holidayDatesModel";

export async function getAllHolidayDatess(req, res) {
    try {
        const holidayDatesCollection = await HolidayDates.findAll({});

        res.status(201).json({ data: holidayDatesCollection, success: true });
    } catch (e) {
        res.status(500).json({ error: e.message, success: false });
    }
}

export async function getHolidayDates(req, res) {
    try {
        const holidayDatesCollection = await HolidayDates.findOne({
            where: { id: req.params.id },
        });

        res.status(201).json({ data: holidayDatesCollection, success: true });
    } catch (e) {
        res.status(500).json({ error: e.message, success: false });
    }
}

export async function create(req, res) {
    try {
        const { date } = req.body;

        // Validate if user exist in our database
        try {
            const existingDate = await HolidayDates.findOne({ where: { date } });
            if (existingDate) {
                return res.status(200).json({
                    success: false,
                    message: "Date Already Exist",
                });
            }
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

        const holidayDates = await HolidayDates.create({
            date: req.body.date,
            occasion: req.body.occasion,
        });

        res.status(200).json({
            success: true,
            message: "Dates Added Successfully",
        });

    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Dates not Added",
            error: err.message,
        });
    }
}

export async function update(req, res) {
    try {
        const holidayDatesCollection = await HolidayDates.findOne({ where: { id: req.params.id } });

        if (holidayDatesCollection) {
            const updatedHolidayDates = await HolidayDates.update(req.body, {
                where: { id: req.params.id },
                returning: true,
            });

            res.status(200).json({
                success: true,
                updatedHolidayDates,
                message: "Date Updated successfully",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Date Not Found",
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
}

export async function deletedHolidayDates(req, res) {
    try {
        const holidayDatesCollection = await HolidayDates.findOne({
            where: { id: req.params.id },
        });
        if (holidayDatesCollection) {
            const deletedHolidayDates = await HolidayDates.destroy({
                where: { id: req.params.id },
            });
            res.status(200).json({
                success: false,
                deletedHolidayDates,
                message: "Date Deleted successfully",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Date Not Found",
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
}
