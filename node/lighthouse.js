const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const {URL} = require('url');
const fs = require('fs');
const variables = require('./variables.js');
const functions = require('./functions.js');
const config = require('./config.js');

functions.createDirectory(variables.output_directory);

(async() => {
  const browser = await puppeteer.launch({headless: true});
  const options = config.performance
  options.port = (new URL(browser.wsEndpoint())).port;
  let pages = variables.key_pages
  for (let i in pages) {
      //console.log('running lighthouse on',pages[i])
      try {
        let page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
        await page.setExtraHTTPHeaders({'Accept-Language': 'en-US'});
        await page.goto(pages[i], {waitUntil: 'load', timeout: 10000});
        if ( i == 0) {
          await page.screenshot({path: './screenshot.png', fullPage: true}) // Take a screenshot to detect WAF blocks on login page
          await page.waitForSelector('input[type="text"]');
          await page.type('input[type="text"]', 'lighthouse@lighthouse.com');
          await page.type('input[type="password"]', 'password');
          await page.click('[type="submit"]');
        }
        const runnerResult = await lighthouse(pages[i], options);
        const report_html = runnerResult.report;
        if ((runnerResult.lhr.categories.performance.score * 100) < 75) {
          let name = i
          name = new URL (pages[i]).pathname.replaceAll(/\?|\!|\=|\#|\//gi,"-").replace('-','')
          if (name == '') { name = 'homepage'}
          let output_html = variables.output_directory + variables.file_path_separator + name + '-results.html'
          fs.writeFileSync(output_html, report_html);
          let output_json = variables.output_directory + variables.file_path_separator + name + '-results.json'
          const report_json = runnerResult.lhr
          fs.writeFile(output_json, JSON.stringify(runnerResult.lhr, null, 2), err => {
              if (err) {
                  console.error(err)
                  return
              }
          })
        }
        console.log(Math.round(runnerResult.lhr.categories.performance.score * 100), '-', runnerResult.lhr.finalUrl);
      } catch (err) {
        console.log(err)
        console.log('FAILED', '-', pages[i])
      }
  }
  await browser.close();
})();