import { sendRequest } from "../fetch";
import { ProjectResponse, ProjectsResponse } from "../models";
import { PROJECTS_GET_ALL, PROJECTS_GET_ONE } from "../routes";
import { DueInHoursType } from "../../components/ProjectListScreen/useDueFilterReducer";

const getOne = (token: string, projectUid: string) => {
  const routeParam = {
    ...PROJECTS_GET_ONE,
    url: PROJECTS_GET_ONE.url(projectUid),
  };
  return sendRequest<ProjectResponse>(
    routeParam,
    undefined,
    new URLSearchParams({ token })
  );
};

const getAll = (
  token: string,
  dueInHours?: DueInHoursType,
  pageNumber: number = 0
) => {
  let urlParams = new URLSearchParams({
    token,
    pageSize: "10",
    pageNumber: pageNumber.toString(),
  });
  if (typeof dueInHours === "number") {
    urlParams.append("dueInHours", dueInHours.toString());
  }
  return sendRequest<ProjectsResponse>(PROJECTS_GET_ALL, undefined, urlParams);
};

export default {
  getAll,
  getOne,
};
