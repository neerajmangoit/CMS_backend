import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const infos = sequelize.define("infos",{
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
    }
},{
    timestamps: false
});

export default infos;
