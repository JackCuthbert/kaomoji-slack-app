const ngrok = require('ngrok');

if (process.env.NODE_ENV !== 'production') {
  ngrok.connect(3000, (err, url) => {
    if (err) throw new Error(err);
    console.log(`ngrok tunnelling with url: ${url}`);
  });
} else {
  console.log('Production environment, don\'t do this!');
}
