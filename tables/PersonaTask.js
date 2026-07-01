const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const PersonaTask = sequelize.define("PersonaTask", {
    chars: {
        type: DataTypes.INTEGER
    },
    link: {
        type: DataTypes.TEXT,
        unique: true
    }
});

module.exports = PersonaTask;