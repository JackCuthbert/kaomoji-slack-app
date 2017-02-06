# kaomoji-bot

Because why not? ┐(´∀｀)┌

### Important!! ( ⁰д⁰)

Not all of the characters are supported in all operating systems by default. I've found that the best coverage is acquired by installing the [Google Noto fonts](https://www.google.com/get/noto/):

* All Languages ([AUR package](https://www.archlinux.org/packages/extra/any/noto-fonts/))
* All CJK Fonts ([AUR Package](https://www.archlinux.org/packages/extra/any/noto-fonts-cjk/))

If you don't want to install all 470MB+ worth of Noto fonts, see the contents of the linked AUR packages for which ones to install. _(This is only tested under Arch Linux with Gnome!)_

## Installation ╰། ❛ ൧̑ ❛ །╯

[Create a new Slash Command](https://slack.com/apps/A0F82E8CA-slash-commands) for your team.

**URL:** https://kaomoji-bot-slack.herokuapp.com/  
**Method:** GET  
**Description:** Get a random kaomoji!  
**Usage hint:** feeling ("help" for available feelings)

## Usage ⚈ ̫ ⚈

Commands should be consistent across Discord and Slack.

`/kaomoji <feeling>` - Send a kaomoji  
`/kaomoji help` - See available feelings

## Scraping ヘ（゜◇、゜）ノ

TODO

## Deployment (•̀ᴗ•́)൬༉

Default: slack bot

This app is designed to be deployed on heroku and can run a couple of different things. Modify the `Procfile` to run what you need.

```
web: node api.js
web: node slack.js
web: node discord.js
```

### Discord

Visit [My Apps](https://discordapp.com/developers/applications/me) to set up a new Discord App.

Set `DISCORD_BOT_TOKEN` environment variable to the App Bot User Token in the My Apps page.

This does not support Oauth, only use as a private bot.

Run `yarn discord`, `node discord.js`, or `npm run discord`.

---

That's it (ﾟ´Д｀ﾟ)ﾟ
