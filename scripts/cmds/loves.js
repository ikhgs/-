const axios = require('axios');

let lastBotResponse = ''; // Variable pour stocker la dernière réponse du bot

module.exports = {
  config: {
    name: "love", // Changement du nom en "Bruno"
    author: "cliff", // API by hazey
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
      // Ajouter la dernière réponse du bot au prompt, si elle existe
      let prompt = lastBotResponse ? `${lastBotResponse}\nUser: ${args.join(" ")}` : args.join(" ");
      
      if (!prompt) {
        return api.sendMessage("Please provide a prompt for Bruno.", event.threadID);
      }

      // Afficher le message de patience
      await api.sendMessage("Veuillez patienter.....", event.threadID);

      // Attendre un peu avant d'envoyer la réponse finale
      await new Promise(resolve => setTimeout(resolve, 2000)); // attendre 2 secondes

      const encodedPrompt = encodeURIComponent(prompt);
      // Remplacer l'URL de l'API par la nouvelle
      const apiUrl = `https://gemma-7b-it.vercel.app/?ask=${encodedPrompt}`;

      const response = await axios.get(apiUrl);

      if (response.data && response.data.response) {
        // Stocker la dernière réponse du bot
        lastBotResponse = `Bot: ${response.data.response}`;
        
        // Modifier le message pour utiliser le nom "Bruno"
        const message = `❤️👍 Bruno AI👈❤️\n\n${response.data.response}`;
        api.sendMessage(message, event.threadID);
      } else {
        api.sendMessage("Unable to get a response from Bruno.", event.threadID);
      }
    } catch (error) {
      console.error('Error making Bruno API request:', error.message);
      api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
  }
};
