const constants = require('./constants.js');

module.exports = {
  ci: {
    collect: {
      additive: true,
      url: [
        'https://www.amazon.nl',
        'https://www.google.be'
            ],
      puppeteerScript: "./puppeteer.desktop.js",
      puppeteerLaunchOptions: { 
        headless: false, 
        "args": ["--user-agent=" + constants.userAgent]
         },
      settings:  {
        output: 'html',
        onlyCategories: ['performance'],
        /*skipAudits: ['modern-image-formats'],*/
        formFactor: 'mobile',
        screenEmulation: { mobile: false }
      },
      numberOfRuns: 1,
    },
    assert: {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.7}]
      }
    },
    upload: {
      target: "lhci",
      serverBaseUrl: "http://localhost:8999",
      token: "mytoken"
    },
    server: {},
    wizard: {},
  },
};