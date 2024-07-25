const openai = require('openai');

async function main() {
    const myAssistants = await openai.beta.assistants.list({
        order: "desc",
        limit: "20",
    });

    console.log(myAssistants.data);
}

main();