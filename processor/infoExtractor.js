class InfoExtractor {
  constructor(client) {
    this.client = client;
  }

  range(start, end) {
    const size = end - start + 1;

    return [...Array(size).keys()].map(i => i + start);
  }

  async getAllDaysOff(employee) {
    const thisYear = (new Date()).getFullYear();

    return Promise.all(this
      .range(employee.startYear, thisYear)
      .map(async year => await this.client.getDaysOff(employee.id, year)),
    );
  }

  async extractInfo() {
    const companies = await this.client.getCompanies();
    console.log(companies)
    const employees = await this.client.getEmployees(companies[0].id);
    console.log(employees)
    const daysOff = await this.getAllDaysOff(employees[0])
    console.log(daysOff)
  }
}

module.exports = InfoExtractor;
