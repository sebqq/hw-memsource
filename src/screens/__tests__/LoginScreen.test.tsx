import * as React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import fetchMock from "jest-fetch-mock";
import { when } from "mobx";
import { Instance } from "mobx-state-tree";

import { useStore as storeHook } from "../../mobx/useStore";
import {
  AuthStore,
  AuthStoreModel,
  AUTH_INIT_STATE,
} from "../../mobx/entities/auth/AuthStore";
import LoginScreen from "../LoginScreen";

const useStore = storeHook as ReturnType<typeof jest["fn"]>;
jest.mock("../../mobx/useStore");

let authStore: Instance<AuthStoreModel>;

const stubAuthStore = () => {
  authStore = AuthStore.create(AUTH_INIT_STATE);
  return { authStore };
};

describe("LoginScreen tests", () => {
  beforeEach(() => {
    global.fetch = fetchMock;
    useStore.mockReturnValue(stubAuthStore());
    fetchMock.resetMocks();
  });

  it("it renders all inputs as expected", () => {
    const { toJSON } = render(<LoginScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("Login - error flow", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(""), { status: 401 });

    const { getByText, getByTestId } = render(<LoginScreen />);
    expect(getByTestId("Login.Error").props.children).toBeNull();

    fireEvent(getByTestId("Login.username"), "onChangeText", "testUsername");
    fireEvent(getByTestId("Login.password"), "onChangeText", "testPasswd");

    fireEvent.press(getByText("Sign in"));
    await act(async () => {
      await when(() => authStore.requestState.state === "error");
    });
    expect(getByTestId("Login.Error").props.children).not.toBeNull();
  });

  it("Login - success flow", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        token: "123456",
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
      }),
      { status: 200 }
    );

    const { getByText, getByTestId } = render(<LoginScreen />);
    expect(getByTestId("Login.Error").props.children).toBeNull();

    fireEvent(getByTestId("Login.username"), "onChangeText", "testUsername");
    fireEvent(getByTestId("Login.password"), "onChangeText", "testPasswd");

    fireEvent.press(getByText("Sign in"));
    await act(async () => {
      await when(() => authStore.requestState.state === "stale");
    });
    expect(getByTestId("Login.Error").props.children).toBeNull();
  });
});
