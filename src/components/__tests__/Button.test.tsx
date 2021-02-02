import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { mockComponent } from "../../../testing-config/mockComponent";
import Button, { ButtonProps } from "../Button";

jest.mock(
  "react-native/Libraries/Components/Touchable/TouchableOpacity",
  () => {
    return mockComponent(
      "react-native/Libraries/Components/Touchable/TouchableOpacity",
      (props: ButtonProps) => {
        return { onPress: props.disabled ? () => null : props.onPress };
      }
    );
  }
);

test("onPress is not called when button is disabled", () => {
  const onPressMock = jest.fn();
  const { getByTestId } = render(<Button text="Test" onPress={onPressMock} />);

  fireEvent.press(getByTestId("components-button"));
  expect(onPressMock).toHaveBeenCalled();
});

test("onPress is not called when button is disabled", () => {
  const onPressMock = jest.fn();
  const { getByTestId } = render(
    <Button text="Test" onPress={onPressMock} disabled />
  );

  fireEvent.press(getByTestId("components-button"));
  expect(onPressMock).not.toHaveBeenCalled();
});
