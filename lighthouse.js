const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const {URL} = require('url');
const fs = require('fs');
const variables = require('./module-variables.js');
const functions = require('./module-functions.js');
const config = require('./config.js');

functions.createDirectory(variables.output_directory);

(async() => {
  const browser = await puppeteer.launch({
    headless: true, 
    defaultViewport: null,
  });
  const options = config.performance
  options.port = (new URL(browser.wsEndpoint())).port;
  let pages = variables.test_pages
  for (let i in pages) {
      //console.log('running lighthouse on',pages[i])
      try {
        let page = await browser.newPage();
        await page.goto(pages[i], {waitUntil: 'load', timeout: 300000});

        await page.screenshot({path: './screenshot' + i + '.png', fullPage: true})
        
        const runnerResult = await lighthouse(pages[i], options);
        const report_html = runnerResult.report;
        if ((runnerResult.lhr.categories.performance.score * 100) < 75) {
          let name = i
          name = new URL (pages[i]).pathname.replaceAll(/\?|\!|\=|\#|\//gi,"-").replace('-','')
          if (name == '') { name = 'homepage'}
          let output_html = variables.output_directory + variables.file_path_separator + name + '-results.html'
          fs.writeFileSync(output_html, report_html);
          /*
          let output_json = variables.output_directory + variables.file_path_separator + name + '-results.json'
          const report_json = runnerResult.lhr
          fs.writeFile(output_json, JSON.stringify(runnerResult.lhr, null, 2), err => {
              if (err) {
                  console.error(err)
                  return
              }
          })
          */
        }
        console.log(Math.round(runnerResult.lhr.categories.performance.score * 100), '-', runnerResult.lhr.finalUrl);
      } catch (err) {
        console.log(err)
        console.log('FAILED', '-', pages[i])
      }
  }
  await browser.close();
})();