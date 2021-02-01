import React from "react";
import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";
import theme from "../utils/theme";

type Props = {
  colorScheme: string;
  size?: number;
  containerStyles?: StyleProp<ViewStyle>;
};

function parseColorScheme(colorScheme: string) {
  const colorTheme = theme.colors.hasOwnProperty(colorScheme)
    ? theme.colors[colorScheme as keyof typeof theme.colors]
    : theme.colors.gray;

  return {
    bg: colorTheme["100"],
    textColor: colorTheme["600"],
  };
}

const Badge: React.FC<Props> = ({
  colorScheme,
  size = 22,
  containerStyles,
  children,
}) => {
  const coloring = parseColorScheme(colorScheme);

  return (
    <View
      style={[
        styles.container,
        {
          height: size,
          backgroundColor: coloring.bg,
        },
        containerStyles,
      ]}
    >
      <Text style={[styles.text, { color: coloring.textColor }]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    paddingHorizontal: 2,
  },
  text: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default Badge;
