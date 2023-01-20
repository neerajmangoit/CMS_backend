import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const content_limit = sequelize.define("home_content_limits",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    section_name: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    content_limit: {
        type: Sequelize.INTEGER,
        allowNull : false,
    }
},{
    timestamps: false
});

export default content_limit;
