const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://lucianocastr.github.io/ticketeraTesis/', // Pages
    video: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    setupNodeEvents(on, config) {
      // nada especial por ahora
    },
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome, mocha-junit-reporter',
    mochawesomeReporterOptions: {
      reportDir: 'reports/mochawesome',
      overwrite: false,
      html: true,
      json: true,
      reportFilename: 'report-[datetime]',
      charts: true,
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'reports/junit/results-[hash].xml',
      testsuitesTitle: 'Cypress E2E Suite',
    },
  },
});
