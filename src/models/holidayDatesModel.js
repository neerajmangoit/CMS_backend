import Sequelize from "sequelize";
import sequelize from "../core/sequelize";

const holidayDates = sequelize.define("holiday_dates",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    date: {
        type: Sequelize.STRING,
        allowNull : true,
    },
    occasion: {
        type: Sequelize.STRING,
        allowNull : true,
    },
},{
    timestamps: true
});

export default holidayDates;
