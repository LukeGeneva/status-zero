const moment = require('moment');
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

const yesterday = moment().subtract(1, 'day');
const after = yesterday.format('YYYY-MM-DD');
const before = yesterday.format('YYYY-MM-DD 23:59:59');
const command = `cd ~/dotfiles && git log --after='${after}' --before='${before}' --format='%s%n%b' --author='${process.env.GIT_AUTHOR}'`;

exec(command, {}, onGitLogComplete);

async function onGitLogComplete(error, stdout) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://statushero.com/signin');
  await page.focus('#user_email');
  await page.keyboard.type(process.env.STATUSHERO_USERNAME);
  await page.focus('#user_password');
  await page.keyboard.type(process.env.STATUSHERO_PASSWORD);
  await page.click('button[type="submit"]');
  await page.goto('https://statushero.com/teams/finance/statuses/current/edit');
  await page.focus('#answer_set_previous');
  await page.keyboard.type(stdout);
  await page.click('#answer_set_previous_completed');
  // TODO: click submit button
}
