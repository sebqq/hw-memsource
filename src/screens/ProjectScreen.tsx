import React from "react";
import { View, StyleSheet } from "react-native";

import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootStack";
import ProjectInfo from "../components/ProjectScreen/ProjectInfo";

type Props = {
  route: RouteProp<RootStackParamList, "ProjectScreen">;
};

const ProjectScreen = ({ route }: Props) => {
  return (
    <View style={styles.innerContainer}>
      <ProjectInfo uid={route.params.uid} />
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    position: "relative",
  },
  error: {
    fontSize: 18,
  },
});

export default ProjectScreen;
