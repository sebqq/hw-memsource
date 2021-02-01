import { IAnyModelType, Instance, onSnapshot, types } from "mobx-state-tree";

import { AuthStore, AUTH_INIT_STATE } from "./entities/auth/AuthStore";
import {
  ProjectStore,
  PROJECTS_INIT_STATE,
} from "./entities/projects/ProjectStore";

export type RootStoreModel = Instance<typeof RootStore>;

export const RootStore = types
  .model("Store", {
    authStore: types.late((): IAnyModelType => AuthStore),
    projectStore: types.late((): IAnyModelType => ProjectStore),
  })
  .views((self) => ({
    get accessToken(): string | null {
      return self.authStore.token;
    },
  }))
  .actions((self) => {
    return {
      resetAll() {
        self.authStore.reset("stale");
        self.projectStore.reset("stale");
      },
    };
  });

export function createStore() {
  const store = RootStore.create({
    authStore: AUTH_INIT_STATE,
    projectStore: PROJECTS_INIT_STATE,
  });

  // Listen to new snapshots, which are created anytime something changes
  onSnapshot(store.authStore, (snapshot) => {
    store.authStore.persist(snapshot);
  });

  return store;
}

export type TStore = ReturnType<typeof createStore>;
