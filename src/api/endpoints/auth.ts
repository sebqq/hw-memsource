import { sendRequest } from "../fetch";
import { LoginResponse, WhoAmIResponse } from "../models";
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_VALIDATE_SESSION } from "../routes";

const validateSession = (token: string) => {
  return sendRequest<WhoAmIResponse>(
    AUTH_VALIDATE_SESSION,
    undefined,
    new URLSearchParams({ token })
  );
};

const logout = (token: string) => {
  return sendRequest<null>(
    AUTH_LOGOUT,
    {
      method: "POST",
    },
    new URLSearchParams({ token })
  );
};

const login = (userName: string, password: string) => {
  return sendRequest<LoginResponse>(AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({
      userName,
      password,
    }),
  });
};

export default {
  login,
  logout,
  validateSession,
};
