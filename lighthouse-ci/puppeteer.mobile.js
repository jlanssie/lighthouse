/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */

const variables = require('./constants.js');

module.exports = async (browser, context) => {
  const page = await browser.newPage();
  await page.setUserAgent(variables.userAgents.mobile)
  await page.setExtraHTTPHeaders({'Accept-Language': 'en-US'});
  
  await page.close();
};