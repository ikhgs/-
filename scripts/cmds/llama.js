const axios = require('axios');

module.exports = {
  config: {
    name: "llama",
    author: "cliff", //api by hazey
    version: "1.0.0",
    countDown: 5,
    role: 0,
    category: "Ai",
    shortDescription: {
      en: "{p}mixtral"
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      if (!args[0]) {
        return api.sendMessage("Please provide a prompt for Llama.", event.threadID);
      }

      // Envoyer le message de patience
      await api.sendMessage("Veuillez patienter.....", event.threadID);

      // Attendre un peu avant d'envoyer la réponse finale
      await new Promise(resolve => setTimeout(resolve, 2000)); // attendre 2 secondes

      const prompt = encodeURIComponent(args.join(" "));
      const apiUrl = `https://llama3-8b-8192.vercel.app/?ask=${prompt}`;

      const response = await axios.get(apiUrl);

      if (response.data && response.data.response) {
        const message = `❤️👍 Bruno AI👈❤️\n\n${response.data.response}`;
        api.sendMessage(message, event.threadID);
      } else {
        api.sendMessage("Unable to get a response from Llama3.", event.threadID);
      }
    } catch (error) {
      console.error('Error making Llama API request:', error.message);
      api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
  }
};
