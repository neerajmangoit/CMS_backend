import Sequelize from "sequelize";
import Pateints from "./pateintsModel";
import sequelize from "./../core/sequelize";

const patient_visits = sequelize.define("patient_visits",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    patientId: {
        type: Sequelize.INTEGER,
        allowNull : false,
    },
    registration_no: {
        type: Sequelize.INTEGER,
        allowNull : false,
    },
    visit_date: {
        type: Sequelize.STRING,
        allowNull : false,
    },
},{
    timestamps: false
});

// sequelize.patients.hasMany(sequelize.PateintVisit, { as: "Patient_id" });

// patient_visits.belongsTo(Pateints, {
//   foreignKey: "PatientId",
//   as: "patient_id",
// });

export default patient_visits;
