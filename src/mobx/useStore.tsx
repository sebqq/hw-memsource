import React from "react";
import { useLocalObservable } from "mobx-react-lite";

import { createStore, RootStoreModel } from "./createStore";
import { AuthStoreModel } from "./entities/auth/AuthStore";
import { ProjectStoreModel } from "./entities/projects/ProjectStore";

export interface StoreContextType extends RootStoreModel {
  authStore: AuthStoreModel;
  projectStore: ProjectStoreModel;
}

const storeContext = React.createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC = ({ children }) => {
  const store = useLocalObservable(createStore);
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
