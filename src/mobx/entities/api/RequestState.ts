import { types, Instance, flow, getRoot, toGenerator } from "mobx-state-tree";
import { ErrorType, FetchReturnType } from "../../../api/fetch";
import { RootStoreModel } from "../../createStore";

import { FetchState } from "../../types";

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;
export type SendRequestReturnType<T extends Object> = {
  status: "ok";
  data: T;
} | null;
export type BaseRequestStateModel = Instance<typeof BaseRequestState>;

export const BASE_REQUEST_INIT_STATE = {
  _apiRequestState: "pending",
};

/**
 * This model SHOULD NOT BE used as standalone store. Other
 * models/stores that are making API request SHOULD BE composed
 * from this Model in order to obtain basing request handling
 * functionality that supports DRY principle.
 *
 * Note: Currently, we are not doing more than 1 relevant API request
 * from any Store/model. If we will need to handle multiple requests
 * then we could implement something like 'Map' of requests in order
 * to keep state/error for every type of API request indenpendently
 * inside of model. Then we could access relevant request's API state
 * using some kind of it's identificator (in O(1) time).
 */
export const BaseRequestState = types
  .model("RequestState", {
    _apiRequestState: types.enumeration("ApiState", [
      "stale",
      "pending",
      "error",
      "expired",
    ]),
    _apiRequestErrorMessage: types.maybeNull(types.string),
  })
  .views((self) => {
    return {
      get requestState() {
        return {
          state: self._apiRequestState,
          errorMessage: self._apiRequestErrorMessage,
        };
      },

      /**
       * Look for access token into the authStore
       */
      getAccessToken() {
        const root = getRoot<RootStoreModel>(self);
        return root.accessToken;
      },
    };
  })
  .actions((self) => {
    return {
      /**
       * We will provide clean API for models, that are composed from RequestState
       * so they can easily set API request details.
       *
       * @param state api state to set
       * @param errorMessage error message of API request
       */
      setRequestState: (
        state: FetchState,
        errorMessage: string | null = null
      ) => {
        self._apiRequestState = state;
        self._apiRequestErrorMessage = errorMessage;
      },

      /**
       * This is an abstract method and should be overriden from Store that is
       * composed from RequestState.
       */
      reset(_: FetchState, _2: string | null = null) {
        throw new Error(
          "Mobx-state-tree: Every model that is composed from RequestState should have it's own reset() function!"
        );
      },

      /**
       * In case of request error, we will check error status code
       * in order to determine, whether it failed due to invalid
       * access token. If it is the case, we would like to end this
       * session so we will trigger signOut, which resets whole
       * mobx tree and we will provide error details for Login screen
       * to show user the reason of "failure".
       *
       * @param error api response ErrorType
       */
      checkInsufficientPermission: flow(function* (error: ErrorType) {
        if (error.statusCode === 401 || error.statusCode === 403) {
          const root = getRoot<RootStoreModel>(self);
          // Most probably, the access token is invalid anyways. We will
          // just make sure that it will be invalided on server by
          // sending 'logout' request manually.
          yield root.authStore.signOut();
          root.authStore.setRequestState(
            "error",
            "Session has probably ended. Please sign in again."
          );
          return true;
        }
        return false;
      }),
    };
  })
  .actions((self) => {
    return {
      /**
       * Basically, all stores that are composed from RequestState should use this
       * wrapper in order to fetch remote data. This wrapper will provide some
       * basic functionality like api status/errors handling so this code does
       * not have to be repeated in every API call action.
       *
       * NOTE that after calling this function it is up to Stores to set api
       * state back to "stale" or some other value. It is implemented this
       * way in order to allow Stores do some more data processing and things
       * like that before any Loading component is unmounted from screen.
       *
       * @param validatePermissions is boolean, which should be set to true
       *    whenever we need to watch response for 401/403 return HTTP codes.
       * @param fetchApiFunc is function used to fetch the data.
       * @param args are arguments to inject during 'func' function call.
       */
      sendApiRequest: flow(function* <
        ApiResponseType extends {},
        ApiFunction extends Function
      >(
        validatePermissions: boolean,
        fetchApiFunc: ApiFunction,
        ...args: ArgumentTypes<ApiFunction>
      ) {
        // 1. set api state to pending
        self.setRequestState("pending");
        // 2. fetch data with given func and args
        const result = yield* toGenerator<FetchReturnType<ApiResponseType>>(
          fetchApiFunc(...args)
        );
        if (result.status === "error") {
          // 3. if request failed, we will always return null
          if (
            validatePermissions &&
            (yield self.checkInsufficientPermission(result.data))
          ) {
            return null;
          }

          self.reset("error", result.data.message);
          return null;
        }
        // 4. If the result was OK then we can provide data to the caller
        return result;
      }),
    };
  });
