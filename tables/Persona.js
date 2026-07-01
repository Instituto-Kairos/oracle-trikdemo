const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Persona = sequelize.define("Persona", {
    persona_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    p_name: {
        type: DataTypes.STRING(20),
    },
    template: {
        type: DataTypes.INTEGER,
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["d_id", "p_name"]
        }
    ]
});

module.exports = Persona;