import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const contacts = sequelize.define("contact-admins",{
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
    subject: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    message: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    from_user: {
        type: Sequelize.STRING,
        allowNull : false,
    }
});

export default contacts;


// "INSERT INTO `contact-admins`(`name`,`subject`,`message`,`from_user`,`created_at`)VALUES(?,?,?,?,?)",
//       [req.body.name, req.body.subject, req.body.message, req.body.from_user, req.body.content, date]