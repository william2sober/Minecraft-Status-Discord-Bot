const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const https = require('https');
const fs = require('fs');

const TOKEN = '';
const CHANNEL_ID = '';
const SERVER_IP = '';
const EMBED_FILE = 'embed.json';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

function getServerStatus() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.mcsrvstat.us',
            path: `/2/${SERVER_IP}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (MinecraftStatusBot)'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    console.error('JSON parsing failed:', data);
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function updateEmbed() {
    try {
        const status = await getServerStatus();
        if (!status) return;

        const guild = client.guilds.cache.first();
        const serverIconURL = guild.iconURL({ dynamic: true, size: 512 });

        const timestamp = Math.floor(Date.now() / 1000);
        
        const onlineEmoji = '🟢'; 
        const offlineEmoji = '🔴';
        const onlineColor = '#00FF00';
        const offlineColor = '#FF0000';

        const embed = new EmbedBuilder()
            .setTitle('Minecraft Server Status')
            .setColor(status.online ? onlineColor : offlineColor)
            .setDescription(status.online ? `${onlineEmoji} **Online**` : `${offlineEmoji} **Offline**`)
            .setThumbnail(serverIconURL)
            .addFields(
                { name: '📍 Server IP', value: SERVER_IP, inline: true },
                { name: '👥 Players', value: status.online && status.players ? `${status.players.online}/${status.players.max}` : 'N/A', inline: true },
                { name: '⏰ Last Update', value: `<t:${timestamp}:R>`, inline: true }
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
    updateEmbed();
    setInterval(updateEmbed, 30000);
});

client.login(TOKEN);
