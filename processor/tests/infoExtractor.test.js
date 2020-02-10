const Nmbrs = require('../src/nmbrsClient');
jest.mock('../src/nmbrsClient');

const companies = { foo: 'bar'}

const mockGetCompanies = jest.fn();
Nmbrs.prototype.getCompanies = mockGetCompanies;
mockGetCompanies.mockReturnValue(Promise.resolve(companies));

const client = new Nmbrs();

describe('InfoExtractor', () => {
  test('Info returns expected information', async () => {
    expect(await client.getCompanies()).toBe(companies)
    // expect(true).toBe(true)
  });
})