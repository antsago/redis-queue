const RedisSMQ = require("rsmq");

const HOST = process.env.NODE_ENV ? '127.0.0.1' : 'redis';

class QueueClient {
  constructor(queueName) {
    this.name = queueName;
    this.rsmq = new RedisSMQ({ host: HOST, port: 6379, ns: 'rsmq' });
  }

  async create() {
    try {
      await new Promise((resolve, reject) => 
        this.rsmq.createQueue({ qname: this.name }, (err, resp) => {
          if (err) {
            reject(err);
          } else {
            resolve(resp);
          }
        })
      );
    } catch (err) {
      if (err.name == 'queueExists') {
        console.log('Queue Exists');
      } else {
        throw err;
      }
    }
  }

  // I'll assume that the queue is only used for this and that the message 
  // source can be trusted (thus there's no need for validation)
  async receive() {
    return await new Promise((resolve, reject) => 
      this.rsmq.receiveMessage({ qname: this.name }, (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      })
    );
  }

  async delete(messageId) {
    return await new Promise((resolve, reject) => 
      this.rsmq.deleteMessage({ qname: this.name, id: messageId }, (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp);
        }
      })
    );
  }
}

module.exports = QueueClient;
