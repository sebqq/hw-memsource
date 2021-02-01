import { useReducer } from "react";

export type DueInHoursType = 4 | 8 | 24 | 72 | "anyDueDate";

type FilterState = { status: "ready" | "incomplete"; value: DueInHoursType };
type FilterAction =
  | { type: "ready"; payload: DueInHoursType }
  | { type: "incomplete"; payload: DueInHoursType };

function filterReducer(_: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "incomplete":
      return { status: "incomplete", value: action.payload };
    case "ready":
      return { status: "ready", value: action.payload };
  }
}

const useDueFilterReducer = (initValue: DueInHoursType) => {
  return useReducer(filterReducer, { status: "ready", value: initValue });
};

export default useDueFilterReducer;
