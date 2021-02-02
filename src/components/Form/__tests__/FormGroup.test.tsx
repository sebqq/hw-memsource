import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import FormGroup from "../FormGroup";

test("renders the passed label", () => {
  const { getByText } = render(<FormGroup labelText="Test Label" />);

  expect(getByText("Test Label")).not.toBeNull();
});

test("forwards remaining props to the underlying FormGroup", () => {
  const onChangeTextMock = jest.fn();

  const { getByTestId } = render(
    <FormGroup labelText="Test Label" onChangeText={onChangeTextMock} />
  );

  fireEvent.changeText(getByTestId("components-form-formgroup"), "Username");
  expect(onChangeTextMock).toHaveBeenCalled();
  expect(onChangeTextMock).toHaveBeenCalledWith("Username");
});
