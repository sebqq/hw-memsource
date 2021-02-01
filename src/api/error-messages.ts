import * as routes from "./routes";

export function getErrorMessage(urlPath: string, errorCode: string) {
  return (
    errorMessages[urlPath]?.[errorCode] ??
    errorMessages[urlPath]?.fallback ??
    errorMessages.fallback.message
  );
}

export const errorMessages: { [key: string]: { [key: string]: string } } = {
  // auth
  [routes.AUTH_LOGIN.name]: {
    401: "Failed to Sign in. Insufficient permissions.",
    403: "Failed to Sign in. Insufficient permissions.",
    500: "Internal server error.",
    fallback: "Failed to Sign in.",
  },
  [routes.AUTH_LOGOUT.name]: {
    fallback: "Failed to Log out.",
  },
  [routes.AUTH_VALIDATE_SESSION.name]: {
    fallback: "Credentials are no longer valid. Please Sign in again.",
  },
  // projects
  [routes.PROJECTS_GET_ALL.name]: {
    400: "Projects couldn't be fetched from server. Try again later please.",
    500: "Internal server error.",
    fallback: "Something went wrong during projects fetching.",
  },
  // projects
  [routes.PROJECTS_GET_ONE.name]: {
    400: "Project couldn't be fetched from server. Try again later please.",
    fallback: "Something went wrong during project fetching.",
  },
  // global fallback
  fallback: {
    message: "Unexpected error happened.",
  },
};
