import fetchMock from "jest-fetch-mock";
import { sendRequest } from "../fetch";

describe("useDataApi", () => {
  beforeAll(() => {
    global.fetch = fetchMock;
  });
  afterAll(() => {
    fetchMock.resetMocks();
  });

  it("Promise rejection", async () => {
    const routes = require("../routes");

    fetchMock.mockRejectOnce(() => Promise.reject("Api is down"));
    const result = await sendRequest(routes.AUTH_LOGIN);

    expect(result.status).toBe("error");
    expect(result.data).toEqual = {
      statusCode: 500,
      message: "Internal server error.",
    } as any;
  });

  // it("Promise abortion", async () => {
  //    in this app we are not checking for promise abortion right now.
  // });

  it("Handle 400", async () => {
    const routes = require("../routes");

    fetchMock.mockResponseOnce(JSON.stringify({ meesage: "Bad response." }), {
      status: 400,
    });
    const result = await sendRequest(routes.AUTH_LOGIN, { method: "POST" });

    expect(result.status).toBe("error");
    expect(result.data).toEqual = {
      statusCode: 400,
      message: "Failed to Sign in.",
    } as any;
  });

  it("Handle 200", async () => {
    const routes = require("../routes");

    fetchMock.mockResponseOnce(JSON.stringify({ userName: "username" }), {
      status: 200,
    });
    const result = await sendRequest(routes.AUTH_LOGIN, { method: "POST" });

    expect(result.status).toBe("ok");
    expect(result.data).toEqual = {
      userName: "username",
    } as any;
  });
});
