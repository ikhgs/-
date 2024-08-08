const axios = require("axios");

async function gem(prompt, customId, link) {
    try {
        const endpoint = prompt.toLowerCase() === "clear" ? '/clear' : '/chat';
        const data = prompt.toLowerCase() === "clear" ? { id: customId } : { prompt, customId, ...(link && { link }) };
        const res = await axios.post(`https://cadis.onrender.com${endpoint}`, data);
        return res.data.message;
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    config: {
        name: "gem",
        category: "ai"
    },
    onStart: async ({ message: { reply }, args, event: { senderID, messageReply }, commandName }) => {
        const response = messageReply?.attachments?.[0]?.type === "photo"
            ? await gem(args.join(" ") || "hello", senderID, messageReply.attachments[0].url)
            : await gem(args.join(" ") || "hello", senderID);
        
        const { messageID } = await reply(response);
        global.GoatBot.onReply.set(messageID, { commandName, senderID });
    },
    onReply: async ({ Reply: { senderID: replySenderID, commandName }, message: { reply }, args, event: { senderID: eventSenderID } }) => {
        if (replySenderID !== eventSenderID) return;
        
        const response = await gem(args.join(" ") || "hello", eventSenderID);
        const { messageID } = await reply(response);
        global.GoatBot.onReply.set(messageID, { commandName, messageID, senderID: eventSenderID });
    }
};
