const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://lucianocastr.github.io/ticketeraTesis/',
    video: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome, mocha-junit-reporter',
    mochawesomeReporterOptions: {
      reportDir: 'reports/mochawesome',
      overwrite: false,
      html: false,           // 👈 HTML off aquí
      json: true,            // 👈 JSON on para merge
      reportFilename: 'report-[datetime]',
      charts: true,
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'reports/junit/results-[hash].xml',
      testsuitesTitle: 'Cypress E2E Suite',
    },
  },
});
