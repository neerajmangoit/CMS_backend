import Sequelize from "sequelize";
import PateintVisit from "./pateintVisited";
import sequelize from "./../core/sequelize";

const admin_config = sequelize.define("admin_config",{
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
    slug: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    img_path: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    message: {
        type: Sequelize.STRING,
        allowNull : false,
    }
},{
    timestamps: false
});

export default admin_config;
