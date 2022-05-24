const Discord = require("discord.js");
const config = require("../config.json");
const client = new Discord.client();

// Enable Discord bot to log in
client.login(config.BOT_TOKEN); 

/// Summary:
///     Method to fetch all user names within the server.
/// Returns:
///     An array of strings of all usernames and hashtags within the server.
function getUsers() {
    let guilds = client.guilds.array();
    let userNames = "";

    for (let i = 0; i < guilds.length; i++) {
        client.guilds.get(guilds[i].id).fetch().then(result => {
            result.members.array().forEach(user => {
                let userName = `${result.user.userName}#${result.user.discriminator}`;
                userNames += userName + " ";
                console.log(`${userName}`);
            });
        });
    }

    return userNames.split(" ");
}

///
function postMessage(message) {
    
}

///
function buildMessage(messageContents) {

}

///
function selectLoreOption() {

}

///
function selectUsers(users) {

}

///
function checkUsers(userOne, userTwo) {
    if (userOne == userTwo) {
        return false;
    }

    return true;
}