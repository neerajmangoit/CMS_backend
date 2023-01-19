// const Sequelize = require("sequelize");
import Sequelize from "sequelize";

let sequelize = new Sequelize("cms","root","",{
    dialect: 'mysql',         
    host: 'localhost'
});


export default sequelize;