const puppeteer = require('puppeteer');
const jsyaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const { getPreviousWorkday } = require('./calendar');
const fetchAllGitLogs = require('./fetchAllGitLogs');

const configPath = path.join(__dirname, 'config.yaml');
const configDoc = fs.readFileSync(configPath);
const config = jsyaml.safeLoad(configDoc);

// TODO: Change to work span so that we can cover the weekend
const previousWorkday = getPreviousWorkday(new Date());
fetchAllGitLogs({
  day: previousWorkday,
  author: config.gitAuthor,
  directories: config.gitDirectories,
}).then(postLogsToStatusHero);

async function postLogsToStatusHero(logs) {
  /*eslint-env browser*/
  const browser = await puppeteer.launch({ headless: config.willRunHeadless });
  const page = await browser.newPage();
  await page.goto('https://statushero.com/signin');
  await page.focus('#user_email');
  await page.keyboard.type(config.statusHeroUsername);
  await page.focus('#user_password');
  await page.keyboard.type(config.statusHeroPassword);
  await page.click('button[type="submit"]');
  await page.goto('https://statushero.com/teams/finance/statuses/current/edit');
  await page.evaluate(() => {
    document.getElementById('answer_set_previous').value = '';
    document.getElementById('answer_set_previous_completed').checked = true;
  });
  await page.focus('#answer_set_previous');
  await page.keyboard.type(logs);
  if (config.willSubmit) await page.click('.btn-success');
}
