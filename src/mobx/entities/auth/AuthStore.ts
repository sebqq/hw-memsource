import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  types,
  flow,
  applySnapshot,
  SnapshotOrInstance,
  Instance,
  getRoot,
} from "mobx-state-tree";
import dayjs from "dayjs";

import { User } from "./User";
import {
  UserResponse,
  LoginResponse,
  WhoAmIResponse,
} from "../../../api/models";
import authAPI from "../../../api/endpoints/auth";
import { FetchState } from "../../types";
import { FetchReturnType } from "../../../api/fetch";
import {
  BaseRequestState,
  BASE_REQUEST_INIT_STATE,
  SendRequestReturnType,
} from "../api/RequestState";
import { RootStoreModel } from "../../createStore";
import { str2date } from "../../../utils/helpers";

export type AuthStoreModel = Instance<typeof AuthStore>;

/**
 * Why I've decided to store auth token inside of AsyncStorage:
 * - AsyncStorage saves data under "application context" so in theory only
 *   this application should have access to the token.
 * - Of course, if user has "rooted" his Android phone or "jailbreaked" his
 *   iPhone, this sandbox does not provide sufficient safety any more.
 */
let AuthStorageKey = "@Memsource:AuthToken";
/**
 * Format of persisted data inside of AsyncStorage
 */
type PersistedValue = {
  token: string;
  expires: string;
} | null;

export const AUTH_INIT_STATE = {
  ...BASE_REQUEST_INIT_STATE,
  authenticated: false,
  token: null,
  expires: null,
  user: null,
};

/**
 * Creates Mobx snapshot (Mostly) from API data.
 *
 * @param token token's value
 * @param expires token's expiration time
 * @param user user object that came from remote API
 * @param state state of auth request
 * @param errorMessage error message from API
 */
function convertToSnapshot(
  token: string,
  expires: string,
  user: UserResponse,
  state: FetchState,
  errorMessage = null
) {
  const userSnapshot: SnapshotOrInstance<typeof User> = {
    email: user.email,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id,
    uid: user.uid,
  };
  const authSnapshot: SnapshotOrInstance<typeof AuthStore> = {
    authenticated: true,
    user: userSnapshot,
    token: token,
    expires: expires,
    _apiRequestState: state,
    _apiRequestErrorMessage: errorMessage,
  };
  return authSnapshot;
}

export const AuthStore = types
  .compose(
    BaseRequestState,
    types.model("AuthStore", {
      authenticated: types.boolean,
      user: types.maybeNull(User),
      token: types.maybeNull(types.string),
      expires: types.maybeNull(types.string),
    })
  )
  .views((self) => {
    return {
      isTokenExpired(externalString?: string) {
        const dateString = externalString ?? self.expires;
        if (!dateString) {
          throw true;
        }
        const expiresObj = str2date(dateString);
        if (!expiresObj.isValid()) {
          return true;
        }
        return dayjs().isAfter(expiresObj);
      },
    };
  })
  .actions((self) => {
    const reset = (state: FetchState, errorMessage: string | null = null) => {
      self.authenticated = false;
      self.token = null;
      self.user = null;
      self.expires = null;
      self.setRequestState(state, errorMessage);
      AsyncStorage.removeItem(AuthStorageKey).catch(() => null);
    };

    /**
     * This method should run on app initialization.
     *
     * Purpose of this method is to:
     *  1. Fetch possibly stored Auth credentials from AsyncStorage.
     *  2. Check if credentials are still valid on remote server.
     *  3. Store active user if credentials are valid.
     */
    const hydrate = flow(function* () {
      self.setRequestState("pending");
      // We pick auth details from AsyncStorage
      const storedAuth = yield AsyncStorage.getItem(AuthStorageKey);
      const authInfo: PersistedValue = storedAuth
        ? JSON.parse(storedAuth)
        : null;

      if (!authInfo || !authInfo.token) {
        return reset("stale");
      }
      if (authInfo.expires && self.isTokenExpired(authInfo.expires)) {
        return reset("expired");
      }

      // if token is not expired yet, try to validate it against remote API.
      const result: FetchReturnType<WhoAmIResponse> = yield authAPI.validateSession(
        authInfo.token
      );
      if (result.status === "error") {
        return reset("expired");
      }
      // if the code execution got here, token should be still valid.
      const authSnapshot = convertToSnapshot(
        authInfo.token,
        authInfo.expires,
        result.data.user,
        "stale"
      );
      applySnapshot(self, authSnapshot);
    });

    const persist = (snapshot: SnapshotOrInstance<typeof self>) => {
      // save it to localStorage
      AsyncStorage.setItem(
        AuthStorageKey,
        JSON.stringify({ token: snapshot.token, expires: snapshot.expires })
      );
    };

    const afterCreate = () => {
      hydrate();
    };

    return {
      persist,
      afterCreate,
      hydrate,
      reset,
    };
  })
  .actions((self) => {
    return {
      /**
       * Async API operation to logout currently logged in user based on access token.
       *
       * Sign Out action doesn't need to use 'sendApiRequest' from RequestState as it's
       * result isn't really important. We just want to make our token invalidated so
       * if it is already no longer valid on server, then we are okay even with "bad"
       * response.
       *
       * Of course there can be also case when server cannot be reached, but for now
       * we are okay with just deleting access key from cient in this situation.
       */
      signOut: flow(function* () {
        const root = getRoot<RootStoreModel>(self);

        self.setRequestState("pending");
        if (self.authenticated && self.token) {
          // we are not catching any API errors as user will be logged out anyways
          yield authAPI.logout(self.token);
        }
        // reset all stores
        root.resetAll();
      }),

      /**
       * Async operation to log in user by provided userName and password.
       */
      signIn: flow(function* (userName: string, password: string) {
        const result: SendRequestReturnType<LoginResponse> = yield self.sendApiRequest(
          false,
          authAPI.login,
          userName,
          password
        );
        if (!result) {
          return;
        }

        const authSnapshot = convertToSnapshot(
          result.data.token,
          result.data.expires,
          result.data.user,
          "stale"
        );
        applySnapshot(self, authSnapshot);
      }),
    };
  });
