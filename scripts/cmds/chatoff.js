global.zenLeaf = {};

module.exports = {
    config: {
        name: "chatoff",
        version: "1.0",
        description: "Command to turn on/off chat",
        guide: {
            en: "Turn on/off chat"
        },
        category: "box chat",
        countDown: 5,
        role: 0,
        author: "Annaleiah"
    },
    
    langs: {
        en: {
            "onlyAdmin": "You do not have permission to use this command!"
        }
    },

    onStart: async function ({ message, args, role, getLang, event }) {
        if (args[0] === "on") {
            if (role < 1) {
                return message.reply(getLang("onlyAdmin")); 
            }
            
            const threadID = event.threadID; 
            global.zenLeaf[threadID] = global.zenLeaf[threadID] || {};
            global.zenLeaf[threadID].chatEnabled = true;
            message.reply("Chat off is now disabled. Members can now freely chat.");
        } else if (args[0] === "off") {
            if (role < 1) {
                return message.reply(getLang("onlyAdmin")); 
            }
            
            const threadID = event.threadID; 
            global.zenLeaf[threadID] = global.zenLeaf[threadID] || {};
            global.zenLeaf[threadID].chatEnabled = false;
            message.reply("Chat off enabled. Members who chat will be kicked.");
        }
    },

    onChat: async function ({ message, event, api, getLang, role }) {
        const threadID = event.threadID; 
        const chatEnabled = global.zenLeaf[threadID]?.chatEnabled ?? true;

        if (!chatEnabled) {
            if (role < 1) {
                // Kick user if chat is disabled
                api.removeUserFromGroup(event.senderID, threadID, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
                message.reply("CHAT DETECTED | The group is currently on chat off. You have been kicked from the group.");
            }
        }
    }
};
