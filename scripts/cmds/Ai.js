const axios = require('axios');

module.exports = {
  config: {
    name: "ai",
    author: "cliff",//api by hazey
    version: "1.0.0",
    countDown: 5,
    role: 0,
    category: "ai",
    shortDescription: {
      en: "ai"
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      if (!args[0]) {
        return api.sendMessage("Please provide a prompt for ai.", event.threadID);
      }

      const searchMessage = await api.sendMessage(`🔍 ❤️Bruno❤️ répondra à votre question, mais veuillez patienter....`, event.threadID);

      const prompt = encodeURIComponent(args.join(" "));
      const apiUrl = `https://hashier-api-snowflake.vercel.app/api/snowflake?ask=${prompt}`;

      const response = await axios.get(apiUrl);

      if (response.data && response.data.response) {
        // Si une réponse est obtenue, supprimez le message de recherche et envoyez la réponse
        api.deleteMessage(searchMessage.messageID, event.threadID);
        api.sendMessage(response.data.response, event.threadID);
      } else {
        // Si aucune réponse n'est obtenue, informez l'utilisateur
        api.deleteMessage(searchMessage.messageID, event.threadID);
        api.sendMessage("Unable to get a response from Snoflake.", event.threadID);
      }
    } catch (error) {
      console.error('Error making Snoflake API request:', error.message);
      api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
  }
};

