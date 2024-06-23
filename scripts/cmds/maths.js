const { getPrefix, getStreamFromURL, uploadImgbb } = global.utils;

async function ai({ message: m, event: e, args: a, usersData: u }) {
    var prefixes = [
        `${await getPrefix(e.threadID)}${this.config.name}`,
        `${this.config.name}`
        // Add more prefixes here if needed
    ];

    if (prefixes.some(prefix => a[0].toLowerCase().startsWith(prefix))) {
        try {
            let prompt = "";

            if (e.type === "message_reply" && e.messageReply.attachments && e.messageReply.attachments[0]?.type === "photo") {
                const uploadedImage = await uploadImgbb(e.messageReply.attachments[0].url);
                prompt = a.slice(1).join(" ") + ' ' + uploadedImage.image.url;
            } else {
                prompt = a.slice(1).join(" ");
            }

            var userTag = await u.getName(e.senderID);
            var user = [{ id: e.senderID, tag: userTag }];

            const response = await require("axios").post(`https://test-ai-ihc6.onrender.com/api`, {
                prompt: prompt,
                apikey: "GayKey-oWHmMb1t8ASljhpgSSUI",
                name: user[0].tag,
                id: user[0].id
            });

            var result = response.data.result.replace(/{name}/g, user[0].tag).replace(/{pn}/g, prefixes[0]);

            if (response.data.av) {
                if (Array.isArray(response.data.av)) {
                    const avStreams = response.data.av.map(url => getStreamFromURL(url));
                    const avAttachments = await Promise.all(avStreams);
                    m.reply({
                        body: result,
                        mentions: user,
                        attachment: avAttachments
                    });
                } else {
                    m.reply({
                        body: result,
                        mentions: user,
                        attachment: await getStreamFromURL(response.data.av)
                    });
                }
            } else {
                m.reply({
                    body: result,
                    mentions: user
                });
            }
        } catch (error) {
            m.reply("Error " + error);
        }
    }
}

module.exports = {
    config: {
        name: "maths",
        aliases: [],
        version: 1.6,
        author: "Jun",
        role: 0,
        shortDescription: "An AI that can do various tasks",
        guide: "{pn} <query>",
        category: "AI"
    },
    onStart: function() {},
    onChat: ai
};
