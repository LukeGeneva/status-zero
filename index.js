const moment = require('moment');
const puppeteer = require('puppeteer');
const jsyaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const { getPreviousWorkday } = require('./calendar');
const fetchAllGitLogs = require('./fetchAllGitLogs');

const configPath = path.join(__dirname, 'config.yaml');
const configDoc = fs.readFileSync(configPath);
const config = jsyaml.safeLoad(configDoc);

const previousWorkday = getPreviousWorkday(new Date());
fetchAllGitLogs({ day: previousWorkday, author: config.gitAuthor, directories: config.gitDirectories }).then(postLogsToStatusHero);

async function postLogsToStatusHero(logs) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://statushero.com/signin');
  await page.focus('#user_email');
  await page.keyboard.type(config.statusHeroUsername);
  await page.focus('#user_password');
  await page.keyboard.type(config.statusHeroPassword);
  await page.click('button[type="submit"]');
  await page.goto('https://statushero.com/teams/finance/statuses/current/edit');
  await page.focus('#answer_set_previous');
  await page.keyboard.type(logs);
  await page.click('#answer_set_previous_completed');
  // TODO: click submit button
}
