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

    const employees = await Promise.all(this
      .range(employee.startYear, thisYear)
      .map(year => this.client.getDaysOff(employee.id, year)),
    );

    return employees.flat()
  }

  async extractInfo() {
    const companies = await this.client.getCompanies();

    const employees = await Promise.all(companies.map(company => this.client.getEmployees(company.id)));

    const daysOff = await Promise.all(employees.flat().map(async employee => ({
      daysOff: await this.getAllDaysOff(employee),
      employeeId: employee.id,
    })))

    return daysOff
  }
}

module.exports = InfoExtractor;
