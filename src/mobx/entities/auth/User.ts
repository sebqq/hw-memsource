import { types } from "mobx-state-tree";

export const User = types.model("User", {
  firstName: types.string,
  lastName: types.string,
  userName: types.string,
  email: types.string,
  id: types.string,
  uid: types.string,
});
