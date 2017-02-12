const jsonfile = require('jsonfile');
const x = require('x-ray');

const xray = x();

// Write finalised emoji data to file
function writeJson(data) {
  jsonfile.writeFile(`./kaomoji/${data.title}.json`, data, { spaces: 2 }, (err) => {
    if (err) console.log(err);
    console.log(`${data.title}.json written!`);
  });
}

// Process emogi into finalised object for writing
function processEmoji(pageTitle) {
  return (err, emojiObj) => {
    if (err) { console.error(err); return; }

    // Remove empty
    const emojis = emojiObj.filter(emoji => emoji !== '');

    // Write the whole thing to a category file
    writeJson({ title: pageTitle, emoji: emojis });
  };
}

// Grab each emoji in tables and paginate for everything
function scrapeEmoji(url, pageString, pageTitle) {
  return (err, pages) => {
    if (err) { console.error(err); return; }

    // Scrape emoji with limits!
    xray(url, 'table tr', ['td'])
      .limit(pages.length)
      // .limit(1)
      .paginate(`${pageString}:last-child@href`)(processEmoji(pageTitle));
  };
}

// Process a nicer page title then scrape emoji
function scrapeTitles(url) {
  let pageTitle = '';
  return (err, title) => {
    if (err) { console.error(err); return; }

    // Pretty up files
    pageTitle = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s/g, '-')
      .replace(/(with|and|emoticons?)/g, '')
      .replace(/(^\W{1,2}|\W{1,2}$)/g, '')
      .replace(/(-{2})/g, '-');

    // Find the number of pages per category
    const pageString = '.entry-content p:last-child a';
    xray(url, pageString, [''])(scrapeEmoji(url, pageString, pageTitle));
  };
}


// Get page titles for each url
function scrapePage() {
  return (url) => {
    console.log(`Scraping category: ${url}...`);
    xray(url, 'h1.entry-title', '')(scrapeTitles(url));
  };
}

// Ready, set, scrape!
xray('http://japaneseemoticons.me/', ['.menu-item .sub-menu li a@href'])((err, obj) => {
  const urls = obj.filter(url => !url.includes('#') && url.includes('emoticons.me') && !url.includes('master'));
  urls.forEach(scrapePage());
});
