const Queue = require("./queueClient");
const Nmbrs = require('./nmbrsClient');

async function extractInfo(message) {
  const client = new Nmbrs(message.user, message.pass)
  const companies = await client.getCompanies();
  console.log(companies)
  const employees = await client.getEmployees(companies[0].id);
  console.log(employees)
  const daysOff = await client.getDaysOff(employees[0].id, 2016)
  console.log(daysOff)
}

async function main() {
  const queue = new Queue('commandqueue');
  console.log('Listening for new messages');

  while(true) {
    const message = await queue.receive();
    if (message.id) {
      console.log(`Processing message ${message.id}`);

      const payload = JSON.parse(message.message)
      const info = await extractInfo(payload);
      await queue.delete(message.id);

      console.log(`Finished processing ${message.id}`);
      
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main();