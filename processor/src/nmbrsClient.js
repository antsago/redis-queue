const xml2js = require('xml2js');
const axios = require("axios").default;

COMPANY_SERVICE = 'https://api.nmbrs.nl/soap/v2.1/CompanyService';
EMPLOYEE_SERVICE = 'https://api.nmbrs.nl/soap/v2.1/EmployeeService';

class Nmbrs {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async makeCall(service, data) {
    try {
      const payload = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Header><AuthHeader xmlns="${service}"><Username>${this.username}</Username><Token>${this.password}</Token></AuthHeader></soap:Header><soap:Body>${data}</soap:Body></soap:Envelope>`;
      const response = await axios.post(
        `${service}.asmx`,
        payload,
        { headers: { 'content-type': 'text/xml' } },
      );

      const parsedResponse = await xml2js.parseStringPromise(response.data);
      return parsedResponse['soap:Envelope']['soap:Body'][0]
    } catch (error) {
      console.error(error)
    }
  }

  async getCompanies() {
    const payload = '<List_GetAll xmlns="https://api.nmbrs.nl/soap/v2.1/CompanyService" />';
    const response = await this.makeCall(COMPANY_SERVICE, payload);
  
    const companies = response['List_GetAllResponse'][0]['List_GetAllResult'][0]['Company'];

    return companies.map(comp => ({ id: comp['ID'][0], number: comp['Number'][0], name: comp['Name'][0] }))
  }

  async getEmployees(companyId) {
    const payload = `<Function_GetAll_AllEmployeesByCompany_V2 xmlns="https://api.nmbrs.nl/soap/v2.1/EmployeeService"><CompanyID>${companyId}</CompanyID></Function_GetAll_AllEmployeesByCompany_V2>`;
    const response = await this.makeCall(EMPLOYEE_SERVICE, payload);

    const employees = response['Function_GetAll_AllEmployeesByCompany_V2Response'][0]['Function_GetAll_AllEmployeesByCompany_V2Result'][0]['EmployeeFunctionItem_V2'];

    return employees.map(employee => {
      return {
        id: employee['EmployeeId'][0],
        startYear: parseInt(employee['EmployeeFunctions'][0]['EmployeeFunction'][0]['StartYear'][0], 10),
      }
    });
  }

  async getDaysOff(employeeId, year) {
    const payload = `<Leave_GetList_V2 xmlns="https://api.nmbrs.nl/soap/v2.1/EmployeeService"><EmployeeId>${employeeId}</EmployeeId><Year>${year}</Year></Leave_GetList_V2>`;
    const response = await this.makeCall(EMPLOYEE_SERVICE, payload);

    const leaves = response['Leave_GetList_V2Response'][0]['Leave_GetList_V2Result'][0]['LeaveV2'];
    return leaves ?
      leaves.map(leave => ({
        date: new Date(leave['Start'][0]),
        durationHours: parseFloat(leave['Hours'][0]),
        description: leave['Description'] ? leave['Description'][0] : '',
        id: leave['Id'][0],
        type: leave['Type'][0],
      }))
      : [];
  }
}

module.exports = Nmbrs;