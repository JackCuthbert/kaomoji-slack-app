module.exports = {
  help: (sha, message) => ({
    response_type: 'ephemeral',
    text: 'Hi, I\'m Kaomoji! (*＾▽＾)／\n\nI will try and find a random Japanese emoticon based on what you type and add it to your message. Try and keep messages shorter than 32 characters and be as descriptive as possible.',
    attachments: [
      {
        color: '#ffa0c0',
        title: 'Example Commands',
        text: 'These are some commands you can try. Remember that kaomoji are selected randomly so you might not always get what you\'re looking for. Remember to help me out by leaving some feedback!',
        fields: [
          {
            title: 'Single Word',
            value: '/kaomoji kitteh',
            short: true,
          },
          {
            title: 'Multiple Words',
            value: '/kaomoji this is cool!',
            short: true,
          },
          {
            title: 'A Short Sentence',
            value: '/kaomoji Nice pull request, merging now',
            short: false,
          },
        ],
      },
      {
        fallback: 'Contribute on GitHub',
        color: '#f0f0f0',
        title: 'Contribute on GitHub',
        title_link: 'https://github.com/JackCuthbert/kaomoji-bot',
        footer_icon: 'https://assets-cdn.github.com/favicon.ico',
        footer: `${sha} - ${message}`,
      },
    ],
  }),
  searching: () => ({
    response_type: 'ephemeral',
    text: 'Searching...',
  }),
  blank: () => ({
    response_type: 'ephemeral',
    text: 'Use "/kaomoji help" for help with this command.',
  }),
};

