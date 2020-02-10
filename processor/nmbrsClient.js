const xml2js = require('xml2js');
const axios = require("axios").default;

class Nmbrs {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async getCompanies() {
    try {
      const payload = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Header><AuthHeader xmlns="https://api.nmbrs.nl/soap/v2.1/CompanyService"><Username>${this.username}</Username><Token>${this.password}</Token></AuthHeader></soap:Header><soap:Body><List_GetAll xmlns="https://api.nmbrs.nl/soap/v2.1/CompanyService" /></soap:Body></soap:Envelope>`;
    
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
}

module.exports = Nmbrs;