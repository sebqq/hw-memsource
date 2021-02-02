import { applyPatch } from "mobx-state-tree";

import { StoreContextType } from "../../mobx/useStore";
import { createStore } from "../../mobx/createStore";

const FILLED_ROOT_STORE = {
  authStore: {
    _apiRequestErrorMessage: null,
    _apiRequestState: "stale",
    authenticated: true,
    expires: "2021-02-02T14:20:50+0000",
    token: "1234567",
    user: {
      email: "email@gmail.com",
      firstName: "firstName",
      id: "1",
      lastName: "lastname",
      uid: "1",
      userName: "username",
    },
  },
  projectStore: {
    _apiRequestErrorMessage: null,
    _apiRequestState: "stale",
    content: {
      "9WCKA241cKjElWyAFD9tD4": {
        _apiRequestErrorMessage: null,
        _apiRequestState: "pending",
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
  },
};

describe("RootStore Model tests", () => {
  it("Test accessToken get view", () => {
    const rootStore: StoreContextType = createStore();

    expect(rootStore.accessToken).toEqual(null);

    applyPatch(rootStore, {
      op: "replace",
      path: "/authStore/token",
      value: "abcdefgh123456789",
    });
    expect(rootStore.accessToken).toEqual("abcdefgh123456789");
  });

  it("Test reset() action", () => {
    const rootStore: StoreContextType = createStore();
    applyPatch(rootStore, {
      op: "replace",
      path: "/",
      value: FILLED_ROOT_STORE,
    });

    rootStore.resetAll();
    expect(rootStore.accessToken).toEqual(null);
    expect(rootStore.authStore.user).toEqual(null);
    expect(rootStore.projectStore.content.size).toBe(0);
  });
});
