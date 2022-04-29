const variables = require('./variables.js');

module.exports = {
  ci: {
    collect: {
      additive: true,
      url: [
        'https://www.amazon.nl',
        'https://www.google.be'
            ],
      puppeteerScript: "./puppeteer.js",
      puppeteerLaunchOptions: { 
        headless: false, 
        "args": ["--user-agent=" + variables.user_agent]
         },
      settings:  {
        output: 'html',
        onlyCategories: ['performance'],
        /*skipAudits: ['modern-image-formats'],*/
        formFactor: 'mobile',
        screenEmulation: { mobile: true }
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