import React from "react";
import { Text, StyleSheet } from "react-native";

import theme from "../../utils/theme";

type Props = {
  testID?: string;
  error: boolean;
  errorText?: string | null;
};

const ErrorText: React.FC<Props> = ({ error, errorText, testID }) => {
  return (
    <Text testID={testID} style={styles.text}>
      {error ? errorText ?? "Unexpected error hapenned" : null}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: theme.colors.red[400],
    fontWeight: "bold",
  },
});

export default ErrorText;
