import * as React from "react";
import { render, act } from "@testing-library/react-native";
import fetchMock from "jest-fetch-mock";
import { when } from "mobx";
import MockDate from "mockdate";

import {
  StoreContextType,
  useStore as storeHook,
} from "../../../mobx/useStore";
import { createStore } from "../../../mobx/createStore";
import ProjectList from "../ProjectList";

const useStore = storeHook as ReturnType<typeof jest["fn"]>;
jest.mock("../../../mobx/useStore");
let rootStore: StoreContextType;

const stubAuthStore = () => {
  rootStore = createStore();
  return rootStore;
};

const PROJECTS_FAKE_BODY = {
  content: [
    {
      dateCreated: "2021-01-30T08:11:00+0000",
      dateDue: "2021-02-02T16:00:00+0000",
      id: "21157460",
      internalId: 4,
      name: "First Project",
      sourceLang: "pl",
      status: "NEW",
      targetLangs: ["sk_sk"],
      uid: "9WCKA241cKjElWyAFD9tD4",
    },
    {
      dateCreated: "2021-01-31T15:47:39+0000",
      dateDue: "2021-02-04T15:00:00+0000",
      id: "21158755",
      internalId: 13,
      name: "Second Project",
      sourceLang: "hr",
      status: "NEW",
      targetLangs: ["cs_cz"],
      uid: "DXGLDJQIZ4VU4lloa3QkN1",
    },
  ],
  numberOfElements: 2,
  pageNumber: 0,
  pageSize: 10,
  totalElements: 2,
  totalPages: 1,
};

const PROJECTS_FAKE_BODY_EMPTY = {
  ...PROJECTS_FAKE_BODY,
  content: [],
};

describe("ProjectList tests", () => {
  beforeEach(() => {
    global.fetch = fetchMock;
    useStore.mockReturnValue(stubAuthStore());
    jest
      .spyOn(rootStore.projectStore, "getAccessToken")
      .mockImplementation(() => "123456");
    fetchMock.resetMocks();
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("ProjectList - empty content", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(PROJECTS_FAKE_BODY_EMPTY), {
      status: 200,
    });

    const { getByText } = render(<ProjectList />);

    getByText("Filter by Due:");
    await act(async () => {
      await when(() => rootStore.projectStore.requestState.state === "pending");
      await when(() => rootStore.projectStore.requestState.state === "stale");
    });

    getByText("There is no project to display.");
  });

  it("ProjectList - API error - empty content", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(""), {
      status: 400,
    });

    const { getByText } = render(<ProjectList />);

    getByText("Filter by Due:");
    await act(async () => {
      await when(() => rootStore.projectStore.requestState.state === "pending");
      await when(() => rootStore.projectStore.requestState.state === "error");
    });

    getByText(
      "Projects couldn't be fetched from server. Try again later please."
    );
  });

  it("ProjectList - filtered by Due - empty list", async () => {
    MockDate.set("2021-02-01T12:00:00+0000");
    fetchMock.mockResponseOnce(JSON.stringify(PROJECTS_FAKE_BODY), {
      status: 200,
    });

    const { getByText } = render(<ProjectList initDueFilter={4} />);

    getByText("Filter by Due:");
    await act(async () => {
      await when(() => rootStore.projectStore.requestState.state === "pending");
      await when(() => rootStore.projectStore.requestState.state === "stale");
    });

    expect(rootStore.projectStore.content.size).toBe(2);
    getByText("There are no projects for selected Due filter.");
  });

  it("ProjectList - render projects", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(PROJECTS_FAKE_BODY), {
      status: 200,
    });

    const { getByText } = render(<ProjectList />);

    await act(async () => {
      await when(() => rootStore.projectStore.requestState.state === "pending");
      await when(() => rootStore.projectStore.requestState.state === "stale");
    });

    getByText("First Project");
    getByText("Second Project");
    expect(rootStore.projectStore.content.size).toBe(2);
  });

  it("ProjectList - Loading is visible while fetching", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(PROJECTS_FAKE_BODY), {
      status: 200,
    });

    const { getByText, queryByText } = render(<ProjectList />);

    await act(async () => {
      await when(() => rootStore.projectStore.requestState.state === "pending");
      queryByText("Loading...");
      await when(() => rootStore.projectStore.requestState.state === "stale");
    });
    expect(queryByText("Loading...")).toBeNull();

    getByText("First Project");
    getByText("Second Project");
    expect(rootStore.projectStore.content.size).toBe(2);
  });
});
