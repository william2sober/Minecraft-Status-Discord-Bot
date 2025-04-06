# Minecraft Server Status Discord Bot

This project is a Discord bot that monitors the status of a Minecraft server (Java Edition) and sends regular updates to a specific Discord channel. It displays the server's current status, player count, and includes the server's banner and logo in an embedded message.

## Features

- Monitors Minecraft server status (Java Edition).
- Displays real-time server information like IP, port, and online player count.
- Sends regular updates to a Discord channel.
- Displays the Minecraft server's banner and icon.
- Updates every 30 seconds.
- Sets a custom playing status for the bot in Discord (Playing Minecraft).

## Requirements

- Node.js (version 16 or higher).
- A Discord bot token.
- A Discord channel ID to send the status updates.
- `https` and `fs` modules (built-in Node.js libraries).
- `discord.js` library.

## Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/william2sober/Minecraft-Status-Discord-Bot.git
cd Minecraft-Status-Discord-Bot
```

### Step 2: Install dependencies

Run the following command to install the necessary dependencies:

```bash
npm install discord.js
```

### Step 3: Configure the bot

1. Replace the `TOKEN` and `CHANNEL_ID` in `index.js` with your own bot token and channel ID.
2. Set the Minecraft server details in `SERVER_IP` and `JAVA_PORT`.

### Step 4: Run the bot

```bash
node index.js
```

Once the bot is running, it will begin sending the server status to the configured Discord channel every 30 seconds.

## Configuration

### Bot Token
You need to provide your bot token in the `TOKEN` variable. You can obtain this token by creating a bot on the [Discord Developer Portal](https://discord.com/developers/applications).

### Channel ID
Replace `CHANNEL_ID` with the ID of the Discord channel you want the bot to send the updates to. You can find the channel ID by enabling Developer Mode in Discord and right-clicking on the channel to "Copy ID".

### Server Information
Set the `SERVER_IP` and `JAVA_PORT` to the IP address and port number of the Minecraft server you wish to monitor. Make sure the server supports Java Edition.

### Server Banner and Icon
You can replace the default URLs for the server banner (`BANNER_URL`) and icon (`SERVER_ICON_URL`) with your own image URLs hosted on the web.

## Features & Customization

- **Status Update Frequency**: The bot updates the server status every 30 seconds. This can be changed by modifying the interval in the `setInterval()` function.
  
- **Playing Status**: The bot shows "Playing Minecraft" as its activity in Discord. You can change this to any other status you'd like by modifying the `setActivity()` method.

## Support

For support or inquiries, you can reach out via email or Discord:

- Email: [William2sober@gmail.com](mailto:William2sober@gmail.com)
- Discord: [https://discord.gg/8K2neBXVfg](https://discord.gg/G8hJGkZMqD)
