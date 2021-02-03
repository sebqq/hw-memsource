import * as React from "react";
import { render } from "@testing-library/react-native";
import { Instance } from "mobx-state-tree";

import { useStore as storeHook } from "../../mobx/useStore";
import {
  AuthStore,
  AuthStoreModel,
  AUTH_INIT_STATE,
} from "../../mobx/entities/auth/AuthStore";
import ProjectListScreen from "../ProjectListScreen";
import {
  ProjectStore,
  ProjectStoreModel,
  PROJECTS_INIT_STATE,
} from "../../mobx/entities/projects/ProjectStore";

const useStore = storeHook as ReturnType<typeof jest["fn"]>;
jest.mock("../../mobx/useStore");

let authStore: Instance<AuthStoreModel>;
let projectStore: Instance<ProjectStoreModel>;

const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  return {
    //@ts-ignore
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

const stubRootStore = () => {
  authStore = AuthStore.create(AUTH_INIT_STATE);
  projectStore = ProjectStore.create(PROJECTS_INIT_STATE);
  return { authStore, projectStore };
};

describe("ProjectScreen tests", () => {
  beforeEach(() => {
    useStore.mockReturnValue(stubRootStore());
  });

  it("it renders all inputs as expected", () => {
    const { toJSON } = render(<ProjectListScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
