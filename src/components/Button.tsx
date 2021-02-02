import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  GestureResponderEvent,
} from "react-native";
import theme from "../utils/theme";

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.blue[500],
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 45,
    alignItems: "center",
  },
  buttonLoading: {
    backgroundColor: theme.colors.blue[400],
  },
  text: {
    fontWeight: "500",
    fontSize: 18,
    color: "#fff",
  },
});

export type ButtonProps = {
  onPress: (evt: GestureResponderEvent) => void;
  text: string;
  disabled?: boolean;
} & TouchableOpacityProps;

const Button = ({
  testID,
  text,
  onPress,
  disabled = false,
  style = {},
  ...otherTouchableProps
}: ButtonProps) => (
  <TouchableOpacity
    {...otherTouchableProps}
    testID={testID ?? "components-button"}
    onPress={onPress}
    style={[styles.button, disabled && styles.buttonLoading, style]}
    disabled={disabled}
  >
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

export default Button;
