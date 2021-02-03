import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react-lite";
import * as WebBrowser from "expo-web-browser";

// @ts-ignore
import EmptyImage from "../../../assets/emptylist.png";
import { useStore } from "../../mobx/useStore";
import { DueInHoursType } from "./useDueFilterReducer";
import theme from "../../utils/theme";

type Props = {
  dueInHours: DueInHoursType;
};

const ProjectListEmptyItem = ({ dueInHours }: Props) => {
  const { projectStore } = useStore();

  async function createNewProject() {
    WebBrowser.openBrowserAsync("https://cloud.memsource.com/web/project/list");
  }

  return (
    <View style={styles.container}>
      <Image source={EmptyImage} style={styles.image} />
      {projectStore.requestState.state === "error" ? (
        <Text style={styles.heading}>
          {projectStore.requestState.errorMessage ??
            "Something went wrong during data fetching."}
        </Text>
      ) : (
        <>
          <Text style={styles.heading}>
            {dueInHours === "anyDueDate"
              ? "There is no project to display."
              : "There are no projects for selected Due filter."}
          </Text>
          <Text style={styles.callToAction}>Do you wish to create one?</Text>
          <View style={styles.buttonContainer}>
            <Button title={"Go to Dashboard"} onPress={createNewProject} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  image: {
    width: 300,
    height: 160,
  },
  heading: {
    fontSize: 16,
    color: theme.colors.gray[600],
    paddingHorizontal: 12,
    textAlign: "center",
    marginTop: 40,
  },
  callToAction: {
    fontSize: 22,
    textAlign: "center",
    paddingHorizontal: 12,
    color: theme.colors.gray[800],
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default observer(ProjectListEmptyItem);
