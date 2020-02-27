const moment = require('moment');
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const jsyaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const { getPreviousWorkday } = require('./calendar');

const configPath = path.join(__dirname, 'config.yaml');
const configDoc = fs.readFileSync(configPath);
const config = jsyaml.safeLoad(configDoc);

const previousWorkday = moment(getPreviousWorkday(new Date()));
const after = previousWorkday.format('YYYY-MM-DD');
const before = previousWorkday.format('YYYY-MM-DD 23:59:59');
const command = `cd ~/dotfiles && git log --all --after='${after}' --before='${before}' --format='%s%n%b' --author='${config.gitAuthor}'`;

exec(command, {}, onGitLogComplete);

async function onGitLogComplete(error, stdout) {
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
  await page.keyboard.type(stdout);
  await page.click('#answer_set_previous_completed');
  // TODO: click submit button
}
