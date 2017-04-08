const lib = require('lib');

/*
 * Get a kaomoji from a keyword
 */
exports.renderEmoji = keyword => (
  lib.jckcthbrt.kaomoji({ search: keyword })
    .then(result => result.emoji)
);

/*
 * Builds the string that will be sent by the slack app.
 * NOTE: text will always be a string
 */
exports.buildMessage = text => (
  () => {
    const parts = text.split(' ');

    return lib.jckcthbrt.kaomoji({ search: text })
      .then((result) => {
        if (parts.length === 1) return result.emoji;
        return `${text}  ${result.emoji}`;
      })
      .catch(() => undefined);
  }
);
