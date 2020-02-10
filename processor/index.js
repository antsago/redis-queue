const Queue = require('./queueClient');
const Nmbrs = require('./nmbrsClient');
const Extactor = require('./infoExtractor');

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

      const info = await extractor.extractInfo();
      await queue.delete(message.id);

      console.log(`Finished processing ${message.id}`);
      
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main();