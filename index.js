const Discord = require("discord.js");
const client = new Discord.Client();
var fs = require('fs');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const COUNTING_DOWN = {}

const ROASTS = [
  `Your family tree is a fucking circle.`,
  `I'd give you a nasty look but you've already got one.`,
  `If you're going to be two-faced, at least make one of them pretty.`,
  `I love what you've done with your hair. How do you get it to come out of the nostrils like that?`,
  `If laughter is the best medicine, your face must be curing the world.`,
  `The only way you'll ever get laid is if you crawl up a chicken's ass and wait.`,
  `It looks like your face caught fire and someone tried to put it out with a hammer.`,
  `If I wanted a bitch, I'd have bought a dog.`,
  `I'd like to see things from your point of view, but I can't seem to get my head that far up your ass.`,
  `I've seen people like you before, but I had to pay admission.`,
  `Scientists say the universe is made up of neutrons, protons and electrons. They forgot to mention morons.`,
  `You're so fat you could sell shade.`,
  `Why is it acceptable for you to be an idiot but not for me to point it out?`,
  `Your lips keep moving but all I hear is "Blah, blah, blah."`,
  `Your family tree must be a cactus because everyone on it is a prick.`,
  `You'll never be the man your mother is.`,
  `Did you know they used to be called "Jumpolines" until your mum jumped on one?`,
  `Just because you have one doesn't mean you need to act like one.`,
  `I'm sorry, was I meant to be offended? The only thing offending me is your face.`,
  `Someday you'll go far... and I hope you stay there.`,
  `Which sexual position produces the ugliest children? Ask your mother.`,
  `Stupidity's not a crime, so you're free to go.`,
  `If I had a face like yours I'd sue my parents.`,
  `Your doctor called with your colonoscopy results. Good news - they found your head.`,
  `No, those pants don't make you look fatter - how could they?`,
  `What's the difference between your girlfriend and a walrus? One has a moustache and smells of fish and the other is a walrus.`,
  `Save your breath - you'll need it to blow up your date.`,
  `You're not stupid; you just have bad luck when thinking.`,
  `If you really want to know about mistakes, you should ask your parents.`,
  `Please, keep talking. I always yawn when I am interested.`,
  `The zoo called. They're wondering how you got out of your cage?`,
  `Jesus loves you... but everyone else thinks you're an asshole.`,
  `Whatever kind of look you were going for, you missed.`,
  `I was hoping for a battle of wits but you appear to be unarmed.`,
  `Hey, you have something on your chin... no, the 3rd one down.`,
  `Aww, it's so cute when you try to talk about things you don't understand.`,
  `I don't know what makes you so stupid, but it really works.`,
  `You are proof that evolution can go in reverse.`,
  `Brains aren't everything. In your case they're nothing.`,
  `I thought of you today. It reminded me to take the garbage out.`,
  `You're so ugly when you look in the mirror, your reflection looks away.`,
  `When you were born, the doctor came out to the waiting room and said to your dad, "I'm very sorry. We did everything we could. But he pulled through."`,
  `I'm sorry I didn't get that - I don't speak idiot.`,
  `Quick - check your face! I just found your nose in my business.`,
  `It's better to let someone think you're stupid than open your mouth and prove it.`,
  `Hey, your village called - they want their idiot back.`,
  `Were you born this stupid or did you take lessons?`,
  `I've been called worse by better.`,
  `You're such a beautiful, intelligent, wonderful person. Oh I'm sorry, I thought we were having a lying competition.`,
  `I may love to shop but I'm not buying your bull.`,
  `Don't you get tired of putting make up on two faces every morning?`,
  `I'd slap you but I don't want to make your face look any better.`,
  `Calling you an idiot would be an insult to all stupid people.`,
  `Gay? I'm straighter than the pole your mom dances on.`,
  `I just stepped in something that was smarter than you... and smelled better too.`,
  `You have the right to remain silent because whatever you say will probably be stupid anyway.`,
];

client.on('error', (err) => {
  console.log(`An error occurred!`);
  console.log(err);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`on ${client.guilds.size} Servers`);
  client.user.setUsername('HeiHei'); // Set new name
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
  
    if (!msg.member.voiceChannel.joinable) return msg.reply(`I don't have access to that channel.`);
    if (!msg.member.voiceChannel.speakable) return msg.reply(`I can't speak in that channel.`);

    let connection = await msg.member.voiceChannel.join();
    let dispatcher = connection.playFile(soundPath);

    dispatcher.on('speaking', (speaking) => {
        if(!speaking) connection.disconnect();
        msg.delete();
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
  var pattern = new RegExp(`^\/${trigger}`, 'gi');
  var match = pattern.exec(msg.content);
  if (!match) return;

  return callback();
}

client.on('message', async msg => {
    if(msg.content.indexOf('@everyone') === -1) return;
    const ree = client.emojis.find("name", "pingree");
    const ree2 = client.emojis.find("name", "angreeping");
    if(!ree) ree = '💩';
    msg.react(ree);
    if(ree2) msg.react(ree2);
})

client.on('message', async msg => {
  if(!msg.member) return console.log('[skip] no member');
  if(!msg.guild) return console.log('[skip] no guild');
  if(msg.author.bot) return console.log('[skip] bot user');



  registerSound(msg, 'lettuce', './sounds/random/15footfungus.ogg');
  registerSound(msg, 'shutdown', './sounds/random/winxpshutdown.ogg');
  registerSound(msg, 'ree', './sounds/Jerry/ree.ogg');
  registerSound(msg, 'waaah', './sounds/random/coffee/Waaaaaah.ogg');
  registerSound(msg, 'wow', './sounds/random/coffee/Wow.ogg');
  registerSound(msg, 'nazijoke', './sounds/random/nazi-knockknock.ogg');
  registerSound(msg, 'omae', './sounds/random/omae.ogg');
  registerSound(msg, 'nani', './sounds/random/nani.ogg');
  registerSound(msg, 'imfine', './sounds/random/im-fine.ogg');
  registerSound(msg, 'faces', './sounds/random/familiar-faces.ogg');

  registerFunction(msg, 'roast', () => {
    var roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
    if(msg.mentions.members) {
      return msg.channel.send(`${msg.mentions.members.array().join(', ')}, ${roast}`)
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
