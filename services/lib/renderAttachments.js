module.exports = (message, text, timestamp, channel) => {
  // Compute the kaomoji sent from the message that was built
  // NOTE: Never reveal the user message, respect dat privacy yo
  const sentMessage = message.substring(0, message.indexOf('\n'));
  const kaomoji = sentMessage.split(' ')[sentMessage.split(' ').length - 1];
  return [
    {
      color: '#ff80ab',
      text: 'How did I do?',
      attachment_type: 'default',
      // Here we're storing the sent kaomoji and associated keyword
      // in a base64 string to be sent back and decoded in the interactive
      // buttons controller
      callback_id: new Buffer(JSON.stringify({
        kaomoji,
        keyword: text.split(' ')[0],
      })).toString('base64'),
      actions: [
        {
          name: 'correct',
          type: 'button',
          text: 'Perfect!',
          style: 'primary',
          value: 'correct',
        },
        {
          name: 'incorrect',
          type: 'button',
          text: 'Wrong kaomoji',
          value: 'incorrect_kaomoji',
        },
        {
          name: 'unsupported',
          type: 'button',
          text: 'Empty rectangles',
          value: 'unsupported_characters',
        },
        {
          name: 'nsfw',
          type: 'button',
          text: 'NSFW',
          style: 'danger',
          value: `${timestamp}:${channel}`,
          confirm: {
            title: 'Mark as NSWF',
            text: 'Mark this kaomoji as inappropriate and delete it from the channel?',
            ok_text: 'Yes',
            dismiss_text: 'No',
          },
        },
      ],
    },
  ];
};
