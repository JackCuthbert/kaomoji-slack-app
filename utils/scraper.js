const jsonfile = require('jsonfile');
jsonfile.spaces = 2;

const x = require('x-ray');
const xray = x();

xray('http://japaneseemoticons.me/', ['.menu-item .sub-menu li a@href'])((err, obj) => {
  const urls = obj.filter(url => !url.includes('#') && url.includes('emoticons.me') && !url.includes('master'));

  urls.forEach((url) => {
    // console.log(`Scraping category: ${url}...`);

    // Find page titles for each category
    let pageTitle = '';
    xray(url, 'h1.entry-title', '')((titleErr, title) => {
      if (titleErr) { console.error(titleErr); return; }
      const pageString = '.entry-content p:last-child a';
      pageTitle = title;

      // Find the number of pages per category
      xray(url, pageString, [''])((limitErr, pages) => {
        if (limitErr) { console.error(err); return; }

        // Scrape emoji with limits!
        xray(url, '.copyjava tr', ['td'])
          .limit(pages.length)
          // .limit(1)
          .paginate(`${pageString}:last-child@href`)((emojiErr, emojiObj) => {
            if (emojiErr) { console.error(err); return; }

            // Write the whole thing to a category file
            jsonfile.writeFile(`./mega-kaomoji/${pageTitle}.json`, { category: pageTitle, emoji: emojiObj }, (writeErr) => {
              if (writeErr) console.log(writeErr);
              console.log(`${pageTitle} scraped!`);
            });
          });
      });
    });
  });
});
