///
require('dotenv').config();
const { Client, Intents, MessageEmbed } = require("discord.js");
const loreBook = require("./resources/lore.json");

/// 
const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
    ],
});

///
const guildId = process.env.GUILD_ID;
const spChannelId = process.env.SP_CHANNEL_ID;
const welcomespChannelId = process.env.WELCOME_CHANNEL_ID;
const requiredRole = process.env.REQUIRED_ROLE;

bot
    .login(
        process.env.TOKEN
    )
    .then(() => {
        bot.user.setPresence({
            activities: [{ name: "$help", type: "PLAYING" }],
            status: "online",
        });
    });

///
bot.on("ready", () => {
    const guild = bot.guilds.cache.get(guildId);
    console.log(`Bot status: ONLINE (Serving '${guild.name}' | ${guild.id} | Bot name: ${bot.user.tag})`);

    //Get the guild members list
    guild.members.fetch()
        .then((members) => {
            console.log(`\n'${guild.name}' Member List:`);
            members.filter(member => !member.user.bot).forEach((member) => {
                console.log(`${member.user.username}#${member.user.discriminator} (${member.user.id})`);
            });
            console.log('\n');
        });

    //Send a gif to a shit posting channel every 45 mins
    setInterval(() => {
        //TODO: create a rule to only send this at reasonable times to not annoy people (bot gotta sleep too)
        const gifEmbed = new MessageEmbed()
            .setColor('#964B00')
            .setTitle('This is me right now 🦝 ... felt cute, might delete later 😌')
            //.setURL('https://discord.js.org/')
            //.setAuthor({ name: 'TrashPanda', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            //.setDescription('Some description here')
            //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
            /*.addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )*/
            //.addField('Inline field title', 'Some value here', true)
            .setImage(loreBook.raccoonGifs[Math.floor(Math.random() * loreBook.raccoonGifs.length)])
            .setTimestamp()
        //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        guild.channels.fetch(spChannelId).then((channel) => {
            channel.send({ embeds: [gifEmbed] }).then(m => {
                m.react('👍');
                m.react('👎');
                m.react('❤');
            });
            logDate('Raccoon gif sent');
        });

    }, 2700000) //set to 45000 (45s) for testing, otherwise 2700000 (45m)

    //Send a message to a random user every hour
    setInterval(() => {
        //TODO: create a rule to only send this at reasonable times to not annoy people (bot gotta sleep too)
        //Send random fun fact from list
        guild.members.fetch()
            .then((members) => {
                //Ensure a bot isn't selected, and only people with the required role are considered
                let randomUser = members.filter(member => !member.user.bot && member._roles.includes(requiredRole)).randomKey();
                guild.channels.fetch(spChannelId).then((channel) => {
                    channel.send(`<@${randomUser}> Did you know ${loreBook.funFacts[Math.floor(Math.random() * loreBook.funFacts.length)]}?`);
                    logDate('Random fact sent');
                });
            })
    }, 3600000) //set to 60000 (1m) for testing, otherwise 3600000 (1h)

});


//Welcome message
///
bot.on("guildMemberAdd", (member) => {
    member.guild.channels.fetch(welcomespChannelId).then((channel) => {
        channel.send(loreBook.welcomeMessage.replace('?userId', member.id));
        // TODO: Uncomment below when out of testing and global role added to everyone
        // member.roles.add(requiredRole);
        // logDate("Required role added to new member")
    });
});

//Message reactions / commands
///
bot.on("messageCreate", (message) => {
    if (message.author.bot) {
        return;
    } else if (message.content.toLowerCase().includes("morb")) {
        message.channel.send("It's Morbin' time!");
        message.react('🧛');
        message.react('🇲');
        message.react('🇴');
        message.react('🇷');
        message.react('🇧');
        message.react('🇮');
        message.react('🇺');
        message.react('🇸');
        message.react('🦇');
        logDate('Reacted to a morbius mention');
    } else if (message.content == "$help") {
        const commands = new MessageEmbed()
            .setColor("#ffd046")
            .setTitle("Server Commands")
            .setDescription("I'm still learning 👉👈 ... but this is what I can do right now: ")
            .addFields(
                { name: "$random", value: "Returns a random number" },
                { name: "$joke", value: "Sends a random joke" }
            );
        message.channel.send({ embeds: [commands] });
        logDate('Replied to $help');
    } else if (message.content == "$random") {
        message.react("🔢");
        let randomNumber = getRandomNumber(1, 100);
        message.reply(`Your random number is ${randomNumber}.`);
        logDate('Replied to $random command');
    } else if (message.content == '$joke') {
        message.channel.send(loreBook.jokes[Math.floor(Math.random() * loreBook.jokes.length)]);
        logDate('Replied to $joke command');
    }
});

///
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

///
function logDate(message) {
    let date = new Date().toLocaleString('en-AU');
    console.log(`[${date.replace(',', '')}] ${message.toUpperCase()}`);
}
