const axios = require("axios");

module.exports = {
  config: {
    name: "pickuplines",
    aliases: ["pickupline"],
    version: "1.0.1",
    author: "Lorenzo",
    countDown: 5,
    role: 0,
    description: "Get pickup lines English/Tagalog",
    longDescription: {
      en: "Get random pickup lines.",
    },
    category: "fun",
    guide: {
      en: "{prefix}pickuplines",
    },
  },

  onStart: async function ({ api, event }) {
    try {
      const response = await axios.get("https://lorenzorestapi.onrender.com/api/pickupline");
      const { pickupline } = response.data;
      const message = `『 𝗛𝗲𝗿𝗲𝘀 𝘆𝗼𝘂𝗿 𝗿𝗮𝗻𝗱𝗼𝗺 𝗽𝗶𝗰𝗸𝘂𝗽𝗹𝗶𝗻𝗲 』${pickupline}`;
      return api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error(error);
    }
  },
};
