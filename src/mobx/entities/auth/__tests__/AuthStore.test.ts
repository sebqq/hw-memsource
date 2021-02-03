//@ts-ignore
import AsyncStorageMock from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import MockDate from "mockdate";

import { AuthStore, AUTH_INIT_STATE } from "../AuthStore";

jest.mock("../../../../api/endpoints/auth", () => ({
  __esModule: true,
  default: {
    validateSession: (token: string) => {
      return Promise.resolve({
        status: "ok",
        data: {
          token,
          expires: "2021-01-150T04:00:00-0000",
          user: {
            firstName: "firstName",
            lastName: "lastname",
            userName: "username",
            email: "email@email.com",
            role: "NONE",
            id: "1",
            uid: "1",
          },
        },
      });
    },
  },
}));

let authStore = AuthStore.create(AUTH_INIT_STATE);
beforeEach(() => {
  MockDate.reset();
  AsyncStorageMock.clear();
  authStore = AuthStore.create(AUTH_INIT_STATE);
});

describe("AuthStore Model tests", () => {
  it("Test isTokenExpired() view", () => {
    MockDate.set("2021-01-01T05:00:00-0000");

    // check for not yet expired date
    expect(authStore.isTokenExpired("2021-01-01T08:00:00-0000")).toBeFalsy();
    expect(authStore.isTokenExpired("2021-01-01T05:00:01-0000")).toBeFalsy();

    // test invalid date
    expect(authStore.isTokenExpired("2021-01-1325123")).toBeTruthy();

    // check for already expired date
    expect(authStore.isTokenExpired("2021-01-01T04:00:00-0000")).toBeTruthy();
    expect(authStore.isTokenExpired("2021-01-01T04:59:59-0000")).toBeTruthy();
  });
});

describe("AuthStore Model - hydrate() action tests", () => {
  it("Test credentials not in AsyncStorage", async () => {
    AsyncStorageMock.getItem = jest.fn(async (key, callback) => {
      callback && callback(null, null);
      return null;
    });

    await authStore.hydrate();

    expect(authStore.requestState.state).toBe("stale");
    expect(authStore.token).toBeNull();
    expect(authStore.authenticated).toBeFalsy();
  });

  it("Test expired credentials in AsyncStorage", async () => {
    const authExpired = {
      token: "123456",
      expires: "2021-01-01T04:00:00-0000",
    };
    AsyncStorageMock.getItem = jest.fn(async (key, callback) => {
      callback && callback(null, JSON.stringify(authExpired));
      return JSON.stringify(authExpired);
    });
    MockDate.set("2021-01-01T05:00:00-0000");

    await authStore.hydrate();

    expect(authStore.requestState.state).toBe("expired");
    expect(AsyncStorageMock.getItem).toHaveBeenCalledTimes(1);
  });

  it("Test valid credentials in AsyncStorage", async () => {
    const storedAuthMock = {
      token: "123456",
      expires: "2021-01-30T04:00:00-0000",
    };
    AsyncStorageMock.getItem = jest.fn(async (key, callback) => {
      callback && callback(null, JSON.stringify(storedAuthMock));
      return JSON.stringify(storedAuthMock);
    });
    MockDate.set("2021-01-01T05:00:00-0000");

    await authStore.hydrate();

    expect(authStore.token).toBe("123456");
    expect(authStore.requestState.state).toBe("stale");
    expect(authStore.authenticated).toBeTruthy();
    expect(authStore.user).not.toBeNull();
    expect(AsyncStorageMock.getItem).toHaveBeenCalledTimes(1);
  });
});
