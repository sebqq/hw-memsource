export const API_URL_BASE = "https://cloud.memsource.com/web/api2/v1/";

// auth
export const AUTH_LOGIN = {
  name: "auth_login",
  url: API_URL_BASE + "auth/login",
};
export const AUTH_LOGOUT = {
  name: "auth_logout",
  url: API_URL_BASE + "auth/logout",
};
export const AUTH_VALIDATE_SESSION = {
  name: "auth_whoAmI",
  url: API_URL_BASE + "auth/whoAmI",
};

// projects
export const PROJECTS_GET_ALL = {
  name: "project_getall",
  url: API_URL_BASE + "projects",
};
export const PROJECTS_GET_ONE = {
  name: "project_getone",
  url: (uid: string) => `${PROJECTS_GET_ALL.url}/${uid}`,
};
