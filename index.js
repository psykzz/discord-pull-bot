const Discord = require("discord.js");
const client = new Discord.Client();
var fs = require('fs');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const COUNTING_DOWN = {}

const ROASTS = [
  "Your family tree is a fucking circle :babyrage~1:",
];

client.on('error', (err) => {
  console.log(`An error occurred!`);
  console.log(err);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`on ${client.guilds.size} Servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} Servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`Remove from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} Servers`);
});


async function registerSound(msg, trigger, soundPath) {
    if (!msg.member.voiceChannel) return
    var pattern = new RegExp(`^\/${trigger}$`, 'gi');
    var match = pattern.exec(msg.content);
    if (!match) return;
    if (!fs.existsSync(soundPath)) return;

    let connection = await msg.member.voiceChannel.join();
    let dispatcher = connection.playFile(soundPath);

    dispatcher.on('speaking', (speaking) => {
        if(!speaking) connection.disconnect();
    });

    return true;
}

async function registerMessage(msg, trigger, reply) {
  var pattern = new RegExp(`^\/${trigger}$`, 'gi');
  var match = pattern.exec(msg.content);
  if (!match) return;

  msg.reply(reply);
}

async function registerFunction(msg, trigger, callback) {
  var pattern = new RegExp(`^\/${trigger}$`, 'gi');
  var match = pattern.exec(msg.content);
  if (!match) return;
  
  return callback();
}

client.on('message', async msg => {
  if(!msg.member) return console.log('[skip] no member');
  if(!msg.guild) return console.log('[skip] no guild');
  if(msg.author.bot) return console.log('[skip] bot user');

  registerSound(msg, 'lettuce', './sounds/random/15footfungus.ogg');
  registerSound(msg, 'shutdown', './sounds/random/winxpshutdown.ogg');
  registerSound(msg, 'ree', './sounds/Jerry/ree.ogg');
  
  registerFunction(msg, 'roast', () => {
    var roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
    if(msg.mentions.users) {
      return msg.channel.send(roast, {reply: msg.mentions.users})
    }
    msg.reply(roast);  
  })

  const match = /^\/pull (\d+)\s*$/gi.exec(msg.content)
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
  if (!fs.existsSync(`./sounds/${voice}/${timer}.ogg`)) return console.log('[skip-timer] file not found');
  return connection.playFile(`./sounds/${voice}/${timer}.ogg`)
}

const countdown = async (connection, originalMsg, lastMsg, pullTimer) => {
  const voice = 'Jerry';

  Promise.all([
    lastMsg.delete(),
    originalMsg.reply(`Pulling in ${pullTimer} seconds`),
    playSound(connection, voice, pullTimer, 3)
  ]).then(values => {
    if (pullTimer > 0) {
      setTimeout(() => {
        countdown(connection, originalMsg, values[1], pullTimer - 1);
      }, 1000);
    } else {
      values[1].delete()
      originalMsg.delete()
      if(connection) {
        setTimeout(() => {
          connection.disconnect();
        }, 250);
      }
      COUNTING_DOWN[originalMsg.guild.id] = false;
    }
  })
}



client.login(DISCORD_TOKEN);
