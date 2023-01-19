import Sequelize from "sequelize";
import PateintVisit from "./pateintVisited";
import sequelize from "./../core/sequelize";

const patients = sequelize.define("patients",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    registration_no: {
        type: Sequelize.INTEGER,
        allowNull : false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    mobile: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    disease: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull : false,
    },
    gender: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    city: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    state: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    charge: {
        type: Sequelize.INTEGER,
        allowNull : false,
    },
},{
    timestamps: false
});


patients.hasMany(PateintVisit, { as: "patient_visits" });

PateintVisit.belongsTo(patients, {
  foreignKey: "patient_id",
  as: "Patient_id",
});

export default patients;
