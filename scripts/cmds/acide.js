const axios = require('axios');

const prefixes = ['acide'];

module.exports = {
  config: {
    name: 'acide',
    aliases: [],
    version: '1.1',
    author: 'August Quinn/Jhon Talamera',
    role: 0,
    category: 'fun',
    shortDescription: {
      en: 'Summon the acide spirit for quirky responses.',
    },
    longDescription: {
      en: 'Invoke the acide spirit to provide quirky and humorous responses to your questions.',
    },
    guide: {
      en: '/acide [prompt]',
    },
  },
  onStart: async function () {
    console.log('Acide command is ready.');
  },
  onChat: async function ({ api, event, args }) {
    const [prefix, ...prompt] = args;

    if (prefix.toLowerCase() === 'acide') {
      if (prompt.length === 0) {
        return api.sendMessage('Please provide a prompt for acide.', event.threadID, event.messageID);
      }

      try {
        const apiUrl = `https://ai-1stclass-nemory-project.vercel.app/api/gemma?ask=${encodeURIComponent(prompt.join(' '))}`;

        // Make a GET request to the API for acide-like responses
        const response = await axios.get(apiUrl);

        if (response.status !== 200 || !response.data || !response.data.response) {
          throw new Error('Failed to generate acide-like response.');
        }

        const acideResponse = response.data.response;
        const responseMessage = `🦙 𝗔𝗖𝗜𝗗𝗘 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘:\n${acideResponse}`;

        // Reply with the acide response
        await api.sendMessage(responseMessage, event.threadID, event.messageID);

        console.log('Acide-like response generated successfully.');
      } catch (error) {
        console.error(`Failed to generate acide-like response: ${error.message}`);
        api.sendMessage(
          `An error occurred while generating the response: ${error.message}. Please try again later.`,
          event.threadID,
          event.messageID
        );
      }
    }
  },
};
