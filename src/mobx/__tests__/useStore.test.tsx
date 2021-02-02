import * as React from "react";
import { renderHook } from "@testing-library/react-hooks";

import { StoreProvider, useStore } from "../../mobx/useStore";
import { createStore } from "../../mobx/createStore";

describe("useStore Tests", () => {
  it("Test useStore returns complete store", () => {
    const wrapper: React.FC = ({ children }) => {
      return <StoreProvider>{children}</StoreProvider>;
    };

    const { result } = renderHook(() => useStore(), {
      wrapper,
    });

    expect(result.current).toStrictEqual(createStore());
  });
});
