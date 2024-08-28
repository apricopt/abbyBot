const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const {triggerMakeWebhook} = require("./triggerMake")

const fs = require("fs");
const { getPostedDate } = require("./utils");
const { executablePath } = require("puppeteer");

const fsPromises = require('fs').promises;

require("dotenv").config()

puppeteer.use(StealthPlugin());

const configuration = {
  useProxy: true,
  proxySettings: {
      address: 'geo.floppydata.com',
      port: "10080",
      username: process.env.PROXY_USERNAME,
      password: process.env.PROXY_PASSWORD,
  },
}



async function launchBrowser(req, res) {

  let args = ["--no-sandbox"];

  if (configuration.useProxy)
    args.push(
      `--proxy-server=${configuration.proxySettings.address}:${configuration.proxySettings.port}`
    );
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args,
    defaultViewport: {
      width: 1200,
      height: 800,
    },
    // executablePath: "/usr/bin/chromium-browser",
  });

  try {


    const page = await browser.newPage();

    if (configuration.useProxy) {
      await page.authenticate({
        username: configuration.proxySettings.username,
        password: configuration.proxySettings.password,
      });
    }

    await page.setDefaultNavigationTimeout(0);

    const {url} = req.body;

  let data =   await doIt(page, browser, url);

   res.status(200).json(data)
    
    await browser.close();
  } catch (err) {
    console.log("FinalError ", err);
    await browser.close();
  }
}


async function doIt(page, browser, url) {

await page.goto(url)
  
  
let pageInfo = await page.evaluate(() => {
  let allJobs = Array.from(document.querySelectorAll("[data-ev-label='search_results_impression']"));
 let theInfo = allJobs.map(el => {
  let title =   el.querySelector('.is-clamped a[data-test="UpLink"]').innerText.trim();
  let description = el.querySelector('.is-clamped p').innerText.trim();
  let link = `https://upwork.com${el.querySelector('.is-clamped a[data-test="UpLink"]').getAttribute("href")}`
  let jobType = el.querySelector('[data-test="job-type-label"]').innerText.trim().toUpperCase();
  let categories = Array.from(document.querySelector('[data-test="TokenClamp JobAttrs"]').children).map(el => el.innerText)
  let jobDate = el.querySelector('[data-test="job-pubilshed-date"]').innerText.trim()

  return {title, description, url:link, jobType, jobDate, categories}
  })

  return theInfo

});


let modifiedData = pageInfo.map(el =>{
  if(!el.jobDate.includes("week") && !el.jobDate.includes("weeks") && !el.jobDate.includes("month") && !el.jobDate.includes("months")  ) {
    return {...el , jobDate : getPostedDate(el.jobDate)}
  }else {
    return null
  }

}).filter(el => el !== null)

console.log("Page Info ", modifiedData);

// triggerMakeWebhook(modifiedData)

return modifiedData


  }




async function checkAndCreateFile(filePath) {
  try {
    await fsPromises.access(filePath);
    console.log(`File '${filePath}' already exists.`);
  } catch (error) {
    await fsPromises.writeFile(filePath, '{}');
    console.log(`File '${filePath}' created.`);
  }
}


async function readJsonFile(filePath) {
  try {
    // Read the file content
    const data = await fsPromises.readFile(filePath, 'utf8');

    // Parse the JSON content
    const jsonData = JSON.parse(data);

    return jsonData;
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    // throw error; // Rethrow the error to handle it at a higher level if needed
    return {}
  }
}




module.exports = {
  launchBrowser
}