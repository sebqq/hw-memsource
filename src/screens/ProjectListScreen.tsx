import React from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";

import { useStore } from "../mobx/useStore";
import ContainerLoadingIndicator from "../components/Loading/ContainerLoadingIndicator";
import ProjectList from "../components/ProjectListScreen/ProjectList";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../utils/theme";

const ProjectListScreen = observer(() => {
  const { authStore } = useStore();

  return (
    <>
      <SafeAreaView style={styles.innerContainer}>
        <ProjectList />
      </SafeAreaView>
      {authStore.requestState.state === "pending" && (
        <ContainerLoadingIndicator indicatorSize="large" text="Singin out..." />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: theme.colors.gray[100],
  },
});

export default ProjectListScreen;
