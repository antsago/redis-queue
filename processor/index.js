const RedisSMQ = require("rsmq");
const xml2js = require('xml2js');
const axios = require("axios").default;
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

async function getCompanies(username, password) {
  try {
    const payload = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Header><AuthHeader xmlns="https://api.nmbrs.nl/soap/v2.1/CompanyService"><Username>${username}</Username><Token>${password}</Token></AuthHeader></soap:Header><soap:Body><List_GetAll xmlns="https://api.nmbrs.nl/soap/v2.1/CompanyService" /></soap:Body></soap:Envelope>`;
  
    const response = await axios.post(
      'https://api.nmbrs.nl/soap/v2.1/CompanyService.asmx',
      payload,
      { headers: { 'content-type': 'text/xml' } },
    );
  
    const parsedResponse = await xml2js.parseStringPromise(response.data);

    return parsedResponse['soap:Envelope']['soap:Body'][0]['List_GetAllResponse'][0]['List_GetAllResult'][0]['Company']
  } catch (error) {
    console.error(error)
  }
}

async function processMessage(message) {
  const companies = await getCompanies(message.user, message.pass);
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