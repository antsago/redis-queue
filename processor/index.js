const RedisSMQ = require("rsmq");
const Nmbrs = require('./nmbrsClient');

const rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });

// I'll assume that the queue is only used for this and that the message 
// source can be trusted (thus there's no need for validation)
async function receive() {
  return await new Promise((resolve, reject) => 
    rsmq.popMessage({ qname: "commandqueue" }, (err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve(resp);
      }
    })
  );
}

async function processMessage(message) {
  const client = new Nmbrs(message.user, message.pass)
  const companies = await client.getCompanies();
  console.log(companies)
}

async function main() {
  console.log('Listening for new messages')
  while(true) {
    const message = await receive();
    if (message.id) {
      console.log(message);
      const payload = JSON.parse(message.message)
      await processMessage(payload);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main();