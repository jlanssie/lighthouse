/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */

const variables = require('./variables.js');

module.exports = async (browser, context) => {
  const page = await browser.newPage();
  await page.setUserAgent(variables.user_agent)
  await page.setExtraHTTPHeaders({'Accept-Language': 'en-US'});
  await page.close();
};