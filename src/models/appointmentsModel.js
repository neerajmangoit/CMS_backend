import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const appointments = sequelize.define("appointments",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    contact_number: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    date: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    time: {
        type: Sequelize.STRING,
        allowNull : false,
    },
},{
    timestamps: false
});

export default appointments;
