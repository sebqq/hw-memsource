import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { observer } from "mobx-react-lite";

import ProjectStatusBadge from "../ProjectStatusBadge";
import { useStore } from "../../mobx/useStore";
import theme from "../../utils/theme";

type Props = {
  uid: string;
  onPress: (uid: string, name: string) => void;
};

/**
 * We are basically providing only 'uid' as project identificator here
 * as we are going to fetch project from mobx-state-tree using observer.
 * Component is Pure so it should not re-render until uid and onPress
 * refferences stays same during parent lifecycle.
 *
 * However, List item is going to be fully reactive whenever relevant data
 * in mobx-state-tree are changed.
 *
 * @param uid uid of project, which should be displayed
 * @param onPress
 */
const ProjectListItem: React.FC<Props> = ({ uid, onPress }) => {
  const { projectStore } = useStore();
  const project = projectStore.getProjectByUid(uid);

  if (!project) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => onPress(uid, project.name)}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.header} numberOfLines={1}>
            {project.name}
          </Text>
        </View>
        <View style={styles.verticalSpacer} />
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Status: </Text>
          <ProjectStatusBadge
            status={project.status}
            containerStyles={styles.headerBadge}
          />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Created on: </Text>
          <Text style={styles.value}>{project.dateCreatedString()}</Text>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Due: </Text>
          <Text style={styles.value}>{project.dateDueString()}</Text>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Source:</Text>
          <Text style={styles.value}>{project.sourceLang}</Text>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Target: </Text>
          <Text style={styles.value} numberOfLines={1}>
            {project.targetLangs?.join(", ")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
  },
  headingContainer: {
    flexDirection: "row",
  },
  headerBadge: { marginLeft: 10 },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.gray[700],
  },
  labelContainer: {
    flex: 1,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: theme.colors.gray[500],
  },
  value: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "right",
    marginLeft: 10,
    color: theme.colors.gray[800],
  },
  verticalSpacer: {
    marginVertical: 8,
  },
});

export default React.memo(observer(ProjectListItem));
