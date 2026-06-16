const sceneHandler =
    require("../services/sceneHandler");

const taskCounter =
    require("../services/taskCounter");

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