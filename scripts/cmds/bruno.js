const axios = require('axios');

const prefixes = ['bruno'];

module.exports = {
  config: {
    name: 'bruno',
    aliases: [],
    version: '1.0',
    author: 'August Quinn/Jhon Talamera',
    role: 0,
    category: 'fun',
    shortDescription: {
      en: 'Summon the bruno spirit for quirky responses.',
    },
    longDescription: {
      en: 'Invoke the bruno spirit to provide quirky and humorous responses to your questions.',
    },
    guide: {
      en: '/bruno [prompt]',
    },
  },
  onStart: async function () {
    console.log('Bruno command is ready.');
  },
  onChat: async function ({ api, event, args }) {
    const [prefix, ...prompt] = args;

    if (prefix.toLowerCase() === 'bruno') {
      try {
        if (prompt.length === 0) {
          return api.sendMessage('Please provide a prompt for bruno.', event.threadID, event.messageID);
        }

        const apiUrl = `https://ai-1stclass-nemory-project.vercel.app/api/llama?ask=${encodeURIComponent(prompt.join(' '))}`;

        // Make a GET request to the API for bruno-like responses
        const response = await axios.get(apiUrl);

        if (response.status !== 200 || !response.data || !response.data.response) {
          throw new Error('Failed to generate bruno-like response.');
        }

        const brunoResponse = response.data.response;
        const responseMessage = `🦙 𝗕𝗥𝗨𝗡𝗢 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘:\n${brunoResponse}`;

        // Reply with the bruno response
        await api.sendMessage(responseMessage, event.threadID, event.messageID);

        console.log('Bruno-like response generated successfully.');
      } catch (error) {
        console.error(`Failed to generate bruno-like response: ${error.message}`);
        api.sendMessage(
          `An error occurred: ${error.message}. Please check your input and try again.`,
          event.threadID,
          event.messageID
        );
      }
    }
  },
};
