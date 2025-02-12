const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  config: {
    name: "miova",
    usePrefix: true,
    description: "Get the URLs of the first two images when the user replies to an image.",
    hasPermssion: 0, // 0 for all users, 1 for admin, 2 for dev
    credits: "OPERATOR ISOY",
    commandCategory: "template",
    usages: "",
    cooldowns: 5,
  },
  onStart: async function ({ api, event, args, commandModules }) {
    const geminiApiUrl = "https://joshweb.click/new/gemini"; 

    try {
      const text = args.join(" ");
      if (!text) {
        return api.sendMessage("Please provide a question or query", event.threadID, event.messageID);
      }

      let imageBase64Array = [];

      if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const attachments = event.messageReply.attachments;

        imageBase64Array = await Promise.all(attachments.map(async (attachment) => {
          if (attachment.type === "photo" || attachment.type === "animated_image" || attachment.type === "video") {
            const imageData = await downloadAndSaveImage(attachment.url, attachment.type);
            return imageData;
          }
        }));
      }

      const response = await axios.post(geminiApiUrl, {
        prompt: text,
        imageBase64Array,
      });

      const data = response.data.content;

      api.sendMessage(data, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing the command.", event.threadID);
    }
  },
};

async function downloadAndSaveImage(imageUrl, imageType) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data);

    const fileExtension = imageType === "video" ? "mp4" : "png";
    const fileName = `gemini_${Date.now()}.${fileExtension}`;

    const imagePath = path.join(__dirname, "cache", fileName);
    await fs.writeFile(imagePath, imageBuffer);

    const imageData = await fs.readFile(imagePath, { encoding: "base64" });
    return imageData;
  } catch (error) {
    console.error("Error downloading and saving image:", error);
    throw error;
  }
}
