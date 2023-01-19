import Schedule from "../models/scheduleModel";

export async function getAllSchedules(req, res) {
    try {
        const scheduleCollection = await Schedule.findAll({});

        res.status(201).json({ data: scheduleCollection, success: true });
    } catch (e) {
        res.status(500).json({ error: e.message, success: false });
    }
}

export async function getSchedule(req, res) {
    try {
        const scheduleCollection = await Schedule.findOne({
            where: { id: req.params.id },
        });

        res.status(201).json({ data: scheduleCollection, success: true });
    } catch (e) {
        res.status(500).json({ error: e.message, success: false });
    }
}

export async function create(req, res) {
    try {
        const { day } = req.body;

        // Validate if user exist in our database
        try {
            const existingSchdule = await Schedule.findOne({ where: { day } });
            if (existingSchdule) {
                return res.status(200).json({
                    success: false,
                    message: "Schedule Already Exist",
                });
            }
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

        // Create role in our database
        const schedule = await Schedule.create({
            day: req.body.day,
            first_shift: req.body.first_shift,
            second_shift: req.body.second_shift
        });

        res.status(200).json({
            success: true,
            message: "schedule Added Successfully",
        });

    } catch (err) {
        res.status(401).json({
            success: false,
            message: "schedule not Added Successfully",
            error: err.message,
        });
    }
}

export async function update(req, res) {
    try {
        const scheduleCollection = await Schedule.findOne({ where: { id: req.params.id } });

        if (scheduleCollection) {
            const updatedSchedule = await Schedule.update(req.body, {
                where: { id: req.params.id },
                returning: true,
            });

            res.status(200).json({
                success: true,
                updatedSchedule,
                message: "Schedule Updated successfully",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Schedule Not Found",
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
}

export async function deletedSchedule(req, res) {
    try {
        const scheduleCollection = await Schedule.findOne({
            where: { id: req.params.id },
        });
        if (scheduleCollection) {
            const deletedSchedule = await Schedule.destroy({
                where: { id: req.params.id },
            });
            res.status(200).json({
                success: false,
                deletedSchedule,
                message: "Schedule Deleted successfully",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Schedule Not Found",
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
}
