const axios = require("axios");

module.exports = {
  config: {
    name: "bing",
    description: "Talk to Bing AI",
    usage: "bing [prompt]",
    cooldown: 5,
    accessableby: 0, // Accessible to everyone
    category: "AI",
    prefix: false,
    author: "heru",
  },
  start: async function ({ api, event, text, react, reply }) {
    const { messageID, threadID } = event;
    const prompt = text.join(" ");

    if (!prompt) return reply("Please provide a prompt.");

    try {
      react("⏳");
      const rona = await new Promise(resolve => {
        api.sendMessage('Fetching response from Bing AI, please wait...', threadID, (err, info) => {
          resolve(info);
        });
      });

      const response = await axios.get(`https://joshweb.click/bing?prompt=${encodeURIComponent(prompt)}&mode=1`);
      const result = response.data.bing;

      react("✅");
      await api.editMessage(`🧠 | 𝙱𝚒𝚗𝚐 𝙰𝚒\n━━━━━━━━━━━━━━━━━━\n${result}`, rona.messageID);
    } catch (error) {
      react("❌");
      reply(`An error occurred: ${error.message}`);
    }
  }
};
    
