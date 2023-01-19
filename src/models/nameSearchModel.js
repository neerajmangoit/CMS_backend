import Sequelize from "sequelize";
import PateintVisit from "./pateintVisited";
import sequelize from "./../core/sequelize";

const search_name = sequelize.define("search_name",{
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
    user_area: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    user_city: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    user_state: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    requirement: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    search_date: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull : false,
    }
},{
    timestamps: false
});


// patients.hasMany(PateintVisit, { as: "patient_visits" });

// PateintVisit.belongsTo(patients, {
//   foreignKey: "patient_id",
//   as: "Patient_id",
// });

export default search_name;
