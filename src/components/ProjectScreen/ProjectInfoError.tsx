import React from "react";
import { View, Text, StyleSheet } from "react-native";

import theme from "../../utils/theme";

const ProjectInfoError = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Failed to fetch this project.</Text>
      <Text style={styles.note}>
        Following data may be no longer valid or incomplete.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.red[100],
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.red[800],
    marginBottom: 5,
  },
  note: {
    textAlign: "center",
    fontSize: 14,
    color: theme.colors.red[800],
    marginBottom: 10,
  },
});

export default ProjectInfoError;
