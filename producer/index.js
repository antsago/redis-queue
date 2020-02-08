const queue = require('./queue');

const user_data = {
  source_app: 'nmbrs',
  user: '$username',
  pass: '$apikey',
  group: 1234,
  controller: 'importDaysoff',
};

async function main() {
  await queue.create();
  await queue.send(JSON.stringify(user_data));
}

main();
