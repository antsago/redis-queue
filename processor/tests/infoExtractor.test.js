const Nmbrs = require("../src/nmbrsClient");
const Extractor = require("../src/infoExtractor");

jest.mock("../src/nmbrsClient");

const companies = [{ id: "54613", number: "444445", name: "DEMO B.V. 2" }];
const employees = [
  { id: "503293", startYear: new Date().getFullYear() },
  { id: "503305", startYear: new Date().getFullYear() }
];
const daysOff = [
  {
    date: new Date("2018-01-10T23:00:00.000Z"),
    durationHours: 22.8,
    description: "",
    id: "1018970",
    type: "Type1"
  }
];

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

describe("InfoExtractor", () => {
  test("Info returns expected information", async () => {
    const extractor = new Extractor(client);

    const data = await extractor.extractInfo();

    expect(data).toMatchSnapshot();
  });

  test('GetCompanies is called once', () => {
    expect(mockGetCompanies.mock.calls.length).toBe(1)
  });

  test('GetEmployees is called once per company', () => {
    expect(mockGetEmployess.mock.calls.length).toBe(companies.length)
  });

  test('GetDaysOff is called once per employee', () => {
    expect(mockGetDaysOff.mock.calls.length).toBe(employees.length)
  });
});
