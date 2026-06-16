async function process(scene) {

    console.log(
        `[TaskManager] Cena processada`
    );

    console.log(
        `Persona: ${scene.personaId}`
    );

    console.log(
        `Task: ${scene.taskId}`
    );

    console.log(
        `Caracteres: ${scene.characterCount}`
    );

}

module.exports = {
    process
};