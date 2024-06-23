const axios = require('axios');
const prompt = "kamu adalah raffa";

module.exports = {
 config: {
 name: "riz",
 aliases: ["claude"], 
 version: "1.0", 
 author: "Rizky Z (hadi)", 
 countDown: 6,
 role: 0,
 category: "MEDIA", 
 description: "bertanya dengan pipi ai", 
 usage: { en: "{pn} <question>" }
},

onStart: async function ({ message, args, api, event }) {
if (!args) return message.reply('Harap berikan pertanyaan!');

if (args) {
message.reaction("⌛", event.messageID);
 const id = event.senderID;
 const hadi = args.join(' ');
 const input = `${prompt}. User input: ${hadi}`;
 const pipi = await axios.get(`https://hashier-api-claude.vercel.app/api/claude?ask=${encodeURIComponent(input)}`);
 const raffa = pipi.data.response;

message.reaction("✅", event.messageID);
message.reply(raffa);

} else if (error) {
 return message.reply('Error');
    }
   }
}
