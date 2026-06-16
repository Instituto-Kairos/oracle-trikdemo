//
// -> storage -------------------------------------------------
//

const messageParts = {};

//
// -> regex ---------------------------------------------------
//

const tagRegex =
/^(?:\|\|)?\[(PER\d+)-(\d+)\/(\d+)#(TASK\d+)\](?:\|\|)?\s*([\s\S]*)$/;

//
// -> process -------------------------------------------------
//

function process(message) {

    //
    // -> busca cena ------------------------------------------
    //

    if (message.author.bot) {
        return null;
    }

    const match =
        message.content.match(tagRegex);

    if (!match) {
        return null;
    }

    //
    // -> encntrou cena ---------------------------------------
    //

    const personaId = match[1];
    const partNumber = parseInt(match[2]);
    const totalParts = parseInt(match[3]);
    const taskId = match[4];
    const content = match[5];

    if (partNumber > totalParts) {

        console.log(
            `[SceneHandler] Parte inválida: ${partNumber}/${totalParts}`
        );

        return null;

    }

    const sceneKey =
        `${personaId}-${taskId}`;

    if (!messageParts[sceneKey]) {

        messageParts[sceneKey] = {
            total: totalParts,
            parts: {}
        };

    }

    messageParts[sceneKey]
        .parts[partNumber] = content;

    console.log(
        `[SceneHandler] Parte ${partNumber}/${totalParts} recebida`
    );

    const receivedParts =
        Object.keys(
            messageParts[sceneKey].parts
        ).length;

    if (receivedParts !== totalParts) {
        return null;
    }

    //
    // -> assemble scene --------------------------------------
    //

    const orderedParts =
        Object.keys(
            messageParts[sceneKey].parts
        )
        .sort((a, b) => a - b);

    const fullContent =
        orderedParts
        .map(
            part =>
                messageParts[sceneKey]
                .parts[part]
        )
        .join(" ");

    //
    // -> cleanup ---------------------------------------------
    //

    delete messageParts[sceneKey];

    //
    // -> return scene ----------------------------------------
    //

    return {

        personaId,
        taskId,

        discordUserId:
        message.author.id,

        content: fullContent,

        characterCount:
            fullContent.length,

        wordCount:
            fullContent
            .trim()
            .split(/\s+/)
            .length,

        createdAt:
            new Date()

    };

}

//
// -> export --------------------------------------------------
//

module.exports = {
    process
};