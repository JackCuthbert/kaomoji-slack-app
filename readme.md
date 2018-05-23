# kaomoji-bot [![Build Status](https://travis-ci.org/JackCuthbert/kaomoji-slack-app.svg?branch=master)](https://travis-ci.org/JackCuthbert/kaomoji-slack-app)

### Deprecated

This repository for the Kaomoji Slack app is now deprecated. Please install the new version of Kaomoji with this big ol' button:

<a href="https://slack.com/oauth/authorize?client_id=137226021060.138456996515&amp;scope=commands,bot,chat:write:bot"><img alt="Add to Slack" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" width="139" height="40"></a>

A new repo for issues/feedback and a promotional website is being worked on. For now please use this repo for any issues or feature requests you have. For more information see [issue #16](https://github.com/JackCuthbert/kaomoji-slack-app/issues/16#issuecomment-391213372).

~Important: The main server for the kaomoji slack app is currently offline as I'm planning to rebuild Kaomoji using AWS Lambda so it doesn't cost me as much (or anything) to run.~

Because why not? ┐(´∀｀)┌

![kaomoji_demo](./public/kaomoji_demo.png)  
*Example output*

---

## Usage (° o°)

`/kaomoji <searchTerm> [optional message]` - Send a kaomoji

---

### Important!! ( ⁰д⁰)

Not all of the characters are supported in all operating systems by default. There may also be limitations coming from Slack itself or your browser.

Mac and Windows have pretty good coverage out of the box, linux not-so-much. In my testing I that good coverage can come from installing the [Google Noto fonts](https://www.google.com/get/noto/):

* All Languages ([AUR package](https://www.archlinux.org/packages/extra/any/noto-fonts/))
* All CJK Fonts ([AUR Package](https://www.archlinux.org/packages/extra/any/noto-fonts-cjk/))

If you don't want to install all 470MB+ worth of Noto fonts, see the contents of the linked AUR packages for which ones to install. _(This is only tested under Arch Linux!)_

---

All the credit for creating and maintaining the awesome list of kaomoji this bot uses goes to [JapaneseEmoticons.me](http://japaneseemoticons.me/).

If you're into kaomoji please consi![]()der supporting them on Patreon, directly through PayPal, or by downloading their iOS and Android apps! w(°ｏ°)w

---

That's it (ﾟ´Д｀ﾟ)ﾟ
