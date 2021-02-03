import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import TextInput from "../TextInput";

test("renders the passed label", () => {
  const { getByText } = render(<TextInput labelText="Test Label" />);

  expect(getByText("Test Label")).not.toBeNull();
});

test("forwards remaining props to the underlying FormGroup", () => {
  const onChangeTextMock = jest.fn();

  const { getByTestId } = render(
    <TextInput labelText="Test Label" onChangeText={onChangeTextMock} />
  );

  fireEvent.changeText(getByTestId("components-form-textinput"), "Username");
  expect(onChangeTextMock).toHaveBeenCalled();
  expect(onChangeTextMock).toHaveBeenCalledWith("Username");
});
