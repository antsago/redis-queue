const Nmbrs = require('../src/nmbrsClient');
jest.mock('../src/nmbrsClient');

const companies = [{ foo: 'bar'}]
const employees = [{ foo: 'bar'}]
const daysOff = [{ foo: 'bar'}]

const mockGetCompanies = jest.fn();
Nmbrs.prototype.getCompanies = mockGetCompanies;
mockGetCompanies.mockReturnValue(Promise.resolve(companies));

const mockGetEmployess = jest.fn();
Nmbrs.prototype.getEmployees = mockGetEmployess;
mockGetEmployess.mockReturnValue(Promise.resolve(employees));

const mockGetDaysOff = jest.fn();
Nmbrs.prototype.getDaysOff = mockGetDaysOff;
mockGetDaysOff.mockReturnValue(Promise.resolve(daysOff));

const client = new Nmbrs();

describe('InfoExtractor', () => {
  test('Info returns expected information', async () => {
    expect(await client.getCompanies()).toBe(companies)
    expect(await client.getEmployees('1')).toBe(employees)
    expect(await client.getDaysOff('1', '2020')).toBe(daysOff)
  });
})