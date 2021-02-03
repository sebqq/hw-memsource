import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  RefreshControl,
} from "react-native";
import { observer } from "mobx-react-lite";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/RootStack";
import { formatProjectInfoSectionListData, ProjectInfoRowData } from "./utils";
import { useStore } from "../../mobx/useStore";
import ProjectInfoError from "./ProjectInfoError";
import theme from "../../utils/theme";

type NavProp = NavigationProp<RootStackParamList, "ProjectScreen">;
type Props = {
  uid: string;
};

const REFRESH_CONTROL_COLORS = [theme.colors.blue[200], theme.colors.blue[300]];

const keyExtractor = (item: ProjectInfoRowData) => {
  return `ms-project-item-key-${item.label}`;
};

/**
 * Section list displaying details about specified Project.
 *
 * @param uid - project's uid
 */
const ProjectInfo = ({ uid }: Props) => {
  const navigation = useNavigation<NavProp>();
  const { projectStore } = useStore();
  const project = projectStore.getProjectByUid(uid);
  const listData = formatProjectInfoSectionListData(project);

  const [refresh, setRefresh] = useState(false);

  const onRefresh = useCallback(async () => {
    if (project) {
      setRefresh(true);
      await project.refresh();
      setRefresh(false);
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ProjectInfoRowData }) => <SectionItem item={item} />,
    []
  );

  const renderHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => {
      return <SectionHeader>{title}</SectionHeader>;
    },
    []
  );

  /**
   * This effect takes care of situation when user tried to "reload" section list
   * data but server deosn't recognized this uid (it could be removed or access token
   * is no longer valid, etc.).
   *
   * We would like to inject navigation's goBack event with custom logic that will
   * remove this project from mobx-state-tree so it would be not displayed in project
   * list.
   */
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      if (project && project.requestState.state === "error") {
        project.destroy();
      }
    });

    return unsubscribe;
  }, [navigation]);

  /**
   * If we hit performance problems here we could always use official guide to
   * tweak List properties and/or provide custom getItemLayout function if possible.
   *
   * https://reactnative.dev/docs/optimizing-flatlist-configuration
   */
  return (
    <>
      {project?.requestState.state === "error" && <ProjectInfoError />}
      <SectionList
        sections={listData}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            colors={REFRESH_CONTROL_COLORS}
            tintColor={REFRESH_CONTROL_COLORS[0]}
            refreshing={refresh}
            onRefresh={onRefresh}
          />
        }
        refreshing={refresh}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
        ItemSeparatorComponent={SectionItemSeparator}
        SectionSeparatorComponent={SectionSeparator}
      />
    </>
  );
};

const SectionHeader: React.FC = ({ children }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{children}</Text>
      <View style={styles.headerHr} />
    </View>
  );
};

/**
 * If we hit performance problems we could always memoize this component
 * Using React.memo() and provide custom shouldUpdate callback function.
 */
const SectionItem = ({ item }: { item: ProjectInfoRowData }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLabel}>{item.label}</Text>
      <Text style={styles.itemValue}>
        {item.value ?? item.processor?.() ?? ""}
      </Text>
    </View>
  );
};

const SectionItemSeparator = () => {
  return <View style={styles.itemSpacer} />;
};

const SectionSeparator = () => {
  return <View style={styles.sectionSpacer} />;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginHorizontal: 16,
    paddingTop: 16,
  },
  itemSpacer: {
    height: 10,
  },
  sectionSpacer: {
    height: 20,
  },
  header: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: theme.colors.gray[100],
    width: "100%",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: theme.colors.gray[500],
  },
  headerHr: {
    flex: 1,
    marginLeft: 10,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.gray[300],
  },

  itemContainer: {
    justifyContent: "space-between",
    marginHorizontal: 10,
    flexDirection: "row",
  },
  itemLabel: {
    fontSize: 16,
    color: theme.colors.gray[800],
  },
  itemValue: {
    marginLeft: 10,
    textAlign: "right",
    flexShrink: 1,
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.gray[800],
  },
});

export default observer(ProjectInfo);
