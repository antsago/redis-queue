const fs = require('fs');
const Queue = require('./queueClient');
const Nmbrs = require('./nmbrsClient');
const Extactor = require('./infoExtractor');

async function saveData(data) {
  return await new Promise((resolve, reject) => 
    fs.writeFile("./records/test.json", JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }),
  );
}

async function main() {
  const queue = new Queue('commandqueue');
  console.log('Listening for new messages');

  while(true) {
    const message = await queue.receive();
    if (message.id) {
      console.log(`Processing message ${message.id}`);

      const payload = JSON.parse(message.message)
      const client = new Nmbrs(payload.user, payload.pass)
      const extractor = new Extactor(client)

      const data = await extractor.extractInfo();
      await saveData(data)
      await queue.delete(message.id);

      console.log(`Finished processing ${message.id}`);
      
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main();