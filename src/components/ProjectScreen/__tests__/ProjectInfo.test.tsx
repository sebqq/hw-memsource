import * as React from "react";
import { act, render } from "@testing-library/react-native";
import fetchMock from "jest-fetch-mock";

import {
  StoreContextType,
  useStore as storeHook,
} from "../../../mobx/useStore";
import { createStore } from "../../../mobx/createStore";
import ProjectInfo from "../ProjectInfo";
import { displayDateFromString } from "../../../utils/helpers";

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
  ],
  numberOfElements: 2,
  pageNumber: 0,
  pageSize: 10,
  totalElements: 2,
  totalPages: 1,
};

const PROJECT_REFRESHED = {
  dateCreated: "2021-01-30T08:11:00+0000",
  dateDue: "2021-02-02T16:00:00+0000",
  id: "21157460",
  internalId: 4,
  name: "First Project New Name",
  sourceLang: "pl",
  status: "NEW",
  targetLangs: ["sk_sk"],
  uid: "9WCKA241cKjElWyAFD9tD4",
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

  it("ProjectInfo - display project info", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(PROJECTS_FAKE_BODY), {
      status: 200,
    });
    await rootStore.projectStore.getAll();

    const { getByText } = render(<ProjectInfo uid="9WCKA241cKjElWyAFD9tD4" />);

    getByText("First Project");
    getByText(displayDateFromString(PROJECTS_FAKE_BODY.content[0].dateCreated));
    getByText("NEW");
    getByText(displayDateFromString(PROJECTS_FAKE_BODY.content[0].dateDue));
    getByText("pl");
  });

  it("ProjectInfo - refresh", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(PROJECTS_FAKE_BODY), {
      status: 200,
    });
    await rootStore.projectStore.getAll();

    const { getByText } = render(<ProjectInfo uid="9WCKA241cKjElWyAFD9tD4" />);

    getByText("First Project");

    const project = rootStore.projectStore.getProjectByUid(
      "9WCKA241cKjElWyAFD9tD4"
    );
    expect(project).not.toBeUndefined();
    if (!project) {
      return;
    }

    fetchMock.mockResponseOnce(JSON.stringify(PROJECT_REFRESHED), {
      status: 200,
    });
    jest.spyOn(project, "getAccessToken").mockImplementation(() => "123456");

    await act(async () => {
      await project.refresh();
    });
    getByText("First Project New Name");
  });

  it("ProjectInfo - failed refresh", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(PROJECTS_FAKE_BODY), {
      status: 200,
    });
    await rootStore.projectStore.getAll();

    const { getByText } = render(<ProjectInfo uid="9WCKA241cKjElWyAFD9tD4" />);
    getByText("First Project");

    const project = rootStore.projectStore.getProjectByUid(
      "9WCKA241cKjElWyAFD9tD4"
    );
    expect(project).not.toBeUndefined();
    if (!project) {
      return;
    }

    fetchMock.mockResponseOnce(JSON.stringify(""), {
      status: 400,
    });
    jest.spyOn(project, "getAccessToken").mockImplementation(() => "123456");
    await act(async () => {
      await project.refresh();
    });

    getByText("Failed to fetch this project.");
    // old data should still be visible even when fetch fails
    getByText("First Project");
  });
});
