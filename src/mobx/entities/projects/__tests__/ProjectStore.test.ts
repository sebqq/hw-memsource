import { applyPatch, getSnapshot } from "mobx-state-tree";

import { StoreContextType } from "../../../useStore";
import { createStore } from "../../../createStore";
import { ProjectResponse, ProjectsResponse } from "../../../../api/models";

const FILLED_PROJECT_STORE = {
  _apiRequestErrorMessage: null,
  _apiRequestState: "stale",
  content: {
    "9WCKA241cKjElWyAFD9tD4": {
      _apiRequestErrorMessage: null,
      _apiRequestState: "stale",
      dateCreated: "2021-01-30T08:11:00+0000",
      dateDue: "2021-02-02T16:00:00+0000",
      id: "21157460",
      internalId: 4,
      name: "Fourth Project",
      sourceLang: "pl",
      status: "NEW",
      targetLangs: ["sk_sk"],
      uid: "9WCKA241cKjElWyAFD9tD4",
    },
    DXGLDJQIZ4VU4lloa3QkN1: {
      _apiRequestErrorMessage: null,
      _apiRequestState: "stale",
      dateCreated: "2021-01-31T15:47:39+0000",
      dateDue: "2021-02-04T15:00:00+0000",
      id: "21158755",
      internalId: 13,
      name: "Eleventh project name",
      sourceLang: "hr",
      status: "NEW",
      targetLangs: ["cs_cz"],
      uid: "DXGLDJQIZ4VU4lloa3QkN1",
    },
  },
  numberOfElements: 10,
  pageNumber: 0,
  pageSize: 10,
  totalElements: 12,
  totalPages: 2,
};

const FAKE_API_RESPONSE = {
  content: [
    {
      dateCreated: "2021-01-30T08:11:00+0000",
      dateDue: "2021-02-02T16:00:00+0000",
      id: "21157460",
      internalId: 4,
      name: "Fourth Project",
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
      name: "Eleventh project name",
      sourceLang: "hr",
      status: "NEW",
      targetLangs: ["cs_cz"],
      uid: "DXGLDJQIZ4VU4lloa3QkN1",
    },
  ],
  numberOfElements: 10,
  pageNumber: 0,
  pageSize: 10,
  totalElements: 12,
  totalPages: 2,
} as ProjectsResponse;

const SOME_PROJECT = {
  dateCreated: "2021-01-30T08:10:17+0000",
  dateDue: "2021-02-11T12:00:00+0000",
  id: "21157458",
  internalId: 3,
  name: "Third Project",
  sourceLang: "cs",
  status: "NEW",
  targetLangs: ["fr_fr"],
  uid: "VVz7QbuIj6q0dafqDhwur1",
} as ProjectResponse;

describe("ProjectStore Model tests", () => {
  it("Test destroyProject action", () => {
    const rootStore: StoreContextType = createStore();

    applyPatch(rootStore, {
      op: "add",
      path: "/projectStore",
      value: FILLED_PROJECT_STORE,
    });
    expect(rootStore.projectStore.content.size).toEqual(2);

    expect(rootStore.projectStore.destroyProject("QSDASDERWQ")).toEqual(false);
    expect(rootStore.projectStore.content.size).toEqual(2);

    rootStore.projectStore.destroyProject("9WCKA241cKjElWyAFD9tD4");
    expect(rootStore.projectStore.content.size).toEqual(1);
  });

  it("Test processProject action", () => {
    const rootStore: StoreContextType = createStore();
    expect(rootStore.projectStore.content.size).toEqual(0);
    rootStore.projectStore.processProject(SOME_PROJECT);
    expect(rootStore.projectStore.content.size).toEqual(1);
  });

  it("Test processProjects action", () => {
    const rootStore: StoreContextType = createStore();

    expect(rootStore.projectStore.content.size).toEqual(0);
    rootStore.projectStore.processProjectList(FAKE_API_RESPONSE);
    expect(rootStore.projectStore.content.size).toEqual(2);
  });

  it("Test reset action", () => {
    const rootStore: StoreContextType = createStore();
    const emptySnapshot = getSnapshot(rootStore.projectStore);

    expect(rootStore.projectStore.content.size).toEqual(0);
    rootStore.projectStore.processProjectList(FAKE_API_RESPONSE);
    expect(rootStore.projectStore.content.size).toEqual(2);

    rootStore.projectStore.reset("stale");
    expect(getSnapshot(rootStore.projectStore)).toEqual(emptySnapshot);
  });
});
