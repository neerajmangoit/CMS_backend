import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const logos = sequelize.define("logos",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    logo_image: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    logo_word: { 
        type: Sequelize.STRING,
        allowNull : false,
    }
},{
    timestamps: false
});

export default logos;
