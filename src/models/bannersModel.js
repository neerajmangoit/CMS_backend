import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const banners = sequelize.define("banners",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    banner: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    short_description: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull : false,
    }
},{
    timestamps: false
});

export default banners;
