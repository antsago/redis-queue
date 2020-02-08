const rsmq = require("rsmq-worker")
const worker = new rsmq("commandqueue", {
  host: "localhost",
  port: 6379,
  ns: "producer",
});

worker.on("message", (msg, next, id) => {
  let user_data = JSON.parse(msg)
  console.log(user_data);
  next()
});

worker.on('error', function (err, msg) {
  console.log("ERROR", err, msg.id);
});
worker.on('exceeded', function (msg) {
  console.log("EXCEEDED", msg.id);
});
worker.on('timeout', function (msg) {
  console.log("TIMEOUT", msg.id, msg.rc);
});

worker.start();