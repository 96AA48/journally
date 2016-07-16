#!/usr/bin/env node
const spawn = require('child_process').spawn;
const chalk = require('chalk');
const fs = require('fs');
const split2 = require('split2');

// prepare the user's arguments to be sent
// to journalctl
function prepareUserArguments(args) {
  let indexOfOutputFlag;
  const result = Array.from(args);

  if ((indexOfOutputFlag = result.indexOf('-o')) == -1) {
    // the user didn't enter an output format
    // enter the flag to use json
    result.push('-o', 'json');
  } else {
    // the user entered an output format,
    // override it with json
    result[indexOfOutputFlag + 1] = 'json';
  }

  return result;
}

if (!fs.existsSync(process.env.HOME + '/.journallyrc')) {
  fs.writeFileSync(process.env.HOME + '/.journallyrc', JSON.stringify({
    filters : [

    ],
    output: '{__realtime_timestamp.blue} {|.yellow} {syslog_identifier.green} {says.yellow} {message.green}'
  }, null, 2));
}

const settings = JSON.parse(fs.readFileSync(process.env.HOME + '/.journallyrc'));

// if the user provided arguments, pass those to
// journalctl
const argvForJournalCtl = (process.argv.length > 2) ?
  prepareUserArguments(process.argv.slice(2)) :
  ['-b', '-f', '-o', 'json'];

const journalctl = spawn('journalctl', argvForJournalCtl);
const settingsRegEx = new RegExp('\{(.*?)\}', 'g')

journalctl.stdout
  .pipe(split2())
  .on('data', (data) => {
    let journal;

    journal = JSON.parse(data.toString());

    for (filter of settings.filters) {
      if (journal.SYSLOG_IDENTIFIER == filter) return;
    }

    let message = '';

    let matches = settings.output.match(settingsRegEx);

    for (match of matches) {
      match = match.replace(/\{|\}/g, '');
      let property = match.split('.')[0];
      let color = match.split('.')[1];

      if (property == '__realtime_timestamp') {
        journal[property.toUpperCase()] = time(journal[property.toUpperCase()]);
      }

      let propertyValue = journal[property.toUpperCase()];
      if (propertyValue) {
        message += chalk[color](propertyValue.trim()) + ' ';
      }
      else {
        message += chalk[color](property + ' ');
      }
    }

    console.log(message);
  });

function time(timestamp) {
  let date = new Date(parseInt(timestamp) / 1000)

  let time = date.getHours() + ':';
  if (date.getMinutes().toString().length == 1) time += '0';
  time += date.getMinutes() + ':';
  if (date.getSeconds().toString().length == 1) time += '0';
  time += date.getSeconds();

  return time;
}
