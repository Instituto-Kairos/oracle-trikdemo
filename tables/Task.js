const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Task = sequelize.define("Task", {
    task_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    t_name: {
        type: DataTypes.TEXT,
    },
    t_description: {
        type: DataTypes.TEXT
    },
    goal_personas: {
        type: DataTypes.INTEGER
    },
    goal_chars: {
        type: DataTypes.INTEGER
    }
});

module.exports = Task;