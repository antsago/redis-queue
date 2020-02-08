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

async function send(data) {
  const messageId = await new Promise((resolve, reject) => 
    rsmq.sendMessage({ qname: "commandqueue", message: data}, (err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve(resp);
      }
    })
  );

  console.log("Message sent. ID:", messageId);
}

const user_data = {
  source_app: 'nmbrs',
  user: '$username',
  pass: '$apikey',
  group: 1234,
  controller: 'importDaysoff',
};

async function main() {
  await create();
  await send(JSON.stringify(user_data));
  process.exit();
}

main();