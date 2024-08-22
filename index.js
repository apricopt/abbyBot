const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const {triggerMakeWebhook} = require("./triggerMake")

const fs = require("fs");

const fsPromises = require('fs').promises;


puppeteer.use(StealthPlugin());


async function launchBrowser() {
  let args = ["--no-sandbox"];

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args,
    defaultViewport: {
      width: 1200,
      height: 800,
    },
  });

  try {
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);

    await doIt(page, browser);
    
    await browser.close();
  } catch (err) {
    console.log("FinalError ", err);
    await browser.close();
  }
}

launchBrowser();





async function doIt(page, browser) {
await page.goto("https://www.upwork.com/nx/search/jobs/?nbs=1&q=linkedin%20b2b%20lead%20generation")
  
  
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

console.log("Page Info ", pageInfo);
triggerMakeWebhook(pageInfo)


  }




// if (!Object.keys(cookies).length) {
//     let currentCookies = await page.cookies();
//     fs.writeFileSync(pathOfCookie, JSON.stringify(currentCookies));
//   } 



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






// function writeEmail() {
//   document.querySelector('#login_username').parentElement.parentElement.parentElement.parentElement.setAttribute('value', 'dereddys@gmail.com');
//   document.querySelector('#login_username').setAttribute('data-gtm-form-interact-field-id','0')

// }


// writeEmail()