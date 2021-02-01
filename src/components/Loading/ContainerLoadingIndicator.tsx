import React from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import theme from "../../utils/theme";

type Props = {
  text?: string;
  indicatorSize?: "large" | "small";
};

const ContainerLoadingIndicator: React.FC<Props> = ({
  text,
  indicatorSize = "large",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <ActivityIndicator
          size={indicatorSize}
          color={theme.colors.blue[200]}
        />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    backgroundColor: theme.colors.blackAlpha[800],
    borderRadius: 10,
    minHeight: 170,
    minWidth: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default ContainerLoadingIndicator;
