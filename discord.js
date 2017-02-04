// Bot lib
const Discordie = require('discordie');
const Events = Discordie.Events;
const client = new Discordie();

// Emoji lib
const chooseEmoji = require('./utils/chooseEmoji');
const sources = require('./sources.config');
const jsonfile = require('jsonfile');

client.connect({
  token: process.env.DISCORD_CLIENT_SECRET,
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log(`Connected as: ${client.User.username}`);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  const message = e.message.content;

  if (message.includes('/kaomoji') && !message.includes('Use:')) {
    const params = e.message.content.split(' ');

    // handle the help command or incorrect usage
    if (params.length !== 2 || params[1] === 'help') {
      const feelings = Object.keys(sources).join(', ');
      e.message.channel.sendMessage(`Use: /kaomoji <feeling>\nAvailable: ${feelings}`);

    } else {
      // Read in the feeling file in the results directory
      const fileName = `./results/${params[1]}.json`;
      jsonfile.readFile(fileName, (err, obj) => {

        // Usually means it's not found, so bot doesn't know what it is
        if (err) {
          e.message.channel.sendMessage(`I don't know what that is! ໒( •́ ∧ •̀ )७`);
          return;
        }

        e.message.channel.sendMessage(chooseEmoji(obj));
      });

    }
  }
});

// Add bot to server
// https://discordapp.com/oauth2/authorize?&client_id=277343375131410433&scope=bot
