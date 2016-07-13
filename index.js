#!/usr/bin/env node
const spawn = require('child_process').spawn;
const journalctl = spawn('journalctl', ['-b', '-f', '-o', 'json']);
const chalk = require('chalk');
const fs = require('fs');

if (!fs.existsSync(process.env.HOME + '/.journallyrc')) {
  fs.writeFileSync(process.env.HOME + '/.journallyrc', JSON.stringify({
    filters : [

    ],
    output: '{__realtime_timestamp.blue} {|.yellow} {syslog_identifier.green} {says.yellow} {message.green}'
  }, null, 2));
}

const settings = JSON.parse(fs.readFileSync(process.env.HOME + '/.journallyrc'));

journalctl.stdout.on('data', (data) => {
  let journal = JSON.parse(data.toString().split('\n')[0]);

  for (filter of settings.filters) {
    if (journal.SYSLOG_IDENTIFIER == filter) return;
  }

  let message = '';

  let matches = settings.output.match(new RegExp('\{(.*?)\}', 'g'));

  for (match of matches) {
    match = match.replace(/\{|\}/g, '');
    let property = match.split('.')[0];
    let color = match.split('.')[1];

    if (property == '__realtime_timestamp') {
      journal[property.toUpperCase()] = time(journal[property.toUpperCase()]);
    }

    if (journal.hasOwnProperty(property.toUpperCase())) {
        message += chalk[color](journal[property.toUpperCase()].trim()) + ' ';
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
