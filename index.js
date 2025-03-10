const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const https = require('https');
const fs = require('fs');

const TOKEN = '';
const CHANNEL_ID = '';
const SERVER_IP = '';
const JAVA_PORT = 30000;
const EMBED_FILE = 'embed.json';
const BANNER_URL = '';
const SERVER_ICON_URL = '';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

function getServerStatus() {
    return new Promise((resolve, reject) => {
        const url = `https://api.mcstatus.io/v2/status/java/${SERVER_IP}:${JAVA_PORT}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

async function updateEmbed() {
    try {
        const status = await getServerStatus();
        if (!status) return;

         const timestamp = Math.floor(Date.now() / 1000);
const embed = new EmbedBuilder()
    .setTitle('William’s Development Minecraft Server')
    .setColor(status.online ? 0x00ff00 : 0xff0000)
    .setDescription(status.online ? '<:Online:1347736658988105728> **Online**' : '<:Offline:1347736559004418048> **Offline**')
    .setImage(BANNER_URL)
    .addFields(
        { name: '<:Pin:1347736882674405489> Server Information', value: `**Server IP:** ${SERVER_IP}\n**Port:** ${JAVA_PORT}\n**Supports:** Java & Bedrock`, inline: false },
        { name: '<:Players:1347737171213156414> Players', value: status.online ? `${status.players.online}/${status.players.max}` : 'N/A', inline: true },
        { name: '<:Clock:1347737328126263367> Last Update', value: `<t:${timestamp}:R>`, inline: false }
    );

        let embedData = {};
        if (fs.existsSync(EMBED_FILE)) {
            embedData = JSON.parse(fs.readFileSync(EMBED_FILE, 'utf8'));
        } else {
            fs.writeFileSync(EMBED_FILE, JSON.stringify({ messageId: null }, null, 2));
        }

        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel) return console.error('Invalid channel ID.');

        if (embedData.messageId) {
            try {
                const message = await channel.messages.fetch(embedData.messageId);
                await message.edit({ embeds: [embed] });
            } catch {
                console.error('Failed to edit existing embed. Sending a new one.');
                const newMessage = await channel.send({ embeds: [embed] });
                embedData.messageId = newMessage.id;
                fs.writeFileSync(EMBED_FILE, JSON.stringify(embedData, null, 2));
            }
        } else {
            console.log('No embed found, sending a new one.');
            const newMessage = await channel.send({ embeds: [embed] });
            embedData.messageId = newMessage.id;
            fs.writeFileSync(EMBED_FILE, JSON.stringify(embedData, null, 2));
        }
    } catch (error) {
        console.error('Error updating embed:', error);
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    client.user.setActivity('Checking Server Status', { type: 'PLAYING' });

    updateEmbed();
    setInterval(updateEmbed, 30000);
});

client.login(TOKEN);
