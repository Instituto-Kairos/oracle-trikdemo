const sceneHandler =
    require("../services/SceneHandler");

const taskCounter =
    require("../services/TaskManager");

module.exports = {

    name: "messageCreate",

    async execute(message) {

        const scene =
            sceneHandler.process(
                message
            );

        if (!scene) {
            return;
        }

        await taskCounter.process(
            scene
        );

    }

};