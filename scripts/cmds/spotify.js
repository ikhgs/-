const fs = require('fs');
const axios = require('axios');

module.exports = {
    config: {
        name: "spotify",
        version: "4.6",
        author: "ArYAN",
        countDown: 10,
        role: 0,
        shortDescription: { en: 'Search and download music from Spotify' },
        longDescription: { en: "Search for music on Spotify and download your favorite tracks with detailed information." },
        category: "music",
        guide: { 
            en: '{p}s <song name> - Search for a song on Spotify\n'
                + 'After receiving the search results, reply with the song ID to download the track.\n'
                + 'Example:\n'
                + '  {p}spotify Blinding Lights\n'
                + '  Reply with "1 to 10" for download the first track in the list.'
        }
    },

    onStart: async function ({ api, event, args }) {
        const listensearch = encodeURIComponent(args.join(" "));
        const apiUrl = `https://spdl-v1.onrender.com/search?q=${listensearch}`;
        
        if (!listensearch) {
            return api.sendMessage("Please provide the name of the song you want to search.", event.threadID, event.messageID);
        }

        try {
            api.sendMessage("🎵 | Searching music on Spotify. Please wait...", event.threadID, event.messageID);
            const response = await axios.get(apiUrl);
            const tracks = response.data;

            if (tracks.length > 0) {
                const topTracks = tracks.slice(0, 10);
                let message = "🎶 𝗦𝗽𝗼𝘁𝗶𝗳𝘆\n\n━━━━━━━━━━━━━\n🎶 | Here is the top 10 Tracks\n\n";
                
                topTracks.forEach((track, index) => {
                    message += `🆔 ID: ${index + 1}\n`;
                    message += `📝 Title: ${track.name}\n`;
                   message += `📅 Release Date: ${track.release_date}\n`;
                    message += `⏱️ Duration: ${formatDuration(track.duration_ms)}\n`;
                    message += `📀 Album: ${track.album}\n`;
                    message += `🎧 Preview URL: ${track.preview_url}\n`;
                    message += `⚙️ URL: ${track.external_url}\n`;
                    message += "━━━━━━━━━━━━━\n"; // Separator between tracks
                });

                message += "\nReply with the number of the song ID you want to download.";
                api.sendMessage(message, event.threadID, (err, info) => {
                    if (err) return console.error(err);
                    global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, messageID: info.messageID, author: event.senderID, tracks: topTracks });
                });
            } else {
                api.sendMessage("❓ | Sorry, couldn't find the requested music on Spotify.", event.threadID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage("🚧 | An error occurred while processing your request.", event.threadID);
        }
    },

    onReply: async function ({ api, event, Reply, args, message }) {
        const reply = parseInt(args[0]);
        const { author, tracks } = Reply;

        if (event.senderID !== author) return;

        try {
            if (isNaN(reply) || reply < 1 || reply > tracks.length) {
                throw new Error("Invalid selection. Please reply with a number corresponding to the track.");
            }

            const selectedTrack = tracks[reply - 1];
            const downloadUrl = selectedTrack.external_url;
            const downloadApiUrl = `https://spdl-v1.onrender.com/download?q=${encodeURIComponent(downloadUrl)}`;

            // Send waiting message and react to it
            api.sendMessage("⏳ | Downloading your song request. Please wait.....", event.threadID, (err, info) => {
                if (err) return console.error(err);

                // React to the waiting message with a waiting emoji
                api.setMessageReaction("⏳", info.messageID);

                (async () => {
                    try {
                        // First API call to get the download link
                        const downloadLinkResponse = await axios.get(downloadApiUrl);
                        const downloadLink = downloadLinkResponse.data;

                        // Now download the actual audio file using the obtained link
                        const filePath = `${__dirname}/cache/${Date.now()}.mp3`;
                        const writeStream = fs.createWriteStream(filePath);
                        const audioResponse = await axios.get(downloadLink, { responseType: 'stream' });

                        audioResponse.data.pipe(writeStream);

                        writeStream.on('finish', () => {
                            // React with checkmark emoji to indicate download completion
                            api.setMessageReaction("✅", info.messageID);

                            // Send detailed message with attachment
                            api.sendMessage({
                                body: `🎶 𝗦𝗽𝗼𝘁𝗶𝗳𝘆\n\n━━━━━━━━━━━━━\nHere's your music ${selectedTrack.name} from Spotify.\n\nEnjoy listening!\n\n📝 Title: ${selectedTrack.name}\n👑 Artist: ${selectedTrack.artists.join(', ')}\n📅 Release Date: ${selectedTrack.release_date}\n⏱️ Duration: ${formatDuration(selectedTrack.duration_ms)}\n📀 Album: ${selectedTrack.album}\n🎧 Preview URL: ${selectedTrack.preview_url}\nDownload Song: ${downloadLink}`,
                                attachment: fs.createReadStream(filePath),
                            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
                        });

                        writeStream.on('error', (err) => {
                            console.error(err);
                            api.sendMessage("🚧 | An error occurred while processing your request.", event.threadID);
                        });
                    } catch (error) {
                        console.error(error);
                        api.sendMessage(`🚧 | An error occurred while processing your request: ${error.message}`, event.threadID);
                    }
                })();
            });

        } catch (error) {
            console.error(error);
            api.sendMessage(`🚧 | An error occurred while processing your request: ${error.message}`, event.threadID);
        }

        api.unsendMessage(Reply.messageID);
        global.GoatBot.onReply.delete(Reply.messageID);
    }
};

function formatDuration(duration_ms) {
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
