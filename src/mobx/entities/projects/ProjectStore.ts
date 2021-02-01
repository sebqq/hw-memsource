import { destroy, flow, Instance, types } from "mobx-state-tree";
import dayjs from "dayjs";

import { Project } from "./Project";
import projectAPI from "../../../api/endpoints/projects";
import { FetchState } from "../../types";
import { ProjectResponse, ProjectsResponse } from "../../../api/models";
import { str2LocalDate } from "../../../utils/helpers";
import {
  BaseRequestState,
  BASE_REQUEST_INIT_STATE,
  SendRequestReturnType,
} from "../api/RequestState";
import { DueInHoursType } from "../../../components/ProjectListScreen/useDueFilterReducer";

export type ProjectStoreModel = Instance<typeof ProjectStore>;

export const PROJECTS_INIT_STATE = {
  ...BASE_REQUEST_INIT_STATE,
  totalElements: 0,
  totalPages: 0,
  pageSize: 0,
  pageNumber: 0,
  numberOfElements: 0,
  content: {},
};

export const ProjectStore = types
  .compose(
    BaseRequestState,
    types.model("ProjectStore", {
      totalElements: types.optional(types.number, 0),
      totalPages: types.optional(types.number, 0),
      pageSize: types.optional(types.number, 0),
      pageNumber: types.optional(types.number, 0),
      numberOfElements: types.optional(types.number, 0),
      content: types.map(Project),
    })
  )
  .views((self) => {
    return {
      getProjectByUid(uid: string) {
        return self.content.get(uid);
      },

      /**
       * Filter fetched projects by 'dueInHours' or return all of projects as Array.
       *
       * @param dueInHours one from dueInHours enum.
       */
      getFilteredProjectsUids(dueInHours: DueInHoursType) {
        if (typeof dueInHours !== "number") {
          // means that 'anyDueDate' was set so we can skip due filtering
          return Array.from(self.content.values()).map(
            (project) => project.uid
          );
        }

        const dayNow = dayjs();
        return Array.from(self.content.values()).reduce(
          (uids, currentProject) => {
            const dueDate = str2LocalDate(currentProject.dateDue);
            const dueDiff = dueDate.diff(dayNow, "h");

            // filter by dueInHours
            if (dueDate.isAfter(dayNow) && dueInHours >= dueDiff) {
              uids.push(currentProject.uid);
            }

            return uids;
          },
          [] as string[]
        );
      },
    };
  })
  .actions((self) => {
    return {
      processProject(apiData: ProjectResponse) {
        self.content.put({ ...apiData, ...BASE_REQUEST_INIT_STATE });
      },

      processProjectList(apiData: ProjectsResponse) {
        self.totalElements = apiData.totalElements;
        self.totalPages = apiData.totalPages;
        self.pageSize = apiData.pageSize;
        self.pageNumber = apiData.pageNumber;
        self.numberOfElements = apiData.numberOfElements;

        for (const apiProject of apiData.content) {
          self.content.put({ ...apiProject, ...BASE_REQUEST_INIT_STATE });
        }
      },

      /**
       * Overrides RequestState reset method.
       */
      reset(state: FetchState, errorMessage: string | null = null) {
        self.totalElements = 0;
        self.totalPages = 0;
        self.pageSize = 0;
        self.pageNumber = 0;
        self.numberOfElements = 0;
        destroy(self.content);
        self.setRequestState(state, errorMessage);
      },

      /**
       * Removes project defined by it's uid from stored projects
       *
       * @param uid project's uid
       */
      destroyProject(uid: string) {
        return self.content.delete(uid);
      },
    };
  })
  .actions((self) => {
    return {
      getAll: flow(function* (
        pageNumber: number = 0,
        dueDateHours?: DueInHoursType
      ) {
        const token = self.getAccessToken();
        if (!token) {
          return;
        }

        const result: SendRequestReturnType<ProjectsResponse> = yield self.sendApiRequest(
          true,
          projectAPI.getAll,
          token,
          dueDateHours,
          pageNumber
        );

        if (!result) {
          // we are sure that result is null when something went wrong.
          return null;
        }

        self.processProjectList(result.data);
        self.setRequestState("stale");
        return result;
      }),
    };
  });
