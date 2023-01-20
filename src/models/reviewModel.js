import Sequelize from "sequelize";
import sequelize from "./../core/sequelize";

const reviews = sequelize.define("reviews",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true,
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    link: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    thumbnail: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    reviews: {
        type: Sequelize.INTEGER,
        allowNull : true,
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull : true,
    },
    date: {
        type: Sequelize.STRING,
        allowNull : false,
    },
    comments: {
        type: Sequelize.STRING,
        allowNull : true,
    },
    likes: {
        type: Sequelize.INTEGER,
        allowNull : true,
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
    },
},{
    timestamps: false
});

export default reviews;
