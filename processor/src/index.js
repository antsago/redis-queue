const fs = require('fs');
const { format } = require('date-fns');
const Queue = require('./queueClient');
const Nmbrs = require('./nmbrsClient');
const Extactor = require('./infoExtractor');

async function saveRecord(record) {
  return await new Promise((resolve, reject) => 
    fs.writeFile(
      `./records/${record.source_app_internal_id}.json`,
      JSON.stringify(record, null, 2),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    ),
  );
}

function formatData(records, group, sourceApp) {
  return records.map(record => ({
    group_id: group,
    source_app: sourceApp,
    source_app_internal_id: record.employeeId,
    historical_days_off: record.daysOff.map(dayOff => ({
      date: format(dayOff.date, 'yyyy-MM-dd'),
      data: {
        duration_minutes: dayOff.durationHours * 60, 
        day_off_name: dayOff.description,
        internal_code: dayOff.id,
        type: dayOff.type,
      },
    })),
  }))
}

async function main() {
  const queue = new Queue('commandqueue');
  await queue.create();

  console.log('Listening for new messages');

  while(true) {
    const message = await queue.receive();
    if (message.id) {
      console.log(`Processing message ${message.id}`);

      const payload = JSON.parse(message.message)
      const client = new Nmbrs(payload.user, payload.pass)
      const extractor = new Extactor(client)

      const data = await extractor.extractInfo();
      const records = formatData(data);
      await Promise.all(records.map(record => saveRecord(record)))

      await queue.delete(message.id);

      console.log(`Finished processing ${message.id}`);
      
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main();