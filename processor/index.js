const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });

async function create() {
  try {
    await new Promise((resolve, reject) => 
      rsmq.createQueue({ qname: "commandqueue" }, (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      })
    );
  } catch (err) {
    if (err.name == 'queueExists') {
      console.log("Queue Exists");
    }
  }
}

async function receive() {
  return await new Promise((resolve, reject) => 
    rsmq.receiveMessage({ qname: "commandqueue" }, (err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve(resp);
      }
    })
  );
}

async function main() {
  while(true) {
    const message = await receive();
    if (message.id) {
      console.log(message);
    } else {
      console.log('No message found');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

main();