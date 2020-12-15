const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
//UPTIME ROBOT (WEB)
const { get } = require("snekfetch");
const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log("Pinging");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://cmd-handler.glitch.me/`);
}, 280000);

client.on("ready", async () => {
  let serverIn = await client.guilds.cache.size;
  let membersCount = client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0)
  console.log(`${client.user.username} is ready!`);
  client.user.setPresence({
    activity: { 
      name: `${serverIn} Servers! | ${membersCount} Players! | aj!help`,
      type: 'WATCHING'
    },
      status: 'online' 
  })
  .catch(console.error);
});

client.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;
  
  //CMD HANDLER
  if (message.author.bot) return null;
  if (message.content.indexOf(config.prefix) !== 0) return null;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g); // (" ");
  const cmd = args.shift().toLowerCase();
  try {
    const commandsFile = require(`./commands/${cmd}.js`);
    commandsFile.run(client, message, args);
  } catch (e) {
    console.log(e.message)
  } finally {
    console.log(`${message.author.tag} menggunakan command ${config.prefix}${cmd}`);
  }
  
  
});

client.login(process.env.TOKEN);
