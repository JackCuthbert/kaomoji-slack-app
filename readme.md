# kaomoji-bot

Because why not? ┐(‘д’)┌

## Usage

### Discord

`/kaomoji <feeling>` - Send a kaomoji  
`/kaomoji help` - See available feelings

### Slack

`/kaomoji <feeling>` - Send a kaomoji  
`/kaomoji help` - See available feelings

### Scraping


The scraper in `./utils/scraper.js` will grab a heap of kaomoji from the sources defined in `./sources.config.js`. It currently only works for those sources. It's probably not a good idea to run this very often. Results of scraping are store in `./kaomoji` as json files and committed to the repo to be used in deployed apps.

Run the scraper with `yarn scrape` or `npm run scrape`.

## Deployment

Default: slack bot

This app is designed to be deployed on heroku and can run a couple of different things. Modify the `Procfile` to run what you need.

```
web: node api.js
web: node slack.js
web: node discord.js
```

### API

The simplest implementation.

Run `yarn api`, `node api.js`, or `npm run api` to start the api server. Visit <http://localhost:3000/api/feeling> to test it out replacing 'feeling' with an available feeling.

### Discord

Visit [My Apps](https://discordapp.com/developers/applications/me) to set up a new Discord App.

Set `DISCORD_BOT_TOKEN` environment variable to the App Bot User Token in the My Apps page.

This does not support Oauth, only use as a private bot.

Run `yarn discord`, `node discord.js`, or `npm run discord`.

### Slack

[Create a new Slash Command](https://slack.com/apps/A0F82E8CA-slash-commands) for your team.

Set the URL in settings to `https://kaomoji-bot-slack.herokuapp.com/slack/` (or your own URL if you're hosting this yourself) with `GET` method enabled. Complete the rest of the form as desired!

## Todo

- [ ] Scrape using menu items as well
- [ ] Use DB instead of .json files
