import { flow, getRoot, Instance, types } from "mobx-state-tree";
import dayjs from "dayjs";

import { ProjectResponse, ProjectStatusResponse } from "../../../api/models";
import { displayDateFromString, str2date } from "../../../utils/helpers";
import { RootStoreModel } from "../../createStore";
import projectAPI from "../../../api/endpoints/projects";
import { BaseRequestState, SendRequestReturnType } from "../api/RequestState";
import { FetchState } from "../../types";
import { DueInHoursType } from "../../../components/ProjectListScreen/useDueFilterReducer";

export type ProjectModel = Instance<typeof Project>;

export const Project = types
  .compose(
    BaseRequestState,
    types.model("Project", {
      uid: types.identifier,
      internalId: types.number,
      id: types.string,
      name: types.string,
      dateCreated: types.string,
      dateDue: types.string,
      status: types.enumeration<ProjectStatusResponse>("status", [
        "NEW",
        "ACCEPTED",
        "ASSIGNED",
        "DECLINED",
        "REJECTED",
        "DELIVERED",
        "EMAILED",
        "COMPLETED",
        "CANCELLED",
      ]),
      sourceLang: types.string,
      targetLangs: types.array(types.string),
    })
  )
  .views((self) => {
    /**
     * I've noticed that on Memsource dashboard they are using different
     * timezone formatting for 'dateDue' (local datetime) and 'created' (UTC datetime).
     * I've decided to use dates across the in consistent fashion so in this app we
     * will always provide Local datetime to our "End users".
     */
    return {
      dateCreatedString() {
        return displayDateFromString(self.dateCreated);
      },

      dateDueString() {
        return displayDateFromString(self.dateDue);
      },

      isBeforeDue(dueInHours: DueInHoursType) {
        if (dueInHours === "anyDueDate") {
          return true;
        }

        const dayNow = dayjs.utc();
        const dueDate = str2date(self.dateDue);
        const dueDiff = dueDate.diff(dayNow, "h");
        return dueDate.isAfter(dayNow) && dueInHours >= dueDiff;
      },
    };
  })
  .actions((self) => {
    return {
      /**
       * We don't wanna to actually 'reset' data here so users can see last
       * time fetched data before they dissapear. Project model is used
       * inside of ProjectStore store so when we really want to 'reset'
       * data then, we would also want to remove this node from
       * ProjectStore. This can be achieved by calling 'destroy' method
       * described below.
       */
      reset(state: FetchState, errorMessage: string | null = null) {
        self.setRequestState(state, errorMessage);
      },

      /**
       * Removes this node from ProjectStore so it would not be available
       * in state tree anymore.
       */
      destroy() {
        const root = getRoot<RootStoreModel>(self);
        root.projectStore.destroyProject(self.uid);
      },

      /**
       * Refreshes project's data using API call to get project's details.
       */
      refresh: flow(function* () {
        const token = self.getAccessToken();
        if (!token) {
          return;
        }

        const result: SendRequestReturnType<ProjectResponse> = yield self.sendApiRequest(
          true,
          projectAPI.getOne,
          token,
          self.uid
        );

        if (!result) {
          // we are sure that result is null when something went wrong.
          return null;
        }

        const root = getRoot<RootStoreModel>(self);
        return root.projectStore.processProject(result.data);
      }),
    };
  });
