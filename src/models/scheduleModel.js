import Sequelize from "sequelize";
import sequelize from "../core/sequelize";

const schedule_by_days = sequelize.define("schedule_by_days",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    day: {
        type: Sequelize.STRING,
        allowNull : true,
    },
    first_shift: {
        type: Sequelize.STRING,
        allowNull : true,
    },
    second_shift: {
        type: Sequelize.STRING,
        allowNull : true,
    },
},{
    timestamps: true
});

export default schedule_by_days;
