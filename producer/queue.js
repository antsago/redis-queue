const rsmq = require("rsmq")
const queue = new rsmq({
  host: "localhost",
  port: 6379,
  ns: "producer",
});

exports.create = async () => {
  try {
    response = await queue.createQueueAsync({ qname: "commandqueue" })
    if (response === 1) {
      console.log("Queue created", response);
    }
  } catch (err) {
    if (err.name == 'queueExists') {
      console.log(" DQueue Exists")
    }
  }
};

exports.send = async (data) => {
  try {
    response = await queue.sendMessageAsync({
      qname: "commandqueue",
      message: data
    })
    if (response) {
      console.log("Message sent. ID:", response);
    }
  } catch (err) {
    console.log(err)
  }
};
