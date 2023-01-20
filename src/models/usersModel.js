import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const users = sequelize.define("users",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull : false,
    }
},{
    timestamps: false
});

export default users;
