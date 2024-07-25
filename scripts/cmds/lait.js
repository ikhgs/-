const axios = require('axios');

module.exports = {
    config: {
        name: 'lait',
        version: '1.0.3',
        hasPermssion: 0,
        credits: 'Yan Maglinte',
        description: 'Free AI Chatbot!',
        usePrefix: false,
        commandCategory: 'chatbots',
        usages: 'Ai prompt!',
        cooldowns: 0,
    },

    onStart: async function({ api, event, args }) {
        const prompt = args.join(' ');
        const credits = this.config.credits;

        if (!prompt) {
            return api.sendMessage('Hello 👋 How can I help you today?', event.threadID, event.messageID);
        }

        if (event.type === 'message_reply' && event.messageReply.attachments) {
            const attachment = event.messageReply.attachments[0];
            if (attachment.type === 'photo') {
                const image_url = attachment.url;

                try {
                    const response = await axios.post('https://joshweb.click/new/gemini', {
                        prompt: prompt,
                        credits: credits,
                        image_url: image_url,
                    });

                    const data = response.data;
                    const output = data.result;
                    api.sendMessage(output, event.threadID, event.messageID);
                } catch (error) {
                    console.error('Error:', error);
                    api.sendMessage('⚠️ An error occurred!', event.threadID, event.messageID);
                }
                return;
            }
        }

        try {
            const response = await axios.post('https://joshweb.click/new/gemini', {
                prompt: prompt,
                credits: credits,
            });

            const data = response.data;
            const output = data.result;
            api.sendMessage(output, event.threadID, event.messageID);
        } catch (error) {
            console.error('Error:', error);
            api.sendMessage('⚠️ An error occurred!', event.threadID, event.messageID);
        }
    }
};
