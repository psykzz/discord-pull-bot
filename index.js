const Discord = require("discord.js");
const client = new Discord.Client();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || 'MzM4MDAxODAyMjkxMDUyNTQ0.DVpNOQ.WOzAegRIR6Q9jEN5GAg1f76rpSU';

const COUNTING_DOWN = {}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('message', async msg => {
  if(!msg.member) return console.log('[skip] no member');
  if(!msg.guild) return console.log('[skip] no guild');
  if(msg.author.bot) return console.log('[skip] bot user');

  const match = /^\/pull (\d)+\s*$/gi.exec(msg.content)
  if (!match) {
    return console.log('[skip] no match');
  }

  if(COUNTING_DOWN[msg.guild.id]) return console.log('[skip] already counting down');

  let connection;
  if (msg.member.voiceChannel) {
    connection = await msg.member.voiceChannel.join();
  }

  const pullTimer = Math.min(match[1], 60);
  let lastMsg = await msg.reply(`Pulling in ${pullTimer} seconds.`)
  countdown(connection, msg, lastMsg, pullTimer);

});

const playSound = async (connection, voice, timer, limit) => {
  if (!connection) return console.log('[skip-timer] no connection')
  if (timer > limit) return console.log('[skip-timer] over limit')
  return connection.playFile(`./sounds/${voice}/${timer}.ogg`)
}

const countdown = async (connection, originalMsg, lastMsg, pullTimer) => {
  pullTimer -= 1;

  const voice = 'Corsica';

  Promise.all([
    lastMsg.delete(),
    originalMsg.reply(`Pulling in ${pullTimer} seconds`),
    playSound(connection, voice, pullTimer, 3)
  ]).then(values => {
    if (pullTimer > 0) {
      setTimeout(() => {
        countdown(connection, originalMsg, values[1], pullTimer);
      }, 1000);
    } else {
      values[1].delete()
      originalMsg.delete()
      if(connection) {connection.disconnect()}
      COUNTING_DOWN[originalMsg.guild.id] = false;
    }
  })
}



client.login(DISCORD_TOKEN);
