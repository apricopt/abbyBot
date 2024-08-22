const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAndMapToJson(url) {
  try {
    // Fetch the webpage content
    const { data } = await axios.get(url);

    // Load the content into Cheerio
    const $ = cheerio.load(data);

    // Example selectors - adjust according to the structure of the target webpage
    const items = [];

    // Select each item and map it to a JSON object
    $("[data-ev-label='search_results_impression']").each((index, element) => {
      const title = $(element).find('.is-clamped a[data-test="UpLink"]').text().trim();
      const description = $(element).find('.is-clamped p').text().trim();
      const link = $(element).find('.is-clamped a[data-test="UpLink"]').attr('href');

      items.push({
        title,
        description,
        link,
      });
    });

    // Return or save the JSON object
    console.log(items);
  } catch (error) {
    console.error(`Error fetching the page: ${error.message}`);
  }
}

// Replace with the URL you want to scrape
const url = 'https://www.upwork.com/nx/search/jobs/?contractor_tier=2&nbs=1&q=rooftop&sort=recency';
scrapeAndMapToJson(url);