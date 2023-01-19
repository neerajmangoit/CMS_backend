import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const services = sequelize.define("services",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    slug: {
        type: Sequelize.STRING,
        allowNull : false,
    }
},{
    timestamps: false
});

export default services;
