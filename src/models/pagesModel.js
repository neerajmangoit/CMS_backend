import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const pages = sequelize.define("pages",{
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
    keywords: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    describes: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull : false,
    },
    url: {
        type: Sequelize.STRING,
        allowNull : false,
    }
},{
    timestamps: false
});

export default pages;
