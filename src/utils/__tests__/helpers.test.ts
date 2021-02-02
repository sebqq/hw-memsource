import { str2date, displayDateFromString } from "../helpers";

describe("Date parse utils tests", () => {
  it("Test str2date()", () => {
    expect(str2date("2021-01-30T08:00:00+0000").toISOString()).toBe(
      "2021-01-30T08:00:00.000Z"
    );
    expect(str2date("2021-01-30T08:00:00+0100").toISOString()).toBe(
      "2021-01-30T07:00:00.000Z"
    );
    expect(str2date("2021-01-30T08:00:00-0100").toISOString()).toBe(
      "2021-01-30T09:00:00.000Z"
    );
  });

  it("Test displayDateFromString()", () => {
    // We've set local timezone to be GMT for testing purposes
    expect(displayDateFromString("2021-01-30T08:00:00+0000")).toBe(
      "January 30, 2021 08:00"
    );
    expect(displayDateFromString("2021-01-30T08:00:00+0100")).toBe(
      "January 30, 2021 07:00"
    );
    expect(displayDateFromString("2021-01-30T08:00:00-0100")).toBe(
      "January 30, 2021 09:00"
    );
  });
});
