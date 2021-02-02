import { getErrorMessage } from "./error-messages";

export type ErrorType = {
  statusCode: number;
  message: string;
};

export type FetchReturnType<T> =
  | {
      status: "ok";
      data: T;
    }
  | {
      status: "error";
      data: ErrorType;
    };

const DEFAULT_REQUEST_INIT = {
  method: "GET",
  cache: "default" as const,
  headers: {
    "Content-Type": "application/json",
  },
};

export async function sendRequest<T>(
  route: { name: string; url: string },
  options?: RequestInit,
  queryParams?: URLSearchParams
): Promise<FetchReturnType<T>> {
  try {
    // construct query params if they are defined
    let completeUrl = route.url;
    if (typeof queryParams !== "undefined") {
      completeUrl += "?" + queryParams;
    }

    // send API request with provided arguments
    const response = await fetch(completeUrl, {
      ...DEFAULT_REQUEST_INIT,
      ...options,
      headers: { ...DEFAULT_REQUEST_INIT.headers, ...options?.headers },
    });

    // check for error
    if (!response.ok || response.status < 200 || response.status > 299) {
      return {
        status: "error",
        data: {
          statusCode: response.status,
          message: getErrorMessage(route.name, response.status.toString()),
        },
      } as FetchReturnType<T>;
    }

    try {
      return {
        status: "ok",
        data: await response.json(),
      };
    } catch {
      const text = await response.clone().text();
      return {
        status: "ok",
        data: (text as unknown) as T,
      };
    }
  } catch (e) {
    // api is probably down
    return {
      status: "error",
      data: {
        statusCode: 500,
        message: getErrorMessage(route.name, "500"),
      },
    };
  }
}
